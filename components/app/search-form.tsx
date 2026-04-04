"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, Zap } from "lucide-react"

export interface SearchParams {
  businessType: string
  location: string
  country: string
  maxResults: number
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void
  loading: boolean
}

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
]

const BUSINESS_TYPES = [
  "Dentists",
  "Lawyers",
  "Plumbers",
  "Restaurants",
  "Hotels",
  "Gyms",
  "Pharmacies",
  "Real Estate Agencies",
  "Accountants",
  "Marketing Agencies",
  "Web Agencies",
  "Hair Salons",
  "Car Dealers",
  "Supermarkets",
  "Doctors",
]

const MAX_RESULTS_OPTIONS = [10, 20, 50, 100]

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [businessType, setBusinessType] = useState("")
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("FR")
  const [maxResults, setMaxResults] = useState(20)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!businessType.trim() || !location.trim()) return
    onSearch({ businessType, location, country, maxResults })
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Business type */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">
            Business Type
          </Label>
          <div className="relative">
            <Input
              placeholder="e.g. Dentists, Lawyers..."
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
              list="business-types"
            />
            <datalist id="business-types">
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">
            City / Region
          </Label>
          <Input
            placeholder="e.g. Paris, Lyon..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">
            Country
          </Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {COUNTRIES.map((c) => (
                <SelectItem
                  key={c.code}
                  value={c.code}
                  className="text-slate-300 focus:bg-white/10 focus:text-white"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max results */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">
            Max Results
          </Label>
          <Select
            value={String(maxResults)}
            onValueChange={(v) => setMaxResults(Number(v))}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {MAX_RESULTS_OPTIONS.map((n) => (
                <SelectItem
                  key={n}
                  value={String(n)}
                  className="text-slate-300 focus:bg-white/10 focus:text-white"
                >
                  {n} leads
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={loading || !businessType.trim() || !location.trim()}
        className="w-full md:w-auto gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        {loading ? "Searching Google Maps..." : "Search Leads"}
        {!loading && <Zap className="w-3.5 h-3.5" />}
      </Button>
    </form>
  )
}
