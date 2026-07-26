import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import Article from '#models/article'
import Category from '#models/category'
import MediaService from '#services/media_service'
import SeoService from '#services/seo_service'
import LlmsService, { MARKDOWN_CONTENT_TYPE } from '#services/llms_service'
import PublicationService from '#services/publication_service'
import { localePath, type Locale } from '#types/i18n'

const PER_PAGE = 9

function formatDate(date: DateTime | null, locale: Locale) {
  return date?.setLocale(locale).toLocaleString(DateTime.DATE_FULL) ?? null
}

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

export default class BlogController {
  async index({ inertia, request, response, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const categorySlug = request.input('category') as string | null

    const query = Article.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary')
      )
      .preload('category', (category) => category.preload('translations'))
      .preload('technologies')
      .preload('cover')
      .orderBy('published_at', 'desc')

    if (categorySlug) {
      query.whereHas('category', (category) => category.where('slug', categorySlug))
    }

    const [paginated, categories] = await Promise.all([
      query.paginate(page, PER_PAGE),
      Category.query().preload('translations').orderBy('slug'),
    ])

    if (paginated.total > 0 && page > paginated.lastPage) {
      return response
        .redirect()
        .toPath(localePath(locale, '/blog') + listQueryString(categorySlug, paginated.lastPage))
    }

    return inertia.render('blog/index', {
      filters: { category: categorySlug },
      articles: paginated.all().map((article) => {
        const translation = article.translation(locale)!
        return {
          slug: article.slug,
          title: translation.title,
          summary: translation.summary,
          publishedAt: formatDate(article.publishedAt, locale),
          readingTimeLabel: i18n.t('messages.blog.readingTime', {
            minutes: article.readingTime,
          }),
          category: article.category
            ? { slug: article.category.slug, name: article.category.name(locale) }
            : null,
          technologies: article.technologies.map((technology) => ({
            slug: technology.slug,
            name: technology.name,
          })),
          coverUrl: MediaService.url(article.cover),
        }
      }),
      pagination: {
        currentPage: paginated.currentPage,
        lastPage: paginated.lastPage,
        total: paginated.total,
      },
      categories: categories.map((category) => ({
        slug: category.slug,
        name: category.name(locale),
      })),
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
      }),
    })
  }

  async show({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = i18n.locale as Locale

    if (params.slug.endsWith('.md')) {
      const markdown = await LlmsService.articleMarkdown(params.slug.slice(0, -3), locale)
      if (!markdown) {
        return response.notFound('Not found')
      }
      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const article = await Article.query()
      .where('slug', params.slug)
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('category', (category) => category.preload('translations'))
      .preload('technologies')
      .firstOrFail()

    const translation = article.translation(locale)
    if (!translation) {
      throw new Exception('Not found', { status: 404 })
    }

    const preview = PublicationService.preview(article, Boolean(auth.user))

    return inertia.render('blog/show', {
      preview,
      article: {
        slug: article.slug,
        title: translation.title,
        summary: translation.summary,
        contentHtml: translation.contentHtml,
        publishedAt: formatDate(article.publishedAt, locale),
        readingTimeLabel: i18n.t('messages.blog.readingTime', {
          minutes: article.readingTime,
        }),
        category: article.category
          ? { slug: article.category.slug, name: article.category.name(locale) }
          : null,
        technologies: article.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
      },
      hasOtherLocale: article.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      labels: {
        publishedOn: i18n.t('messages.blog.publishedOn'),
        draft: i18n.t('messages.blog.draft'),
        archived: i18n.t('messages.blog.archived'),
        backToList: i18n.t('messages.blog.backToList'),
        technologies: i18n.t('messages.blog.technologies'),
        contents: i18n.t('messages.toc.title'),
      },
      meta: SeoService.build({
        title: translation.title,
        description: translation.summary || i18n.t('messages.blog.metaDescription'),
        locale,
        path: localePath(locale, `/blog/${article.slug}`),
        alternates:
          article.translation('en') !== undefined
            ? { fr: `/blog/${article.slug}`, en: `/en/blog/${article.slug}` }
            : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(article.cover),
        jsonLd: [
          SeoService.article({
            title: translation.title,
            description: translation.summary,
            path: localePath(locale, `/blog/${article.slug}`),
            locale,
            publishedAt: article.publishedAt?.toISODate() ?? null,
            image: SeoService.mediaUrl(article.cover),
          }),
          SeoService.breadcrumbs([
            { name: 'Blog', path: localePath(locale, '/blog') },
            {
              name: translation.title,
              path: localePath(locale, `/blog/${article.slug}`),
            },
          ]),
        ],
      }),
    })
  }
}
