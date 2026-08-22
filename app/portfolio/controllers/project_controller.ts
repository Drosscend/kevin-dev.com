import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { mediaUrl } from '#app/shared/media_url'
import { previewOrFail } from '#app/shared/publication_response'
import SeoService from '#app/shared/seo_service'
import { ProjectDetailQuery } from '#portfolio/queries/project_detail_query'
import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import { monthYear } from '#services/date_format'
import { visibilityOf } from '#shared/content/publication'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProjectController {
  constructor(private readonly projectDetail: ProjectDetailQuery) {}

  async render({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = i18n.locale as Locale

    if (params.slug.endsWith('.md')) {
      const markdown = await Llms.projectMarkdown(params.slug.slice(0, -3), locale)

      if (!markdown) {
        return response.notFound('Not found')
      }

      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const project = await this.projectDetail.execute(params.slug, locale)

    if (!project) {
      throw new Exception('Not found', { status: 404 })
    }

    const preview = previewOrFail(visibilityOf(project, Boolean(auth.user)))

    return inertia.render('portfolio/show', {
      preview,
      project: {
        title: project.title,
        contentHtml: project.contentHtml,
        coverUrl: mediaUrl(project.cover),
        startedAt: monthYear(project.startedAt, locale),
        endedAt: monthYear(project.endedAt, locale),
        readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: project.readingTime }),
        ongoing: project.ongoing,
        links: project.links,
        technologies: project.technologies,
        articles: project.articles,
      },
      hasOtherLocale: project.hasOtherLocale,
      labels: {
        backToList: i18n.t('messages.portfolio.backToList'),
        draft: i18n.t('messages.blog.draft'),
        archived: i18n.t('messages.blog.archived'),
        ongoing: i18n.t('messages.portfolio.ongoing'),
        technologies: i18n.t('messages.portfolio.technologies'),
        relatedArticles: i18n.t('messages.portfolio.relatedArticles'),
        contents: i18n.t('messages.toc.title'),
      },
      meta: SeoService.build({
        title: project.title,
        description: project.summary || i18n.t('messages.portfolio.metaDescription'),
        locale,
        path: localePath(locale, `/projects/${project.slug}`),
        alternates: project.hasEnglish
          ? { fr: `/projects/${project.slug}`, en: `/en/projects/${project.slug}` }
          : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(project.cover),
        jsonLd: [
          SeoService.breadcrumbs([
            { name: i18n.t('messages.portfolio.title'), path: localePath(locale, '/projects') },
            { name: project.title, path: localePath(locale, `/projects/${project.slug}`) },
          ]),
        ],
      }),
    })
  }
}
