"use client"

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n/routing'
import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: Locale) {
    // For localePrefix: 'as-needed', default locale (fr) has no prefix
    // Other locales have /{locale}/... prefix
    const segments = pathname.split('/')

    // Check if current path has a locale prefix
    const currentHasPrefix = locales.includes(segments[1] as Locale)

    let newPath: string
    if (newLocale === 'fr') {
      // Remove locale prefix for default
      if (currentHasPrefix) {
        newPath = '/' + segments.slice(2).join('/')
      } else {
        newPath = pathname
      }
    } else {
      // Add/replace locale prefix
      if (currentHasPrefix) {
        segments[1] = newLocale
        newPath = segments.join('/')
      } else {
        newPath = `/${newLocale}${pathname}`
      }
    }

    router.push(newPath || '/')
    setIsOpen(false)
  }

  const mainLocales: Locale[] = ['fr', 'en', 'es', 'de', 'it', 'pt']
  const otherLocales = locales.filter((l) => !mainLocales.includes(l))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all text-sm"
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase text-xs font-semibold">{locale}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#0d0d1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3">
            <p className="text-xs font-medium text-slate-500 px-2 py-1 mb-2 uppercase tracking-wider">
              Language
            </p>

            {/* Main languages */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              {mainLocales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    locale === l
                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  )}
                >
                  <span className="uppercase text-xs font-mono opacity-60 w-5">{l}</span>
                  <span className="truncate">{localeNames[l]}</span>
                  {locale === l && <Check className="h-3 w-3 ml-auto text-violet-400" />}
                </button>
              ))}
            </div>

            <div className="h-px bg-white/5 my-2" />

            {/* Other EU languages */}
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
              {otherLocales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    locale === l
                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  )}
                >
                  <span className="uppercase text-xs font-mono opacity-60 w-5">{l}</span>
                  <span className="truncate">{localeNames[l]}</span>
                  {locale === l && <Check className="h-3 w-3 ml-auto text-violet-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
