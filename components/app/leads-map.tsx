"use client"

import { useEffect, useRef } from "react"
import type { Lead } from "./leads-table"

interface LeadsMapProps {
  leads: Lead[]
  height?: string
}

export function LeadsMap({ leads, height = "500px" }: LeadsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapRef.current) return

    const validLeads = leads.filter((l) => l.latitude && l.longitude)
    if (validLeads.length === 0) return

    import("leaflet").then((L) => {
      // Fix Leaflet default icon issue with Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Remove existing map
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }

      // Calculate center
      const avgLat =
        validLeads.reduce((sum, l) => sum + (l.latitude || 0), 0) /
        validLeads.length
      const avgLng =
        validLeads.reduce((sum, l) => sum + (l.longitude || 0), 0) /
        validLeads.length

      const map = L.map(mapRef.current!).setView([avgLat, avgLng], 13)
      mapInstanceRef.current = map

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map)

      // Custom purple marker
      const purpleIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.5);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      })

      validLeads.forEach((lead) => {
        const popup = `
          <div style="
            background: #1e1b4b;
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 8px;
            padding: 12px;
            min-width: 200px;
            color: white;
            font-family: system-ui, sans-serif;
          ">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: white;">
              ${lead.name}
            </div>
            ${lead.category ? `<div style="font-size: 11px; color: #a78bfa; margin-bottom: 8px; background: rgba(124, 58, 237, 0.2); padding: 2px 8px; border-radius: 20px; display: inline-block;">${lead.category}</div>` : ""}
            ${lead.address ? `<div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">📍 ${lead.address}</div>` : ""}
            ${lead.phone ? `<div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">📞 <a href="tel:${lead.phone}" style="color: #60a5fa;">${lead.phone}</a></div>` : ""}
            ${lead.email ? `<div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">✉️ <a href="mailto:${lead.email}" style="color: #60a5fa;">${lead.email}</a></div>` : ""}
            ${lead.website ? `<div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">🌐 <a href="${lead.website}" target="_blank" style="color: #60a5fa;">${lead.website.replace(/^https?:\/\//, '')}</a></div>` : ""}
            ${lead.rating ? `<div style="font-size: 12px; color: #fbbf24; margin-top: 4px;">⭐ ${lead.rating.toFixed(1)} (${lead.reviewCount || 0} reviews)</div>` : ""}
            ${lead.googleMapsUrl ? `<a href="${lead.googleMapsUrl}" target="_blank" style="display: block; margin-top: 8px; text-align: center; background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-decoration: none;">View on Maps</a>` : ""}
          </div>
        `

        L.marker([lead.latitude!, lead.longitude!], { icon: purpleIcon })
          .addTo(map)
          .bindPopup(popup, {
            maxWidth: 280,
            className: "custom-popup",
          })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [leads])

  const validLeads = leads.filter((l) => l.latitude && l.longitude)

  if (validLeads.length === 0) {
    return (
      <div
        className="glass-card flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-slate-500 text-sm">
          No leads with GPS coordinates to display
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden" style={{ height }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #1e1b4b !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 16px !important;
          top: 6px !important;
          right: 6px !important;
        }
      `}</style>
    </div>
  )
}
