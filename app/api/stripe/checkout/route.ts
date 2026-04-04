import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe, PLANS } from '@/lib/stripe'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const checkoutSchema = z.object({
  plan: z.enum(['STARTER', 'PRO', 'ENTERPRISE']),
})

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = checkoutSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { plan } = parsed.data
  const planConfig = PLANS[plan]

  if (!planConfig.priceId) {
    return NextResponse.json({ error: 'Plan not configured' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Create or get Stripe customer
  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    })
    customerId = customer.id

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?success=true&plan=${plan}`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
    metadata: { userId: user.id, plan },
    subscription_data: {
      metadata: { userId: user.id, plan },
    },
  })

  return NextResponse.json({ url: stripeSession.url })
}
