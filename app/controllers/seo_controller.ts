import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import Project from '#models/project'
import Technology from '#models/technology'
import SettingsService from '#services/settings_service'
import SeoService from '#services/seo_service'
import type { Locale } from '#types/i18n'

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

export default class SeoController {
  async sitemap({ response }: HttpContext) {
    const [articles, projects, technologies, settings] = await Promise.all([
      Article.query().where('status', 'published').preload('translations'),
      Project.query().where('status', 'published').preload('translations'),
      Technology.query(),
      SettingsService.getMany(['cv_html_fr', 'cv_html_en', 'legal_html_fr', 'legal_html_en']),
    ])

    const entries: SitemapEntry[] = [
      { path: '/', alternates: { fr: '/', en: '/en' } },
      { path: '/en', alternates: { fr: '/', en: '/en' } },
      { path: '/blog', alternates: { fr: '/blog', en: '/en/blog' } },
      { path: '/en/blog', alternates: { fr: '/blog', en: '/en/blog' } },
      { path: '/projects', alternates: { fr: '/projects', en: '/en/projects' } },
      { path: '/en/projects', alternates: { fr: '/projects', en: '/en/projects' } },
      { path: '/technologies', alternates: { fr: '/technologies', en: '/en/technologies' } },
      { path: '/en/technologies', alternates: { fr: '/technologies', en: '/en/technologies' } },
      { path: '/contact', alternates: { fr: '/contact', en: '/en/contact' } },
      { path: '/en/contact', alternates: { fr: '/contact', en: '/en/contact' } },
    ]

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

    for (const article of articles) {
      const hasEnglish = article.translations.some((translation) => translation.locale === 'en')
      const lastmod = article.updatedAt?.toISODate() ?? article.publishedAt?.toISODate()
      const alternates = hasEnglish
        ? { fr: `/blog/${article.slug}`, en: `/en/blog/${article.slug}` }
        : null
      entries.push({ path: `/blog/${article.slug}`, lastmod, alternates })
      if (hasEnglish) {
        entries.push({ path: `/en/blog/${article.slug}`, lastmod, alternates })
      }
    }

    for (const project of projects) {
      const hasEnglish = project.translations.some((translation) => translation.locale === 'en')
      const lastmod = project.updatedAt?.toISODate() ?? project.publishedAt?.toISODate()
      const alternates = hasEnglish
        ? { fr: `/projects/${project.slug}`, en: `/en/projects/${project.slug}` }
        : null
      entries.push({ path: `/projects/${project.slug}`, lastmod, alternates })
      if (hasEnglish) {
        entries.push({ path: `/en/projects/${project.slug}`, lastmod, alternates })
      }
    }

    for (const technology of technologies) {
      const alternates = {
        fr: `/technologies/${technology.slug}`,
        en: `/en/technologies/${technology.slug}`,
      }
      entries.push({ path: `/technologies/${technology.slug}`, alternates })
      entries.push({ path: `/en/technologies/${technology.slug}`, alternates })
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ...entries.map(sitemapUrl),
      '</urlset>',
    ].join('\n')

    response.header('content-type', 'application/xml; charset=utf-8')
    return xml
  }

  async rss({ response, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const base = locale === 'en' ? '/en' : ''

    const articles = await Article.query()
      .where('status', 'published')
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations')
      .orderBy('published_at', 'desc')
      .limit(20)

    const items = articles
      .map((article) => {
        const translation = article.translation(locale)!
        const url = SeoService.absolute(`${base}/blog/${article.slug}`)
        return [
          '<item>',
          `<title>${xmlEscape(translation.title)}</title>`,
          `<link>${xmlEscape(url)}</link>`,
          `<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
          translation.summary ? `<description>${xmlEscape(translation.summary)}</description>` : '',
          article.publishedAt ? `<pubDate>${article.publishedAt.toRFC2822()}</pubDate>` : '',
          '</item>',
        ]
          .filter(Boolean)
          .join('')
      })
      .join('\n')

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      '<channel>',
      `<title>kevin-dev.com — Blog</title>`,
      `<link>${xmlEscape(SeoService.absolute(`${base}/blog`))}</link>`,
      `<description>${xmlEscape(i18n.t('messages.blog.metaDescription'))}</description>`,
      `<language>${locale}</language>`,
      `<atom:link href="${xmlEscape(SeoService.absolute(`${base}/blog/rss.xml`))}" rel="self" type="application/rss+xml"/>`,
      items,
      '</channel>',
      '</rss>',
    ].join('\n')

    response.header('content-type', 'application/rss+xml; charset=utf-8')
    return xml
  }

  async robots({ response }: HttpContext) {
    response.header('content-type', 'text/plain; charset=utf-8')
    return [
      'User-agent: *',
      'Disallow: /admin',
      `Sitemap: ${SeoService.absolute('/sitemap.xml')}`,
      '',
    ].join('\n')
  }
}
