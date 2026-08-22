import { inject } from '@adonisjs/core'
import SeoService from '#app/shared/seo_service'
import { FeedArticlesQuery } from '#seo/queries/feed_articles_query'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

@inject()
export default class FeedController {
  constructor(private readonly feedArticles: FeedArticlesQuery) {}

  async execute({ response, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const articles = await this.feedArticles.execute(locale)

    const items = articles
      .map((article) => {
        const url = SeoService.absolute(localePath(locale, `/blog/${article.slug}`))

        return [
          '<item>',
          `<title>${xmlEscape(article.title)}</title>`,
          `<link>${xmlEscape(url)}</link>`,
          `<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
          article.summary ? `<description>${xmlEscape(article.summary)}</description>` : '',
          article.publishedAt ? `<pubDate>${article.publishedAt.toRFC2822()}</pubDate>` : '',
          '</item>',
        ]
          .filter(Boolean)
          .join('')
      })
      .join('\n')

    response.header('content-type', 'application/rss+xml; charset=utf-8')
    // A feed cannot carry a canonical tag: keep it crawlable for feed
    // readers, but out of the search index.
    response.header('x-robots-tag', 'noindex, follow')

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      '<channel>',
      `<title>kevin-dev.com · Blog</title>`,
      `<link>${xmlEscape(SeoService.absolute(localePath(locale, '/blog')))}</link>`,
      `<description>${xmlEscape(i18n.t('messages.blog.metaDescription'))}</description>`,
      `<language>${locale}</language>`,
      `<atom:link href="${xmlEscape(SeoService.absolute(localePath(locale, '/blog/rss.xml')))}" rel="self" type="application/rss+xml"/>`,
      items,
      '</channel>',
      '</rss>',
    ].join('\n')
  }
}
