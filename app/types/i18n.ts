export const LOCALES = ['fr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

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
