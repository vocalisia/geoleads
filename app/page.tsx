import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Zap,
  Search,
  Download,
  Globe,
  Star,
  Shield,
  Code2,
  Brain,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Building2,
  Map,
} from "lucide-react"

const STATS = [
  { value: "10M+", label: "Businesses indexed" },
  { value: "150+", label: "Countries covered" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 30s", label: "Search speed" },
]

const FEATURES = [
  {
    icon: Search,
    title: "Smart Business Search",
    description:
      "Search any business type in any city, country or region. Get real data from Google Maps in seconds.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Map,
    title: "Interactive Map View",
    description:
      "Visualize all leads on a Leaflet.js map with clickable pins showing business details.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Download,
    title: "One-Click CSV Export",
    description:
      "Export all leads with name, address, phone, email, website, rating, social links in one click.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Brain,
    title: "AI Email Generator",
    description:
      "GPT-4o generates personalized outreach emails for each lead. Close more deals faster.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Code2,
    title: "REST API Access",
    description:
      "Full public API with JWT auth. Integrate GeoLeads into your CRM, sales tools, or automation.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Building2,
    title: "SIRET/SIREN Data",
    description:
      "French companies get SIRET and SIREN registration numbers — exclusive feature for EU compliance.",
    gradient: "from-indigo-500 to-violet-600",
  },
]

const TESTIMONIALS = [
  {
    name: "Marc Dubois",
    role: "Sales Director, AgenceWeb.fr",
    content:
      "GeoLeads saved us 20+ hours per week. We used to manually search for leads — now we export 500 in 30 seconds.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Founder, OutreachPro",
    content:
      "The AI email generator is insane. We went from 8% reply rate to 23% with personalized emails. Game changer.",
    stars: 5,
  },
  {
    name: "Alessandro Rossi",
    role: "Growth Lead, B2BAccelerator",
    content:
      "Cheapest and most complete lead gen tool on the market. The REST API is what sold me — no other tool has it.",
    stars: 5,
  },
]

const COMPARISON = [
  { feature: "Google Maps data", geoleads: true, competitor: true },
  { feature: "Interactive map view", geoleads: true, competitor: false },
  { feature: "REST API", geoleads: true, competitor: false },
  { feature: "AI email generator", geoleads: true, competitor: false },
  { feature: "SIRET/SIREN data", geoleads: true, competitor: false },
  { feature: "Social media links", geoleads: true, competitor: true },
  { feature: "Starter plan <€30", geoleads: true, competitor: false },
  { feature: "Real-time search", geoleads: true, competitor: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen hero-bg grid-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="purple" className="mb-6 px-4 py-1.5 text-xs animate-pulse-glow">
            <Zap className="w-3 h-3 mr-1.5" />
            Powered by Google Maps + GPT-4o
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="text-white">Find Any Business</span>
            <br />
            <span className="gradient-text">In The World</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate qualified B2B leads from Google Maps in seconds. Name, address, phone, email,
            website, rating, social links — all in one click. Export to CSV instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button variant="gradient" size="xl" className="gap-2 animate-pulse-glow">
                <Zap className="w-5 h-5" />
                Start Free — 50 Leads/Month
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="glass" size="xl" className="gap-2">
                <Search className="w-4 h-4" />
                Try it now — No signup
              </Button>
            </Link>
          </div>

          {/* Demo search bar */}
          <div className="max-w-2xl mx-auto glass-card p-3 flex gap-2 items-center glow-purple">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm">
                dentists in Paris, France
              </span>
            </div>
            <Button variant="gradient" size="sm" className="shrink-0">
              Search
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              50 free leads every month
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead data preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Complete Business Data
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every lead comes with all the data you need to reach out. No more manual research.
            </p>
          </div>

          {/* Data fields */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: "Business Name", color: "text-violet-400" },
              { icon: MapPin, label: "Full Address", color: "text-blue-400" },
              { icon: Phone, label: "Phone Number", color: "text-emerald-400" },
              { icon: Mail, label: "Email Address", color: "text-pink-400" },
              { icon: Globe, label: "Website URL", color: "text-amber-400" },
              { icon: Star, label: "Google Rating", color: "text-yellow-400" },
              { icon: Users, label: "Review Count", color: "text-indigo-400" },
              { icon: MapPin, label: "GPS Coordinates", color: "text-teal-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="glass-card p-4 flex items-center gap-3 hover:border-white/20 transition-colors"
              >
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Plus social links */}
          <div className="mt-4 glass-card p-4 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-500 mr-2">+ Social links:</span>
            {["Facebook", "Instagram", "LinkedIn", "Twitter", "SIRET/SIREN"].map((s) => (
              <Badge key={s} variant="purple" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="blue" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Close Deals
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              GeoLeads combines powerful data extraction with AI tools to supercharge your sales pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 group hover:border-white/20 transition-all hover:scale-[1.02]"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              GeoLeads vs MapiLeads
            </h2>
            <p className="text-slate-400">See why teams are switching</p>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              <div className="p-4 bg-white/5 border-b border-white/10">
                <span className="text-sm font-semibold text-slate-400">Feature</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 border-b border-white/10 text-center">
                <span className="text-sm font-semibold text-white">GeoLeads</span>
                <Badge variant="purple" className="ml-2 text-[10px]">YOU</Badge>
              </div>
              <div className="p-4 bg-white/5 border-b border-white/10 text-center">
                <span className="text-sm font-semibold text-slate-400">MapiLeads</span>
              </div>

              {COMPARISON.map((row, i) => (
                <>
                  <div
                    key={`${row.feature}-label`}
                    className={`p-4 text-sm text-slate-300 border-b border-white/5 ${i === COMPARISON.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {row.feature}
                  </div>
                  <div
                    key={`${row.feature}-geo`}
                    className={`p-4 text-center border-b border-white/5 bg-gradient-to-r from-violet-500/5 to-blue-500/5 ${i === COMPARISON.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {row.geoleads ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </div>
                  <div
                    key={`${row.feature}-comp`}
                    className={`p-4 text-center border-b border-white/5 ${i === COMPARISON.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {row.competitor ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-500 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Loved by Sales Teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API section */}
      <section id="api" className="py-20 px-4 bg-gradient-to-b from-black/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="blue" className="mb-4">
                REST API
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">
                The API MapiLeads Doesn&apos;t Have
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Integrate GeoLeads into your CRM, automation workflows, or custom tools. Full REST API
                with JWT authentication, rate limiting, and webhook support.
              </p>
              <ul className="space-y-3">
                {[
                  "Search leads via API",
                  "Webhook callbacks when scraping completes",
                  "Bulk export endpoints",
                  "OpenAPI documentation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6 font-mono text-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-slate-500">API Example</span>
              </div>
              <pre className="text-violet-300 whitespace-pre-wrap">
{`curl -X POST \\
  https://geoleads.io/api/search \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "businessType": "dentists",
    "location": "Paris",
    "country": "FR",
    "maxResults": 100
  }'`}
              </pre>
              <div className="mt-4 pt-4 border-t border-white/10 text-emerald-400">
                {`// Returns: { leads: [...], count: 100 }`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 mb-8">
            Start free. No credit card required. Upgrade when you need more leads.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { plan: "Free", price: "€0", leads: "50 leads" },
              { plan: "Starter", price: "€29", leads: "500 leads" },
              { plan: "Pro", price: "€79", leads: "2,000 leads" },
              { plan: "Enterprise", price: "€199", leads: "10,000 leads" },
            ].map((p) => (
              <div
                key={p.plan}
                className={`glass-card p-4 text-center ${p.plan === "Pro" ? "border-violet-500/50 glow-purple" : ""}`}
              >
                <div className="text-xs text-slate-500 mb-1">{p.plan}</div>
                <div className="text-2xl font-bold text-white">{p.price}</div>
                <div className="text-xs text-slate-400 mt-1">{p.leads}/mo</div>
              </div>
            ))}
          </div>
          <Link href="/pricing">
            <Button variant="gradient" size="lg">
              See Full Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden glow-purple">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10" />
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">
                Start Finding Leads Today
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Join 1,000+ sales teams already using GeoLeads to find qualified B2B leads in seconds.
              </p>
              <Link href="/register">
                <Button variant="gradient" size="xl" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Get 50 Free Leads Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-xs text-slate-600 mt-4">
                No credit card. 50 leads free every month forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
