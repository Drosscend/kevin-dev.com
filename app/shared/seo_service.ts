import router from '@adonisjs/core/services/router'
import { absoluteUrl } from '#shared/site_url'
import type { MediaSource } from '#media/media_source'
import type { Locale } from '#types/i18n'
import type { JsonLd, SeoMeta } from '#types/seo'

interface SeoAlternates {
  fr: string
  en: string
}

/**
 * Builds the per-page SEO payload consumed by the <Seo> React
 * component: canonical and hreflang URLs are always absolute
 * (based on APP_URL), JSON-LD objects are serialized client-side.
 */
export default class SeoService {
  static absolute(path: string) {
    return absoluteUrl(path)
  }

  static mediaUrl(media: MediaSource | null) {
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
    noindex?: boolean
  }): SeoMeta {
    return {
      title: options.title,
      description: options.description,
      canonical: this.absolute(options.path),
      locale: options.locale,
      alternates: options.alternates
        ? { fr: this.absolute(options.alternates.fr), en: this.absolute(options.alternates.en) }
        : null,
      ogType: options.ogType ?? 'website',
      // Pages without a specific image fall back to the site card
      ogImage: options.ogImage ?? this.absolute('/images/og-default.jpg'),
      jsonLd: options.jsonLd ?? [],
      noindex: options.noindex ?? false,
    }
  }

  static person(jobTitle: string): JsonLd {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Kévin Véronési',
      'alternateName': 'Drosscend',
      'url': this.absolute('/'),
      'jobTitle': jobTitle,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Toulouse',
        'addressCountry': 'FR',
      },
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
      'author': { '@type': 'Person', 'name': 'Kévin Véronési', 'url': this.absolute('/') },
      'publisher': { '@type': 'Person', 'name': 'Kévin Véronési' },
    }
  }
}
