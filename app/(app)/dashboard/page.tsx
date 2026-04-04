"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Download,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Crown,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Key,
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  credits: number
  creditsUsed: number
}

interface SearchRecord {
  id: string
  businessType: string
  location: string
  country: string
  resultsCount: number
  status: string
  createdAt: string
  _count: { leads: number }
}

const PLAN_COLORS: Record<string, string> = {
  FREE: "text-slate-400",
  STARTER: "text-blue-400",
  PRO: "text-violet-400",
  ENTERPRISE: "text-amber-400",
}

const PLAN_BADGES: Record<string, "outline" | "blue" | "purple" | "warning"> = {
  FREE: "outline",
  STARTER: "blue",
  PRO: "purple",
  ENTERPRISE: "warning",
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searches, setSearches] = useState<SearchRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, searchRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/search"),
        ])

        if (!userRes.ok) {
          router.push("/login")
          return
        }

        const userData = await userRes.json()
        setUser(userData.user)

        if (searchRes.ok) {
          const searchData = await searchRes.json()
          setSearches(searchData.searches || [])
        }
      } catch {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  async function handleUpgrade(plan: string) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-bg grid-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const creditsRemaining = user.credits - user.creditsUsed
  const creditsPercent = (user.creditsUsed / user.credits) * 100

  const totalLeads = searches.reduce((sum, s) => sum + (s._count?.leads || 0), 0)

  return (
    <div className="min-h-screen hero-bg grid-bg">
      <Navbar />

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"}
            </h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={PLAN_BADGES[user.plan] || "outline"} className="px-3 py-1">
              <Crown className="w-3 h-3 mr-1.5" />
              {user.plan} Plan
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Credits */}
          <div className="glass-card p-5 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400 font-medium">Monthly Credits</span>
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-black text-white">{creditsRemaining}</span>
              <span className="text-slate-500 mb-1">/ {user.credits} remaining</span>
            </div>
            <Progress
              value={creditsPercent}
              className="h-2 bg-white/10"
            />
            <p className="text-xs text-slate-500 mt-2">
              {user.creditsUsed} leads generated this month
            </p>
          </div>

          {/* Total leads */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400 font-medium">Total Leads</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{totalLeads}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </div>

          {/* Searches */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400 font-medium">Searches</span>
              <Search className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{searches.length}</div>
            <p className="text-xs text-slate-500 mt-1">Total searches</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search history */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Searches</h2>
              <Link href="/app">
                <Button variant="gradient" size="sm" className="gap-2">
                  <Search className="w-3.5 h-3.5" />
                  New Search
                </Button>
              </Link>
            </div>

            {searches.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No searches yet</p>
                <Link href="/app">
                  <Button variant="gradient" size="sm">
                    Start searching
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {searches.map((search) => (
                  <div
                    key={search.id}
                    className="glass-card p-4 flex items-center justify-between group hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {search.businessType} in {search.location}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {search._count?.leads || search.resultsCount} leads
                          </span>
                          <span className="text-slate-700">·</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(search.createdAt).toLocaleDateString()}
                          </span>
                          <Badge
                            variant={
                              search.status === "COMPLETED"
                                ? "success"
                                : search.status === "FAILED"
                                ? "destructive"
                                : "warning"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {search.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`/api/export?searchId=${search.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs text-slate-400 hover:text-white">
                          <Download className="w-3.5 h-3.5" />
                          CSV
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Plan info */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Your Plan</h3>
              <div className={`text-2xl font-black mb-1 ${PLAN_COLORS[user.plan]}`}>
                {user.plan}
              </div>
              <p className="text-sm text-slate-400 mb-4">
                {user.credits} leads/month
              </p>

              {user.plan === "FREE" && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 mb-3">
                    Upgrade to unlock more leads and features
                  </p>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleUpgrade("STARTER")}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Upgrade to Starter €29/mo
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleUpgrade("PRO")}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Upgrade to Pro €79/mo
                  </Button>
                </div>
              )}

              {user.plan === "STARTER" && (
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleUpgrade("PRO")}
                >
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade to Pro
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* API Key (PRO+) */}
            {["PRO", "ENTERPRISE"].includes(user.plan) && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-violet-400" />
                  API Access
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Use your API key to integrate GeoLeads into your workflow
                </p>
                <Link href="/dashboard/api">
                  <Button variant="glass" size="sm" className="w-full">
                    Manage API Keys
                  </Button>
                </Link>
              </div>
            )}

            {/* Features checklist */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2">
                {[
                  { label: "Basic search", available: true },
                  { label: "CSV export", available: true },
                  { label: "Map view", available: true },
                  {
                    label: "API access",
                    available: ["STARTER", "PRO", "ENTERPRISE"].includes(user.plan),
                  },
                  {
                    label: "AI email generator",
                    available: ["PRO", "ENTERPRISE"].includes(user.plan),
                  },
                  {
                    label: "SIRET/SIREN data",
                    available: ["STARTER", "PRO", "ENTERPRISE"].includes(user.plan),
                  },
                ].map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        feature.available ? "text-emerald-400" : "text-slate-700"
                      }`}
                    />
                    <span
                      className={
                        feature.available ? "text-slate-300" : "text-slate-600"
                      }
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
