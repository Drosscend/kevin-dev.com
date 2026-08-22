import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

const FEED_SIZE = 20

export interface FeedArticle {
  slug: string
  title: string
  summary: string
  publishedAt: DateTime | null
}

@inject()
export class FeedArticlesQuery {
  async execute(locale: Locale): Promise<FeedArticle[]> {
    const articles = await Article.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (query) =>
        query.select('id', 'article_id', 'locale', 'title', 'summary')
      )
      .orderBy('published_at', 'desc')
      .limit(FEED_SIZE)

    return articles.map((article) => {
      const translation = article.translation(locale)!

      return {
        slug: article.slug,
        title: translation.title,
        summary: translation.summary,
        publishedAt: article.publishedAt,
      }
    })
  }
}
