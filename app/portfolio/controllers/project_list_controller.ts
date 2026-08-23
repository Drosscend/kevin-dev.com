import { inject } from '@adonisjs/core'
import ProjectCardTransformer from '#app/portfolio/transformers/project_card_transformer'
import { monthYear } from '#app/shared/date_format'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { ProjectListQuery } from '#portfolio/queries/project_list_query'
import { localePath, toLocale, type Locale } from '#types/i18n'
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
    const locale = toLocale(i18n.locale)
    const projects = await this.projectList.execute(locale)

    return inertia.render('portfolio/index', {
      projects: ProjectCardTransformer.transform(
        projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          coverUrl: mediaUrl(project.cover),
          period: formatPeriod(project, locale),
          readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: project.readingTime }),
          ongoing: project.ongoing,
          technologies: project.technologies,
        }))
      ),
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
