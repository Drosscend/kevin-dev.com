import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import Category from '#blog/models/category'
import type { MediaSource } from '#media/media_source'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface ArticleCategoryItem {
  slug: string
  name: string
}

export interface ArticleListItem {
  slug: string
  title: string
  summary: string
  publishedAt: DateTime | null
  readingTime: number
  category: ArticleCategoryItem | null
  technologies: { slug: string; name: string }[]
  cover: MediaSource | null
}

export interface ArticleListParams {
  locale: Locale
  categorySlug: string | null
  page: number
  perPage: number
}

export interface ArticleList {
  articles: ArticleListItem[]
  categories: ArticleCategoryItem[]
  total: number
  currentPage: number
  lastPage: number
}

@inject()
export class ArticleListQuery {
  async execute(params: ArticleListParams): Promise<ArticleList> {
    const query = Article.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', params.locale))
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary')
      )
      .preload('category', (category) => category.preload('translations'))
      .preload('technologies')
      .preload('cover')
      .orderBy('published_at', 'desc')

    if (params.categorySlug) {
      query.whereHas('category', (category) => category.where('slug', params.categorySlug!))
    }

    const [paginated, categories] = await Promise.all([
      query.paginate(params.page, params.perPage),
      Category.query().preload('translations').orderBy('slug'),
    ])

    return {
      articles: paginated.all().map((article) => {
        const translation = article.translation(params.locale)!

        return {
          slug: article.slug,
          title: translation.title,
          summary: translation.summary,
          publishedAt: article.publishedAt,
          readingTime: article.readingTime,
          category: article.category
            ? { slug: article.category.slug, name: article.category.name(params.locale) }
            : null,
          technologies: article.technologies.map((technology) => ({
            slug: technology.slug,
            name: technology.name,
          })),
          cover: article.cover,
        }
      }),
      categories: categories.map((category) => ({
        slug: category.slug,
        name: category.name(params.locale),
      })),
      total: paginated.total,
      currentPage: paginated.currentPage,
      lastPage: paginated.lastPage,
    }
  }
}
