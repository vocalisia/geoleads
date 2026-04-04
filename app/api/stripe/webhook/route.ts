import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getPlanCredits } from '@/lib/utils'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as string

        if (!userId || !plan) break

        const credits = getPlanCredits(plan)

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as 'STARTER' | 'PRO' | 'ENTERPRISE',
            credits,
            creditsUsed: 0,
          },
        })

        await prisma.subscription.create({
          data: {
            userId,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: plan,
            plan: plan as 'STARTER' | 'PRO' | 'ENTERPRISE',
            status: 'ACTIVE',
          },
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: 'FREE',
            credits: 50,
            creditsUsed: 0,
          },
        })

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELED' },
        })

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        )
        const userId = subscription.metadata?.userId
        const plan = subscription.metadata?.plan

        if (!userId || !plan) break

        const credits = getPlanCredits(plan)

        await prisma.user.update({
          where: { id: userId },
          data: { credits, creditsUsed: 0 },
        })

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
