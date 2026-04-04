import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

/**
 * GET /api/user/leads — Returns saved leads for authenticated user
 * Used by the AI Agent page to list leads
 */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const searchId = searchParams.get('searchId')

  const leads = await prisma.lead.findMany({
    where: searchId
      ? { searchId, search: { userId: session.userId } }
      : { search: { userId: session.userId } },
    orderBy: { createdAt: 'desc' },
    take: 500,
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
      website: true,
      rating: true,
      reviewCount: true,
      category: true,
      googleMapsUrl: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ leads, count: leads.length })
}
