import { inject } from '@adonisjs/core'
import ArticleCardTransformer from '#app/blog/transformers/article_card_transformer'
import { longDate } from '#app/shared/date_format'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { ArticleListQuery } from '#blog/queries/article_list_query'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

const PER_PAGE = 9

function listQueryString(category: string | null, page: number) {
  const params = new URLSearchParams()

  if (category) {
    params.set('category', category)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()

  return query ? `?${query}` : ''
}

@inject()
export default class ArticleListController {
  constructor(private readonly articleList: ArticleListQuery) {}

  async render({ inertia, request, response, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const categorySlug = request.input('category') as string | null

    const list = await this.articleList.execute({
      locale,
      categorySlug,
      page,
      perPage: PER_PAGE,
    })

    if (list.total > 0 && page > list.lastPage) {
      // The app forwards the query string on every redirect, and the
      // target already carries the filter and the page.
      return response
        .redirect()
        .withQs(false)
        .toPath(localePath(locale, '/blog') + listQueryString(categorySlug, list.lastPage))
    }

    return inertia.render('blog/index', {
      filters: { category: categorySlug },
      articles: ArticleCardTransformer.transform(
        list.articles.map((article) => ({
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          publishedAt: longDate(article.publishedAt, locale),
          readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: article.readingTime }),
          category: article.category,
          technologies: article.technologies,
          coverUrl: mediaUrl(article.cover),
        }))
      ),
      pagination: {
        currentPage: list.currentPage,
        lastPage: list.lastPage,
      },
      categories: list.categories,
      labels: {
        title: i18n.t('messages.blog.title'),
        empty: i18n.t('messages.blog.empty'),
        allCategories: i18n.t('messages.blog.allCategories'),
        previous: i18n.t('messages.blog.previous'),
        next: i18n.t('messages.blog.next'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.blog.title'),
        description: i18n.t('messages.blog.metaDescription'),
        locale,
        path: localePath(locale, '/blog') + listQueryString(categorySlug, page),
        alternates: !categorySlug && page === 1 ? { fr: '/blog', en: '/en/blog' } : null,
        noindex: list.total === 0,
      }),
    })
  }
}
