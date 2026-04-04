"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AIAgentPanel } from "@/components/app/ai-agent-panel"
import { Bot, Search, Star, MapPin, Phone, Mail, Globe, ChevronRight } from "lucide-react"

interface Lead {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  rating?: number | null
  reviewCount?: number | null
  category?: string | null
  googleMapsUrl?: string | null
}

function LeadCard({
  lead,
  isSelected,
  onSelect,
}: {
  lead: Lead
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "border-white/5 hover:border-white/15 hover:bg-white/2"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium text-sm text-white leading-tight line-clamp-2">{lead.name}</p>
        {lead.rating && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-amber-300">{lead.rating}</span>
          </div>
        )}
      </div>

      {lead.category && (
        <span className="inline-block text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5 mb-2">
          {lead.category}
        </span>
      )}

      <div className="space-y-1">
        {lead.address && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.address}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-2 pt-2 border-t border-violet-500/20">
          <p className="text-xs text-violet-400 font-medium flex items-center gap-1">
            <Bot className="h-3 w-3" />
            AI Agent active
            <ChevronRight className="h-3 w-3 ml-auto" />
          </p>
        </div>
      )}
    </button>
  )
}

export default function AIAgentPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [businessContext, setBusinessContext] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load business context from localStorage
    const savedContext = localStorage.getItem("geoleads_business_context")
    if (savedContext) setBusinessContext(savedContext)

    // Load leads
    async function loadLeads() {
      try {
        const response = await fetch("/api/user/leads")
        if (response.ok) {
          const data = await response.json() as { leads: Lead[] }
          setLeads(data.leads ?? [])
          setFilteredLeads(data.leads ?? [])
        }
      } catch {
        // silently handle
      } finally {
        setIsLoading(false)
      }
    }

    loadLeads()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLeads(leads)
      return
    }
    const q = searchQuery.toLowerCase()
    setFilteredLeads(
      leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(q) ||
          lead.address?.toLowerCase().includes(q) ||
          lead.category?.toLowerCase().includes(q)
      )
    )
  }, [searchQuery, leads])

  function handleSaveContext(ctx: string) {
    setBusinessContext(ctx)
    localStorage.setItem("geoleads_business_context", ctx)
  }

  return (
    <div className="min-h-screen hero-bg grid-bg flex flex-col">
      <Navbar />

      <div
        className="flex-1 flex pt-16 overflow-hidden"
        style={{ height: "calc(100vh - 0px)" }}
      >
        {/* Left panel: Lead list */}
        <div
          className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-black/20"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">AI Agent</h1>
                <p className="text-xs text-slate-500">Your AI sales assistant</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          </div>

          {/* Lead list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-violet-500 border-t-transparent" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3 text-center">
                <Bot className="h-8 w-8 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-400">No leads found</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Search for leads first to use the AI Agent
                  </p>
                </div>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLead?.id === lead.id}
                  onSelect={() => setSelectedLead(lead)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-xs text-slate-600">
              {filteredLeads.length} leads available
            </p>
          </div>
        </div>

        {/* Right panel: AI Agent */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <AIAgentPanel
            lead={selectedLead}
            businessContext={businessContext}
            onSaveContext={handleSaveContext}
          />
        </div>
      </div>
    </div>
  )
}
