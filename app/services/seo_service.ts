import env from '#start/env'
import router from '@adonisjs/core/services/router'
import type Media from '#models/media'
import type { Locale } from '#types/i18n'

export type JsonLdValue =
  string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue }

export type JsonLd = { [key: string]: JsonLdValue }

export interface SeoAlternates {
  fr: string
  en: string | null
}

export interface SeoMeta {
  title: string
  description: string
  canonical: string
  locale: Locale
  alternates: { fr: string; en: string | null } | null
  ogType: 'website' | 'article'
  ogImage: string | null
  jsonLd: JsonLd[]
}

const SITE_NAME = 'kevin-dev.com'

/**
 * Builds the per-page SEO payload consumed by the <Seo> React
 * component: canonical and hreflang URLs are always absolute
 * (based on APP_URL), JSON-LD objects are serialized client-side.
 */
export default class SeoService {
  static absolute(path: string) {
    const base = env.get('APP_URL').replace(/\/$/, '')
    return `${base}${path}`
  }

  static mediaUrl(media: Media | null) {
    if (!media) {
      return null
    }
    return this.absolute(router.makeUrl('uploads.show', { key: media.key, file: 'original.webp' }))
  }

  static build(options: {
    title: string
    description: string
    locale: Locale
    path: string
    alternates?: SeoAlternates | null
    ogType?: 'website' | 'article'
    ogImage?: string | null
    jsonLd?: JsonLd[]
  }): SeoMeta {
    return {
      title: options.title,
      description: options.description,
      canonical: this.absolute(options.path),
      locale: options.locale,
      alternates: options.alternates
        ? {
            fr: this.absolute(options.alternates.fr),
            en: options.alternates.en ? this.absolute(options.alternates.en) : null,
          }
        : null,
      ogType: options.ogType ?? 'website',
      ogImage: options.ogImage ?? null,
      jsonLd: options.jsonLd ?? [],
    }
  }

  static person(): JsonLd {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'KÃ©vin VÃ©ronÃ©si',
      'url': this.absolute('/'),
      'jobTitle': 'Consultant Data Migration',
      'sameAs': ['https://github.com/Drosscend', 'https://www.linkedin.com/in/kveronesi'],
    }
  }

  static breadcrumbs(items: { name: string; path: string }[]): JsonLd {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': this.absolute(item.path),
      })),
    }
  }

  static article(options: {
    title: string
    description: string
    path: string
    locale: Locale
    publishedAt: string | null
    image: string | null
  }): JsonLd {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': options.title,
      'description': options.description,
      'url': this.absolute(options.path),
      'inLanguage': options.locale,
      ...(options.publishedAt ? { datePublished: options.publishedAt } : {}),
      ...(options.image ? { image: options.image } : {}),
      'author': { '@type': 'Person', 'name': 'KÃ©vin VÃ©ronÃ©si', 'url': this.absolute('/') },
      'publisher': { '@type': 'Person', 'name': 'KÃ©vin VÃ©ronÃ©si' },
    }
  }

  static get siteName() {
    return SITE_NAME
  }
}
