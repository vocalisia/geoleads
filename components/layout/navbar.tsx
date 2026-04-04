"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { MapPin, Zap } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isApp = pathname.startsWith("/app") || pathname.startsWith("/dashboard")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">GeoLeads</span>
            <Badge variant="purple" className="text-[10px] px-1.5 py-0">
              BETA
            </Badge>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {!isApp && (
              <>
                <Link
                  href="/#features"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/#api"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  API
                </Link>
              </>
            )}
            {isApp && (
              <>
                <Link
                  href="/app"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Search
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/ai-agent"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium flex items-center gap-1"
                >
                  <span className="text-xs">✦</span>
                  AI Agent
                </Link>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm" className="gap-2">
                <Zap className="w-3.5 h-3.5" />
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
