export const LOCALES = ['fr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

/**
 * Reads the locale back from a request path. The URL is the only
 * carrier, so this works even outside the router, where no i18n
 * instance has been attached to the context yet.
 */
export function localeFromPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : DEFAULT_LOCALE
}

/**
 * Prefixes a public path with the locale segment: French lives at
 * the root, English under /en.
 */
export function localePath(locale: Locale, path: string) {
  if (locale === 'fr') {
    return path
  }
  return path === '/' ? '/en' : `/en${path}`
}
