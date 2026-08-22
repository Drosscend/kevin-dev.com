import type { Locale } from '#types/i18n'

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue }

export type JsonLd = { [key: string]: JsonLdValue }

/**
 * Per-page SEO payload built server-side by SeoService and rendered
 * into the document head by the <Seo> React component.
 */
export type SeoMeta = {
  title: string
  description: string
  canonical: string
  locale: Locale
  alternates: { fr: string; en: string } | null
  ogType: 'website' | 'article'
  ogImage: string | null
  jsonLd: JsonLd[]
  /**
   * Keeps the page out of search results while its links stay
   * followed. Used by pages that exist for navigation rather than
   * for search traffic.
   */
  noindex: boolean
}
