import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    credits: 50,
    priceId: null,
    features: [
      '50 leads/month',
      'Basic search',
      'CSV export',
      'Email support',
    ],
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    credits: 500,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '500 leads/month',
      'Advanced filters',
      'CSV export',
      'SIRET/SIREN data',
      'Priority support',
      'API access (100 req/day)',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 79,
    credits: 2000,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '2,000 leads/month',
      'All filters',
      'CSV + Excel export',
      'SIRET/SIREN data',
      'AI email generator',
      'API access (1,000 req/day)',
      'Dedicated support',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 199,
    credits: 10000,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      '10,000 leads/month',
      'Unlimited filters',
      'All export formats',
      'SIRET/SIREN data',
      'AI email generator',
      'Unlimited API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
}
