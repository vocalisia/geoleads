import { ApifyClient } from 'apify-client'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

export interface GoogleMapsLead {
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  rating?: number
  reviewsCount?: number
  category?: string
  latitude?: number
  longitude?: number
  url?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}

export interface ScraperOptions {
  searchQuery: string
  location: string
  maxResults?: number
}

export async function scrapeGoogleMaps(options: ScraperOptions): Promise<GoogleMapsLead[]> {
  const { searchQuery, location, maxResults = 50 } = options

  const input = {
    searchStringsArray: [`${searchQuery} in ${location}`],
    maxCrawledPlacesPerSearch: maxResults,
    language: 'en',
    includeWebResults: false,
    scrapeDirectories: false,
    deeperCityScrape: false,
  }

  try {
    const run = await client.actor('apify/google-maps-scraper').call(input, {
      timeout: 120,
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return items.map((item: Record<string, unknown>) => ({
      name: (item.title as string) || '',
      address: (item.address as string) || undefined,
      phone: (item.phone as string) || undefined,
      email: (item.email as string) || undefined,
      website: (item.website as string) || undefined,
      rating: typeof item.totalScore === 'number' ? item.totalScore : undefined,
      reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
      category: (item.categoryName as string) || undefined,
      latitude: item.location && typeof (item.location as Record<string, unknown>)['lat'] === 'number' ? (item.location as Record<string, number>)['lat'] : undefined,
      longitude: item.location && typeof (item.location as Record<string, unknown>)['lng'] === 'number' ? (item.location as Record<string, number>)['lng'] : undefined,
      url: (item.url as string) || undefined,
      facebook: extractSocialLink(item.socialMediaLinks as Record<string, string>[] | undefined, 'facebook'),
      instagram: extractSocialLink(item.socialMediaLinks as Record<string, string>[] | undefined, 'instagram'),
      linkedin: extractSocialLink(item.socialMediaLinks as Record<string, string>[] | undefined, 'linkedin'),
      twitter: extractSocialLink(item.socialMediaLinks as Record<string, string>[] | undefined, 'twitter'),
    }))
  } catch (error) {
    console.error('Apify scraping error:', error)
    throw new Error('Failed to scrape Google Maps data')
  }
}

function extractSocialLink(
  links: Record<string, string>[] | undefined,
  platform: string
): string | undefined {
  if (!links || !Array.isArray(links)) return undefined
  const link = links.find((l) =>
    typeof l.url === 'string' && l.url.toLowerCase().includes(platform)
  )
  return link?.url
}

export async function getMockLeads(businessType: string, location: string): Promise<GoogleMapsLead[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockData: GoogleMapsLead[] = [
    {
      name: `${businessType} Cabinet Dupont`,
      address: `12 Rue de la Paix, ${location}`,
      phone: '+33 1 23 45 67 89',
      email: `contact@dupont-${businessType.toLowerCase().replace(/\s/g, '')}.fr`,
      website: `https://www.dupont-${businessType.toLowerCase().replace(/\s/g, '')}.fr`,
      rating: 4.8,
      reviewsCount: 127,
      category: businessType,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
      url: 'https://maps.google.com/?cid=123456',
    },
    {
      name: `${businessType} Martin & Associés`,
      address: `45 Boulevard Haussmann, ${location}`,
      phone: '+33 1 98 76 54 32',
      email: `info@martin-${businessType.toLowerCase().replace(/\s/g, '')}.fr`,
      website: `https://martin-${businessType.toLowerCase().replace(/\s/g, '')}.com`,
      rating: 4.5,
      reviewsCount: 89,
      category: businessType,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
      url: 'https://maps.google.com/?cid=789012',
      facebook: 'https://facebook.com/martin-cabinet',
    },
    {
      name: `Groupe ${businessType} Excellence`,
      address: `8 Place Vendôme, ${location}`,
      phone: '+33 1 55 44 33 22',
      email: `contact@groupe-excellence.fr`,
      website: `https://www.groupe-excellence.fr`,
      rating: 4.9,
      reviewsCount: 234,
      category: businessType,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
      url: 'https://maps.google.com/?cid=345678',
      linkedin: 'https://linkedin.com/company/groupe-excellence',
    },
    {
      name: `${businessType} Moderne Paris`,
      address: `23 Rue du Faubourg Saint-Antoine, ${location}`,
      phone: '+33 1 44 33 22 11',
      email: null as unknown as string,
      website: `https://www.${businessType.toLowerCase().replace(/\s/g, '')}-moderne.fr`,
      rating: 4.2,
      reviewsCount: 56,
      category: businessType,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
      url: 'https://maps.google.com/?cid=901234',
    },
    {
      name: `Cabinet ${businessType} Premier`,
      address: `67 Avenue des Champs-Élysées, ${location}`,
      phone: '+33 1 77 88 99 00',
      email: `premier@cabinet-${businessType.toLowerCase().replace(/\s/g, '')}.fr`,
      website: `https://cabinet-premier.fr`,
      rating: 4.7,
      reviewsCount: 312,
      category: businessType,
      latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
      longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
      url: 'https://maps.google.com/?cid=567890',
      instagram: 'https://instagram.com/cabinet.premier',
      facebook: 'https://facebook.com/cabinetpremier',
    },
  ]

  return mockData
}
