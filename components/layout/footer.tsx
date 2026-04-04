import Link from "next/link"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GeoLeads</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              The most powerful B2B lead generation platform. Find any business in the world using Google Maps data.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://twitter.com" className="text-slate-500 hover:text-violet-400 transition-colors text-sm">
                Twitter
              </a>
              <a href="https://linkedin.com" className="text-slate-500 hover:text-violet-400 transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "API Docs", "Changelog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "GDPR", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} GeoLeads. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Data sourced from Google Maps via Apify. Use responsibly.
          </p>
        </div>
      </div>
    </footer>
  )
}
