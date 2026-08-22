import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { longDate } from '#app/shared/date_format'
import { previewOrFail } from '#app/shared/publication_response'
import SeoService from '#app/shared/seo_service'
import { ArticleDetailQuery } from '#blog/queries/article_detail_query'
import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import { visibilityOf } from '#shared/content/publication'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ArticleController {
  constructor(private readonly articleDetail: ArticleDetailQuery) {}

  async render({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = i18n.locale as Locale

    if (params.slug.endsWith('.md')) {
      const markdown = await Llms.articleMarkdown(params.slug.slice(0, -3), locale)

      if (!markdown) {
        return response.notFound('Not found')
      }

      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const article = await this.articleDetail.execute(params.slug, locale)

    if (!article) {
      throw new Exception('Not found', { status: 404 })
    }

    const preview = previewOrFail(visibilityOf(article, Boolean(auth.user)))

    return inertia.render('blog/show', {
      preview,
      article: {
        title: article.title,
        contentHtml: article.contentHtml,
        publishedAt: longDate(article.publishedAt, locale),
        readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: article.readingTime }),
        category: article.category,
        technologies: article.technologies,
      },
      hasOtherLocale: article.hasOtherLocale,
      labels: {
        publishedOn: i18n.t('messages.blog.publishedOn'),
        draft: i18n.t('messages.blog.draft'),
        archived: i18n.t('messages.blog.archived'),
        backToList: i18n.t('messages.blog.backToList'),
        technologies: i18n.t('messages.blog.technologies'),
        contents: i18n.t('messages.toc.title'),
      },
      meta: SeoService.build({
        title: article.title,
        description: article.summary || i18n.t('messages.blog.metaDescription'),
        locale,
        path: localePath(locale, `/blog/${article.slug}`),
        alternates: article.hasEnglish
          ? { fr: `/blog/${article.slug}`, en: `/en/blog/${article.slug}` }
          : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(article.cover),
        jsonLd: [
          SeoService.article({
            title: article.title,
            description: article.summary,
            path: localePath(locale, `/blog/${article.slug}`),
            locale,
            publishedAt: article.publishedAt?.toISODate() ?? null,
            image: SeoService.mediaUrl(article.cover),
          }),
          SeoService.breadcrumbs([
            { name: 'Blog', path: localePath(locale, '/blog') },
            { name: article.title, path: localePath(locale, `/blog/${article.slug}`) },
          ]),
        ],
      }),
    })
  }
}
