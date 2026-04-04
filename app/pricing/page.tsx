import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, ArrowRight } from "lucide-react"

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    leads: 50,
    description: "Perfect for testing the platform",
    features: [
      "50 leads/month",
      "Basic search",
      "Table view",
      "CSV export",
      "Email support",
    ],
    notIncluded: [
      "Map view",
      "AI email generator",
      "API access",
      "SIRET/SIREN data",
    ],
    cta: "Start Free",
    variant: "glass" as const,
    badge: null,
  },
  {
    name: "Starter",
    price: 29,
    period: "/month",
    leads: 500,
    description: "For freelancers and small teams",
    features: [
      "500 leads/month",
      "Advanced search filters",
      "Interactive map view",
      "CSV export",
      "SIRET/SIREN data (FR)",
      "API access (100 req/day)",
      "Priority email support",
    ],
    notIncluded: [
      "AI email generator",
    ],
    cta: "Start Starter",
    variant: "glass" as const,
    badge: null,
  },
  {
    name: "Pro",
    price: 79,
    period: "/month",
    leads: 2000,
    description: "For growing sales teams",
    features: [
      "2,000 leads/month",
      "All search filters",
      "Interactive map view",
      "CSV + Excel export",
      "SIRET/SIREN data (FR)",
      "AI email generator (GPT-4o)",
      "API access (1,000 req/day)",
      "Webhook support",
      "Dedicated support",
    ],
    notIncluded: [],
    cta: "Start Pro",
    variant: "gradient" as const,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: 199,
    period: "/month",
    leads: 10000,
    description: "For agencies and large teams",
    features: [
      "10,000 leads/month",
      "All Pro features",
      "Unlimited API access",
      "Custom integrations",
      "White-label option",
      "Team seats (5 users)",
      "Dedicated account manager",
      "SLA guarantee (99.9%)",
      "Custom onboarding",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    variant: "glass" as const,
    badge: null,
  },
]

const FAQ = [
  {
    q: "How does the credit system work?",
    a: "Each search result counts as 1 credit (1 lead = 1 credit). Credits reset monthly on your billing date.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your dashboard with no penalties. You keep access until the end of your billing period.",
  },
  {
    q: "What data sources do you use?",
    a: "We use Apify's Google Maps scraper to fetch real-time data directly from Google Maps. Data is always fresh.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Free plan gives you 50 leads/month permanently. We recommend starting with the Free plan to test the platform.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all paid plans. Contact support within 7 days of purchase.",
  },
  {
    q: "What is SIRET/SIREN data?",
    a: "SIRET and SIREN are French business registration numbers, required for B2B invoicing in France. We enrich French companies with this data automatically.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen hero-bg grid-bg">
      <Navbar />

      <section className="pt-32 pb-12 px-4 text-center">
        <Badge variant="purple" className="mb-4">
          Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Start free, upgrade when you need more. No hidden fees. Cancel anytime.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            7-day money-back guarantee
          </span>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-6 flex flex-col relative ${
                plan.badge ? "border-violet-500/50 glow-purple scale-[1.02]" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="purple" className="px-3 py-0.5">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    €{plan.price}
                  </span>
                  <span className="text-slate-400 mb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-violet-400 mt-1 font-medium">
                  {plan.leads.toLocaleString()} leads/month
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-4 h-4 shrink-0 mt-0.5 text-center">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.variant === "gradient" && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="glass-card p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="glass-card max-w-2xl mx-auto p-12 glow-purple relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to generate leads?
            </h2>
            <p className="text-slate-400 mb-8">
              Start with 50 free leads — no credit card needed.
            </p>
            <Link href="/register">
              <Button variant="gradient" size="xl">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
