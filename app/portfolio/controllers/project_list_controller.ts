import { inject } from '@adonisjs/core'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { ProjectListQuery } from '#portfolio/queries/project_list_query'
import { monthYear } from '#services/date_format'
import { localePath, type Locale } from '#types/i18n'
import type { ProjectListItem } from '#portfolio/queries/project_list_query'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Timespan shown on the listing: an open-ended project keeps only its
 * start, an undated one has no metadata line at all.
 */
function formatPeriod(project: ProjectListItem, locale: Locale) {
  const startedAt = monthYear(project.startedAt, locale)
  const endedAt = monthYear(project.endedAt, locale)

  if (startedAt && endedAt) {
    return `${startedAt} - ${endedAt}`
  }

  return startedAt ?? endedAt
}

@inject()
export default class ProjectListController {
  constructor(private readonly projectList: ProjectListQuery) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const projects = await this.projectList.execute(locale)

    return inertia.render('portfolio/index', {
      projects: projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        coverUrl: mediaUrl(project.cover),
        period: formatPeriod(project, locale),
        readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: project.readingTime }),
        ongoing: project.ongoing,
        technologies: project.technologies,
      })),
      labels: {
        title: i18n.t('messages.portfolio.title'),
        empty: i18n.t('messages.portfolio.empty'),
        ongoing: i18n.t('messages.portfolio.ongoing'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.portfolio.title'),
        description: i18n.t('messages.portfolio.metaDescription'),
        locale,
        path: localePath(locale, '/projects'),
        alternates: { fr: '/projects', en: '/en/projects' },
      }),
    })
  }
}
