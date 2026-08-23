import { usePage } from '@inertiajs/react'
import { localePath, type Locale } from '#types/i18n'

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

/** Builder of URLs in the locale of the current page. */
export function useLocalePath() {
  const { locale } = usePage().props
  return (path: string) => localePath(locale, path)
}
