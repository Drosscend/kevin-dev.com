import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import Article from '#models/article'
import Category from '#models/category'
import MediaService from '#services/media_service'
import SeoService from '#services/seo_service'
import LlmsService, { MARKDOWN_CONTENT_TYPE } from '#services/llms_service'
import { localePath, type Locale } from '#types/i18n'

const PER_PAGE = 9

function formatDate(date: DateTime | null, locale: Locale) {
  return date?.setLocale(locale).toLocaleString(DateTime.DATE_FULL) ?? null
}

function listQueryString(category: string | null, tag: string | null, page: number) {
  const params = new URLSearchParams()
  if (category) {
    params.set('category', category)
  }
  if (tag) {
    params.set('tag', tag)
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
    const tagSlug = request.input('tag') as string | null

    const query = Article.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary')
      )
      .preload('category', (category) => category.preload('translations'))
      .preload('tags', (tags) => tags.preload('translations'))
      .preload('cover')
      .orderBy('published_at', 'desc')

    if (categorySlug) {
      query.whereHas('category', (category) => category.where('slug', categorySlug))
    }
    if (tagSlug) {
      query.whereHas('tags', (tags) => tags.where('slug', tagSlug))
    }

    const [paginated, categories] = await Promise.all([
      query.paginate(page, PER_PAGE),
      Category.query().preload('translations').orderBy('slug'),
    ])

    if (paginated.total > 0 && page > paginated.lastPage) {
      return response
        .redirect()
        .toPath(
          localePath(locale, '/blog') + listQueryString(categorySlug, tagSlug, paginated.lastPage)
        )
    }

    return inertia.render('blog/index', {
      filters: { category: categorySlug, tag: tagSlug },
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
          tags: article.tags.map((tag) => ({ slug: tag.slug, name: tag.name(locale) })),
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
        clearTag: i18n.t('messages.blog.clearTag'),
        previous: i18n.t('messages.blog.previous'),
        next: i18n.t('messages.blog.next'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.blog.title'),
        description: i18n.t('messages.blog.metaDescription'),
        locale,
        path: localePath(locale, '/blog') + listQueryString(categorySlug, tagSlug, page),
        alternates:
          !categorySlug && !tagSlug && page === 1 ? { fr: '/blog', en: '/en/blog' } : null,
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
      .preload('tags', (tags) => tags.preload('translations'))
      .firstOrFail()

    const translation = article.translation(locale)
    if (!translation) {
      throw new Exception('Not found', { status: 404 })
    }

    const isDraftPreview = !article.isPublished
    if (isDraftPreview && !auth.user) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('blog/show', {
      isDraftPreview,
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
        tags: article.tags.map((tag) => ({ slug: tag.slug, name: tag.name(locale) })),
      },
      hasOtherLocale: article.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      labels: {
        publishedOn: i18n.t('messages.blog.publishedOn'),
        draft: i18n.t('messages.blog.draft'),
        backToList: i18n.t('messages.blog.backToList'),
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
