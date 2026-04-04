"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { SearchForm, type SearchParams } from "@/components/app/search-form"
import { LeadsTable, type Lead } from "@/components/app/leads-table"
import { LeadsMap } from "@/components/app/leads-map"
import { AIAgentPanel } from "@/components/app/ai-agent-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Table2,
  Map,
  Zap,
  AlertCircle,
  Sparkles,
  Info,
  Bot,
  X,
} from "lucide-react"

export default function AppPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchId, setSearchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [creditsUsed, setCreditsUsed] = useState(0)
  const [activeTab, setActiveTab] = useState("table")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [businessContext, setBusinessContext] = useState("")

  async function handleSearch(params: SearchParams) {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setLeads([])

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, useMock: true }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Search failed")
        return
      }

      setLeads(data.leads || [])
      setSearchId(data.searchId)
      setCreditsUsed(data.creditsUsed || 0)
      setIsAnonymous(!data.searchId)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    if (!searchId) return

    const url = `/api/export?searchId=${searchId}`
    const a = document.createElement("a")
    a.href = url
    a.download = "geoleads-export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function handleExportCsvDirect() {
    if (leads.length === 0) return

    const headers = ["Name", "Address", "Phone", "Email", "Website", "Rating", "Reviews", "Category", "Latitude", "Longitude"]
    const rows = leads.map((l) => [
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.address || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.website || "").replace(/"/g, '""')}"`,
      l.rating || "",
      l.reviewCount || "",
      `"${(l.category || "").replace(/"/g, '""')}"`,
      l.latitude || "",
      l.longitude || "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "geoleads-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen hero-bg grid-bg">
      <Navbar />

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Lead Search</h1>
            <p className="text-slate-400 text-sm">
              Search any business type in any location worldwide
            </p>
          </div>
          <div className="flex items-center gap-2">
            {leads.length > 0 && (
              <Button
                variant="gradient-green"
                size="sm"
                className="gap-2"
                onClick={searchId ? handleExport : handleExportCsvDirect}
              >
                <Download className="w-4 h-4" />
                Export CSV ({leads.length})
              </Button>
            )}
          </div>
        </div>

        {/* Search form */}
        <div className="mb-6">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Anonymous notice */}
        {isAnonymous && leads.length > 0 && (
          <div className="mb-4 glass-card p-4 border-violet-500/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-slate-300">
                You&apos;re searching as a guest. Results are limited to 5 leads.{" "}
                <Link href="/register" className="text-violet-400 hover:underline font-medium">
                  Create a free account
                </Link>{" "}
                to get 50 leads/month and save your searches.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 glass-card p-4 border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && (
          <div>
            {/* Stats bar */}
            {leads.length > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="success" className="gap-1.5">
                  <Zap className="w-3 h-3" />
                  {leads.length} leads found
                </Badge>
                {creditsUsed > 0 && (
                  <span className="text-xs text-slate-500">
                    {creditsUsed} credit{creditsUsed !== 1 ? "s" : ""} used
                  </span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="blue" className="text-xs gap-1 cursor-pointer">
                    <Sparkles className="w-3 h-3" />
                    AI emails available on Pro
                  </Badge>
                </div>
              </div>
            )}

            {/* Table/Map + AI Panel */}
            {leads.length > 0 && (
              <div className={`flex gap-4 ${selectedLead ? "items-start" : ""}`}>
                {/* Main panel */}
                <div className={`flex-1 min-w-0 transition-all ${selectedLead ? "max-w-[60%]" : ""}`}>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white/5 border border-white/10 mb-4">
                      <TabsTrigger
                        value="table"
                        className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400 gap-2"
                      >
                        <Table2 className="w-4 h-4" />
                        Table View
                      </TabsTrigger>
                      <TabsTrigger
                        value="map"
                        className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400 gap-2"
                      >
                        <Map className="w-4 h-4" />
                        Map View
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="table">
                      <LeadsTable
                        leads={leads}
                        canGenerateEmail={false}
                        onSelectLead={setSelectedLead}
                        selectedLeadId={selectedLead?.id}
                      />
                    </TabsContent>

                    <TabsContent value="map">
                      <LeadsMap leads={leads} height="600px" />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* AI Agent side panel */}
                {selectedLead && (
                  <div className="w-[420px] flex-shrink-0 glass-card overflow-hidden" style={{ height: "680px" }}>
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-white">AI Agent</span>
                        <Badge variant="purple" className="text-[10px] px-1.5 py-0">GPT-4o</Badge>
                      </div>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-[calc(100%-42px)]">
                      <AIAgentPanel
                        lead={selectedLead}
                        businessContext={businessContext}
                        onSaveContext={setBusinessContext}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {leads.length === 0 && !error && (
              <div className="glass-card p-12 text-center">
                <p className="text-slate-400">No results found for your search. Try different terms.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasSearched && (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-6 animate-float">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Ready to find leads
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Enter a business type and location above to search Google Maps for qualified B2B leads.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "dentists in Paris",
                "lawyers in London",
                "restaurants in Berlin",
                "gyms in Madrid",
              ].map((example) => (
                <span
                  key={example}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400 bg-white/5 cursor-pointer hover:border-violet-500/50 hover:text-violet-400 transition-colors"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
