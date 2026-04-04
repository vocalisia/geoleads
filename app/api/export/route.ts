import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { generateCsvContent } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const searchId = searchParams.get('searchId')

  if (!searchId) {
    return NextResponse.json({ error: 'searchId is required' }, { status: 400 })
  }

  const search = await prisma.search.findFirst({
    where: { id: searchId, userId: session.userId },
    include: { leads: true },
  })

  if (!search) {
    return NextResponse.json({ error: 'Search not found' }, { status: 404 })
  }

  const csvContent = generateCsvContent(
    search.leads as unknown as Record<string, unknown>[]
  )

  const filename = `geoleads-${search.businessType}-${search.location}-${
    new Date(search.createdAt).toISOString().split('T')[0]
  }.csv`

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
