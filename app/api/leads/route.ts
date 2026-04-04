import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { scrapeGoogleMaps, getMockLeads } from '@/lib/apify'

/**
 * Public REST API — requires Bearer token (API key or JWT)
 * GET /api/leads?businessType=dentists&location=Paris&country=FR&maxResults=50
 */

const querySchema = z.object({
  businessType: z.string().min(1),
  location: z.string().min(1),
  country: z.string().length(2).default('FR'),
  maxResults: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(req: NextRequest) {
  // Auth via Bearer token
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const session = await verifyToken(token)

  if (!session) {
    // Try API key lookup
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: token, isActive: true },
      include: { user: true },
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Update usage
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date(), requestCount: { increment: 1 } },
    })
  }

  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse({
    businessType: searchParams.get('businessType'),
    location: searchParams.get('location'),
    country: searchParams.get('country'),
    maxResults: searchParams.get('maxResults'),
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { businessType, location, country, maxResults } = parsed.data

  try {
    let leads
    if (process.env.NODE_ENV === 'development') {
      leads = await getMockLeads(businessType, location)
      leads = leads.slice(0, maxResults)
    } else {
      leads = await scrapeGoogleMaps({ searchQuery: businessType, location, maxResults })
    }

    return NextResponse.json({
      success: true,
      data: {
        leads,
        count: leads.length,
        query: { businessType, location, country },
      },
      meta: {
        total: leads.length,
        page: 1,
        limit: maxResults,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Search failed', success: false },
      { status: 500 }
    )
  }
}
