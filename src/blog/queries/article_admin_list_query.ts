import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import type { PublicationStatus } from '#types/content'
import type { DateTime } from 'luxon'

export interface ArticleAdminListItem {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  publishedAt: DateTime | null
  scheduled: boolean
  category: string | null
}

@inject()
export class ArticleAdminListQuery {
  async execute(): Promise<ArticleAdminListItem[]> {
    const articles = await Article.query()
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title')
      )
      .preload('category', (category) =>
        category
          .select('id', 'slug')
          .preload('translations', (translations) =>
            translations.select('id', 'category_id', 'locale', 'name')
          )
      )
      // Ordered by the date the list shows. Drafts carry none, so they
      // surface first, where the work waiting to be finished belongs.
      .orderByRaw('published_at desc nulls first')
      .orderBy('created_at', 'desc')

    return articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.translation('fr')?.title ?? article.slug,
      hasEnglish: article.translation('en') !== undefined,
      status: article.status,
      publishedAt: article.publishedAt,
      scheduled: !article.isPublished && article.status === 'published',
      category: article.category?.name('fr') ?? null,
    }))
  }
}
