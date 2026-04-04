import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'GeoLeads — Find Any Business in the World',
  description:
    'Generate B2B leads from Google Maps in seconds. Search any business type, any location. Export to CSV. AI-powered agent.',
  keywords: 'lead generation, B2B leads, Google Maps scraper, business finder, sales leads, AI agent',
  openGraph: {
    title: 'GeoLeads — Find Any Business in the World',
    description: 'Generate B2B leads from Google Maps in seconds.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
