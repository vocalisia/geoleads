import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function generateCsvContent(leads: Record<string, unknown>[]): string {
  if (leads.length === 0) return ''

  const headers = [
    'Name',
    'Address',
    'Phone',
    'Email',
    'Website',
    'Rating',
    'Reviews',
    'Category',
    'Latitude',
    'Longitude',
    'Google Maps URL',
    'Facebook',
    'Instagram',
    'LinkedIn',
    'Twitter',
    'SIRET',
    'SIREN',
  ]

  const rows = leads.map((lead) => [
    escapeCsvField(String(lead.name || '')),
    escapeCsvField(String(lead.address || '')),
    escapeCsvField(String(lead.phone || '')),
    escapeCsvField(String(lead.email || '')),
    escapeCsvField(String(lead.website || '')),
    String(lead.rating || ''),
    String(lead.reviewCount || ''),
    escapeCsvField(String(lead.category || '')),
    String(lead.latitude || ''),
    String(lead.longitude || ''),
    escapeCsvField(String(lead.googleMapsUrl || '')),
    escapeCsvField(String(lead.facebook || '')),
    escapeCsvField(String(lead.instagram || '')),
    escapeCsvField(String(lead.linkedin || '')),
    escapeCsvField(String(lead.twitter || '')),
    escapeCsvField(String(lead.siret || '')),
    escapeCsvField(String(lead.siren || '')),
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPlanCredits(plan: string): number {
  const credits: Record<string, number> = {
    FREE: 50,
    STARTER: 500,
    PRO: 2000,
    ENTERPRISE: 10000,
  }
  return credits[plan] || 50
}
