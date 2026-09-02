import { inject } from '@adonisjs/core'
import drive from '@adonisjs/drive/services/main'
import HomeArticleTransformer from '#app/pages/transformers/home_article_transformer'
import HomeProjectTransformer from '#app/pages/transformers/home_project_transformer'
import HomeTalkTransformer from '#app/pages/transformers/home_talk_transformer'
import TimelineEntryTransformer from '#app/pages/transformers/timeline_entry_transformer'
import { longDate, monthYear } from '#app/shared/date_format'
import { picture } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { CV_PDF_KEY } from '#pages/cv_document'
import { HomeOverviewQuery } from '#pages/queries/home_overview_query'
import { TimelineQuery } from '#pages/queries/timeline_query'
import { localePath, toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(
    private readonly homeOverview: HomeOverviewQuery,
    private readonly timeline: TimelineQuery
  ) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)
    const [overview, timeline] = await Promise.all([
      this.homeOverview.execute(locale),
      this.timeline.execute(locale),
    ])

    return inertia.render('home', {
      now: overview.now,
      roles: overview.roles,
      location: overview.location,
      cvPdfAvailable: await drive.use().exists(CV_PDF_KEY),
      latestArticles: HomeArticleTransformer.transform(
        overview.articles.map((article) => ({
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          publishedAt: longDate(article.publishedAt, locale),
          cover: picture(article.cover),
        }))
      ),
      articlesTotal: overview.articlesTotal,
      projects: HomeProjectTransformer.transform(
        overview.projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          cover: picture(project.cover),
          ongoing: project.ongoing,
          technologies: project.technologies,
        }))
      ),
      projectsTotal: overview.projectsTotal,
      technologies: overview.technologies,
      hiddenTechnologies: overview.hiddenTechnologies,
      talks: HomeTalkTransformer.transform(
        overview.talks.map((talk) => ({
          slug: talk.slug,
          title: talk.title,
          eventName: talk.eventName,
          eventDate: monthYear(talk.eventDate, locale),
          city: talk.city,
          upcoming: talk.upcoming,
          summary: talk.summary,
          cover: picture(talk.cover),
        }))
      ),
      talksTotal: overview.talksTotal,
      timeline: TimelineEntryTransformer.transform(
        timeline.map((entry) => ({
          period: entry.period,
          title: entry.title,
          place: entry.place,
          honours: entry.honours,
        }))
      ),
      meta: SeoService.build({
        title: i18n.t('messages.home.metaTitle'),
        description: i18n.t('messages.home.metaDescription'),
        locale,
        path: localePath(locale, '/'),
        alternates: { fr: '/', en: '/en' },
        jsonLd: [SeoService.person(i18n.t('messages.home.jobTitle'))],
      }),
    })
  }
}
