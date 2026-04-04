import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = await prisma.search.findFirst({
    where: { id: params.id, userId: session.userId },
    include: { leads: true },
  })

  if (!search) {
    return NextResponse.json({ error: 'Search not found' }, { status: 404 })
  }

  return NextResponse.json({ search, leads: search.leads })
}
