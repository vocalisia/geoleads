"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Phone,
  Mail,
  Star,
  MapPin,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
} from "lucide-react"

export interface Lead {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  rating?: number | null
  reviewCount?: number | null
  category?: string | null
  latitude?: number | null
  longitude?: number | null
  googleMapsUrl?: string | null
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  twitter?: string | null
  siret?: string | null
  siren?: string | null
}

interface LeadsTableProps {
  leads: Lead[]
  onGenerateEmail?: (lead: Lead) => void
  canGenerateEmail?: boolean
  onSelectLead?: (lead: Lead) => void
  selectedLeadId?: string | null
}

export function LeadsTable({ leads, onGenerateEmail, canGenerateEmail, onSelectLead, selectedLeadId }: LeadsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  if (leads.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No leads found. Try a different search.</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full leads-table">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Business</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Rating</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Social</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                className={`border-b border-white/5 transition-colors cursor-pointer ${
                  selectedLeadId === lead.id
                    ? "bg-violet-500/10 border-violet-500/20"
                    : hoveredRow === lead.id ? "bg-white/5" : ""
                }`}
                onMouseEnter={() => setHoveredRow(lead.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onSelectLead?.(lead)}
              >
                {/* Index */}
                <td className="p-4 text-slate-500 text-sm">{index + 1}</td>

                {/* Business name + category */}
                <td className="p-4 min-w-[200px]">
                  <div className="font-medium text-white text-sm">{lead.name}</div>
                  {lead.category && (
                    <Badge variant="purple" className="text-[10px] mt-1 px-1.5 py-0">
                      {lead.category}
                    </Badge>
                  )}
                  {lead.siret && (
                    <div className="text-[10px] text-slate-500 mt-1">
                      SIRET: {lead.siret}
                    </div>
                  )}
                </td>

                {/* Contact */}
                <td className="p-4 min-w-[200px]">
                  <div className="space-y-1">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-violet-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-violet-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{lead.email}</span>
                      </a>
                    )}
                    {lead.website && (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-violet-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {lead.website.replace(/^https?:\/\//, '')}
                        </span>
                      </a>
                    )}
                  </div>
                </td>

                {/* Rating */}
                <td className="p-4">
                  {lead.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-white font-medium">
                        {lead.rating.toFixed(1)}
                      </span>
                      {lead.reviewCount ? (
                        <span className="text-xs text-slate-500">
                          ({lead.reviewCount})
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </td>

                {/* Location */}
                <td className="p-4 min-w-[180px]">
                  {lead.address ? (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        {lead.address}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </td>

                {/* Social links */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {lead.facebook && (
                      <a
                        href={lead.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {lead.instagram && (
                      <a
                        href={lead.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-pink-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {lead.linkedin && (
                      <a
                        href={lead.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {lead.twitter && (
                      <a
                        href={lead.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-sky-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {!lead.facebook && !lead.instagram && !lead.linkedin && !lead.twitter && (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {lead.googleMapsUrl && (
                      <a
                        href={lead.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                    {onSelectLead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 text-xs gap-1 transition-colors ${
                          selectedLeadId === lead.id
                            ? "text-violet-300 bg-violet-500/20"
                            : "text-violet-400 hover:text-violet-300"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectLead(lead)
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        AI
                      </Button>
                    )}
                    {canGenerateEmail && onGenerateEmail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-violet-400 hover:text-violet-300 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          onGenerateEmail(lead)
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Email
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing {leads.length} lead{leads.length !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-slate-600">
          Data sourced from Google Maps
        </span>
      </div>
    </div>
  )
}
