import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import type { ArticleCategoryItem } from '#blog/queries/article_list_query'
import type { MediaSource } from '#media/media_source'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface ArticleDetail {
  slug: string
  status: string
  isPublished: boolean
  title: string
  summary: string
  contentHtml: string
  publishedAt: DateTime | null
  readingTime: number
  category: ArticleCategoryItem | null
  technologies: { slug: string; name: string }[]
  cover: MediaSource | null
  hasOtherLocale: boolean
  hasEnglish: boolean
}

@inject()
export class ArticleDetailQuery {
  async execute(slug: string, locale: Locale): Promise<ArticleDetail | null> {
    const article = await Article.query()
      .where('slug', slug)
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('category', (category) => category.preload('translations'))
      .preload('technologies')
      .first()

    if (!article) {
      return null
    }

    const translation = article.translation(locale)

    if (!translation) {
      return null
    }

    return {
      slug: article.slug,
      status: article.status,
      isPublished: article.isPublished,
      title: translation.title,
      summary: translation.summary,
      contentHtml: translation.contentHtml,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      category: article.category
        ? { slug: article.category.slug, name: article.category.name(locale) }
        : null,
      technologies: article.technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      cover: article.cover,
      hasOtherLocale: article.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      hasEnglish: article.translation('en') !== undefined,
    }
  }
}
