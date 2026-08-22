import { inject } from '@adonisjs/core'
import SeoService from '#app/shared/seo_service'
import { SitemapContentQuery } from '#seo/queries/sitemap_content_query'
import SettingsService from '#services/settings_service'
import type { SitemapEntryContent } from '#seo/queries/sitemap_content_query'
import type { HttpContext } from '@adonisjs/core/http'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface SitemapEntry {
  path: string
  lastmod?: string | null
  alternates?: { fr: string; en: string } | null
}

function sitemapUrl(entry: SitemapEntry) {
  const alternates = entry.alternates
    ? [
        `<xhtml:link rel="alternate" hreflang="fr" href="${xmlEscape(SeoService.absolute(entry.alternates.fr))}"/>`,
        `<xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(SeoService.absolute(entry.alternates.en))}"/>`,
      ].join('')
    : ''
  const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''

  return `<url><loc>${xmlEscape(SeoService.absolute(entry.path))}</loc>${lastmod}${alternates}</url>`
}

function contentEntries(prefix: string, items: SitemapEntryContent[]) {
  const entries: SitemapEntry[] = []

  for (const item of items) {
    const alternates = item.hasEnglish
      ? { fr: `${prefix}/${item.slug}`, en: `/en${prefix}/${item.slug}` }
      : null

    entries.push({ path: `${prefix}/${item.slug}`, lastmod: item.lastmod, alternates })

    if (item.hasEnglish) {
      entries.push({ path: `/en${prefix}/${item.slug}`, lastmod: item.lastmod, alternates })
    }
  }

  return entries
}

@inject()
export default class SitemapController {
  constructor(private readonly sitemapContent: SitemapContentQuery) {}

  async execute({ response }: HttpContext) {
    const [content, settings] = await Promise.all([
      this.sitemapContent.execute(),
      SettingsService.getMany(['cv_html_fr', 'cv_html_en', 'legal_html_fr', 'legal_html_en']),
    ])

    const entries: SitemapEntry[] = [
      { path: '/', alternates: { fr: '/', en: '/en' } },
      { path: '/en', alternates: { fr: '/', en: '/en' } },
      { path: '/projects', alternates: { fr: '/projects', en: '/en/projects' } },
      { path: '/en/projects', alternates: { fr: '/projects', en: '/en/projects' } },
      { path: '/technologies', alternates: { fr: '/technologies', en: '/en/technologies' } },
      { path: '/en/technologies', alternates: { fr: '/technologies', en: '/en/technologies' } },
      { path: '/contact', alternates: { fr: '/contact', en: '/en/contact' } },
      { path: '/en/contact', alternates: { fr: '/contact', en: '/en/contact' } },
    ]

    if (content.articles.length > 0) {
      entries.push(
        { path: '/blog', alternates: { fr: '/blog', en: '/en/blog' } },
        { path: '/en/blog', alternates: { fr: '/blog', en: '/en/blog' } }
      )
    }

    if (content.talks.length > 0) {
      entries.push(
        { path: '/talks', alternates: { fr: '/talks', en: '/en/talks' } },
        { path: '/en/talks', alternates: { fr: '/talks', en: '/en/talks' } }
      )
    }

    if (settings.cv_html_fr) {
      entries.push({ path: '/cv' })
    }

    if (settings.cv_html_en) {
      entries.push({ path: '/en/cv' })
    }

    if (settings.legal_html_fr) {
      entries.push({ path: '/legal' })
    }

    if (settings.legal_html_en) {
      entries.push({ path: '/en/legal' })
    }

    entries.push(
      ...contentEntries('/blog', content.articles),
      ...contentEntries('/projects', content.projects),
      ...contentEntries('/talks', content.talks)
    )

    response.header('content-type', 'application/xml; charset=utf-8')

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ...entries.map(sitemapUrl),
      '</urlset>',
    ].join('\n')
  }
}
