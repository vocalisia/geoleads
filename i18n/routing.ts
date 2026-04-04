import { defineRouting } from 'next-intl/routing';

export const locales = [
  'fr', 'en', 'es', 'it', 'de', 'pt', 'nl', 'pl', 'ro', 'cs',
  'hu', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'fi', 'sv',
  'da', 'el', 'mt', 'ga',
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ro: 'Română',
  cs: 'Čeština',
  hu: 'Magyar',
  bg: 'Български',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  et: 'Eesti',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  fi: 'Suomi',
  sv: 'Svenska',
  da: 'Dansk',
  el: 'Ελληνικά',
  mt: 'Malti',
  ga: 'Gaeilge',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
});
