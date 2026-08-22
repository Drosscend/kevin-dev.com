import { inject } from '@adonisjs/core'
import drive from '@adonisjs/drive/services/main'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { CV_PDF_KEY } from '#pages/cv_document'
import { HomeOverviewQuery } from '#pages/queries/home_overview_query'
import { TimelineQuery } from '#pages/queries/timeline_query'
import { longDate, monthYear } from '#services/date_format'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(
    private readonly homeOverview: HomeOverviewQuery,
    private readonly timeline: TimelineQuery
  ) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const [overview, timeline] = await Promise.all([
      this.homeOverview.execute(locale),
      this.timeline.execute(locale),
    ])

    return inertia.render('home', {
      now: overview.now,
      roles: overview.roles,
      location: overview.location,
      cvPdfAvailable: await drive.use().exists(CV_PDF_KEY),
      latestArticles: overview.articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        publishedAt: longDate(article.publishedAt, locale),
        coverUrl: mediaUrl(article.cover),
      })),
      articlesTotal: overview.articlesTotal,
      projects: overview.projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        coverUrl: mediaUrl(project.cover),
        ongoing: project.ongoing,
        technologies: project.technologies,
      })),
      projectsTotal: overview.projectsTotal,
      technologies: overview.technologies,
      hiddenTechnologies: overview.hiddenTechnologies,
      talks: overview.talks.map((talk) => ({
        slug: talk.slug,
        title: talk.title,
        eventName: talk.eventName,
        eventDate: monthYear(talk.eventDate, locale),
        city: talk.city,
        upcoming: talk.upcoming,
        summary: talk.summary,
        coverUrl: mediaUrl(talk.cover),
      })),
      talksTotal: overview.talksTotal,
      timeline: timeline.map((entry) => ({
        period: entry.period,
        title: entry.title,
        place: entry.place,
        // The honours are stored once for both locales, only their
        // label is translated. "none" hides the mention.
        honours: entry.honours === 'none' ? null : i18n.t(`messages.home.honours.${entry.honours}`),
      })),
      labels: {
        downloadCv: i18n.t('messages.home.downloadCv'),
        contactMe: i18n.t('messages.home.contactMe'),
        photoAlt: i18n.t('messages.home.photoAlt'),
        now: i18n.t('messages.home.now'),
        featuredProjects: i18n.t('messages.home.featuredProjects'),
        latestArticles: i18n.t('messages.home.latestArticles'),
        allArticles: i18n.t('messages.home.allArticles'),
        allProjects: i18n.t('messages.home.allProjects'),
        timeline: i18n.t('messages.home.timeline'),
        stack: i18n.t('messages.home.stack'),
        allTechnologies: i18n.t('messages.home.allTechnologies'),
        talks: i18n.t('messages.home.talks'),
        allTalks: i18n.t('messages.home.allTalks'),
        upcomingTalk: i18n.t('messages.talks.upcoming'),
        ongoingProject: i18n.t('messages.portfolio.ongoing'),
      },
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
