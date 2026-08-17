import type { Locale } from '#types/i18n'

/**
 * Prefixes a public path with the locale segment: French lives at
 * the root, English under /en. Client-side twin of the server
 * helper in app/types/i18n.ts.
 */
export function localePath(locale: Locale, path: string) {
  if (locale === 'fr') {
    return path
  }
  return path === '/' ? '/en' : `/en${path}`
}

/**
 * Current URL in the other locale, query string included. Feeds the
 * header switch, which has only the browsed URL to work from.
 */
export function otherLocaleUrl(locale: Locale, url: string) {
  const [path, query] = url.split('?')
  const withoutPrefix = locale === 'en' ? path.replace(/^\/en/, '') || '/' : path
  const target = localePath(locale === 'fr' ? 'en' : 'fr', withoutPrefix)
  return query ? `${target}?${query}` : target
}
