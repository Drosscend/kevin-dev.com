import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import type { PublicationStatus } from '#types/content'
import type { DateTime } from 'luxon'

export interface ArticleFormTranslation {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ArticleForm {
  id: number
  slug: string
  status: PublicationStatus
  categoryId: number | null
  coverMediaId: number | null
  technologyIds: number[]
  publishedAt: DateTime | null
  hasBeenOnline: boolean
  fr: ArticleFormTranslation
  en: ArticleFormTranslation | null
}

@inject()
export class ArticleFormQuery {
  async execute(id: number): Promise<ArticleForm | null> {
    const article = await Article.query()
      .where('id', id)
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('technologies', (technologies) => technologies.select('id'))
      .first()

    if (!article) {
      return null
    }

    const fr = article.translation('fr')
    const en = article.translation('en')

    return {
      id: article.id,
      slug: article.slug,
      status: article.status,
      categoryId: article.categoryId,
      coverMediaId: article.coverMediaId,
      technologyIds: article.technologies.map((technology) => technology.id),
      publishedAt: article.publishedAt,
      hasBeenOnline: article.hasBeenOnline,
      fr: {
        title: fr?.title ?? '',
        summary: fr?.summary ?? '',
        contentMarkdown: fr?.contentMarkdown ?? '',
      },
      en: en ? { title: en.title, summary: en.summary, contentMarkdown: en.contentMarkdown } : null,
    }
  }
}
