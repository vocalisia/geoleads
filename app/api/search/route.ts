import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { scrapeGoogleMaps, getMockLeads } from '@/lib/apify'

const searchSchema = z.object({
  businessType: z.string().min(1).max(100),
  location: z.string().min(1).max(200),
  country: z.string().length(2).default('FR'),
  maxResults: z.number().int().min(1).max(100).default(20),
  useMock: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = searchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { businessType, location, country, maxResults, useMock } = parsed.data

    // Check auth — anonymous gets limited results
    const session = await getSessionFromRequest(req)
    const effectiveMax = session ? maxResults : Math.min(maxResults, 5)

    let userId: string | null = null
    let creditsAvailable = 5

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, credits: true, creditsUsed: true, plan: true },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const remaining = user.credits - user.creditsUsed
      if (remaining <= 0) {
        return NextResponse.json(
          { error: 'No credits remaining. Please upgrade your plan.' },
          { status: 402 }
        )
      }

      creditsAvailable = remaining
      userId = user.id
    }

    const resultsToFetch = Math.min(effectiveMax, creditsAvailable)

    // Create search record
    let search = null
    if (userId) {
      search = await prisma.search.create({
        data: {
          userId,
          businessType,
          location,
          country,
          status: 'RUNNING',
        },
      })
    }

    // Fetch leads
    let rawLeads
    try {
      if (useMock || process.env.NODE_ENV === 'development') {
        rawLeads = await getMockLeads(businessType, location)
        rawLeads = rawLeads.slice(0, resultsToFetch)
      } else {
        rawLeads = await scrapeGoogleMaps({
          searchQuery: businessType,
          location,
          maxResults: resultsToFetch,
        })
      }
    } catch (scrapeError) {
      // Fallback to mock on error
      rawLeads = await getMockLeads(businessType, location)
      rawLeads = rawLeads.slice(0, Math.min(resultsToFetch, 5))
    }

    // Save leads to DB if user is authenticated
    let savedLeads: typeof rawLeads = rawLeads
    if (userId && search) {
      const leadsData = rawLeads.map((lead) => ({
        searchId: search!.id,
        name: lead.name,
        address: lead.address || null,
        phone: lead.phone || null,
        email: lead.email || null,
        website: lead.website || null,
        rating: lead.rating || null,
        reviewCount: lead.reviewsCount || null,
        category: lead.category || null,
        latitude: lead.latitude || null,
        longitude: lead.longitude || null,
        googleMapsUrl: lead.url || null,
        facebook: lead.facebook || null,
        instagram: lead.instagram || null,
        linkedin: lead.linkedin || null,
        twitter: lead.twitter || null,
      }))

      await prisma.lead.createMany({ data: leadsData })

      // Update search status and user credits
      await prisma.search.update({
        where: { id: search.id },
        data: {
          status: 'COMPLETED',
          resultsCount: rawLeads.length,
          creditsUsed: rawLeads.length,
        },
      })

      await prisma.user.update({
        where: { id: userId },
        data: { creditsUsed: { increment: rawLeads.length } },
      })

      // Fetch saved leads with IDs
      const dbLeads = await prisma.lead.findMany({
        where: { searchId: search.id },
        orderBy: { createdAt: 'asc' },
      })

      return NextResponse.json({
        success: true,
        searchId: search.id,
        leads: dbLeads,
        count: dbLeads.length,
        creditsUsed: rawLeads.length,
      })
    }

    // Anonymous response
    return NextResponse.json({
      success: true,
      searchId: null,
      leads: rawLeads.map((lead, i) => ({
        id: `anon-${i}`,
        name: lead.name,
        address: lead.address,
        phone: lead.phone,
        email: lead.email,
        website: lead.website,
        rating: lead.rating,
        reviewCount: lead.reviewsCount,
        category: lead.category,
        latitude: lead.latitude,
        longitude: lead.longitude,
        googleMapsUrl: lead.url,
      })),
      count: rawLeads.length,
      message: 'Sign up to save searches and get more leads',
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searches = await prisma.search.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      _count: { select: { leads: true } },
    },
  })

  return NextResponse.json({ searches })
}
