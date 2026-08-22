import drive from '@adonisjs/drive/services/main'
import { mediaUrl } from '#app/shared/media_url'
import { CV_PDF_KEY } from '#controllers/cv_controller'
import Article from '#models/article'
import Project from '#models/project'
import TimelineEntry from '#models/timeline_entry'
import { longDate, monthYear } from '#services/date_format'
import SeoService from '#services/seo_service'
import SettingsService from '#services/settings_service'
import Talk from '#talks/models/talk'
import Technology from '#technologies/models/technology'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * The stack section only shows the technologies carrying the most published
 * projects; the rest stays one click away on /technologies.
 */
const TECHNOLOGIES_SHOWN = 12

export default class HomeController {
  async handle({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    // Every listed section only shows its first few entries, so each carries a
    // total to hint at what the "see all" link leads to. The counts reuse the
    // exact filters of the matching listing (/projects, /blog, /talks) to stay
    // in sync with what the visitor lands on.
    const [
      articles,
      articlesTotal,
      projects,
      projectsTotal,
      talks,
      talksTotal,
      technologies,
      technologiesTotal,
      settings,
      timelineEntries,
    ] = await Promise.all([
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'article_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('published_at', 'desc')
        .limit(3),
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      // Featured projects lead the section, then the most recently published
      // ones fill the remaining slots. "featured" prioritises rather than
      // restricts, so the grid never looks bare when only a few are pinned.
      Project.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'project_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .preload('technologies', (query) => query.select('slug', 'name'))
        .orderBy('featured', 'desc')
        .orderBy('published_at', 'desc')
        .limit(3),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'talk_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('event_date', 'desc')
        .limit(3),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      Technology.query()
        .select('slug', 'name')
        .withCount('projects', (query) => query.withScopes((scopes) => scopes.published()))
        .orderBy('projects_count', 'desc')
        .orderBy('name')
        .limit(TECHNOLOGIES_SHOWN),
      Technology.query()
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      SettingsService.getMany([
        'now_fr',
        'now_en',
        'hero_roles_fr',
        'hero_roles_en',
        'hero_location',
      ]),
      TimelineEntry.query().preload('translations').orderBy('position'),
    ])

    const localized = (fr: string, en: string) => (locale === 'en' ? en || fr : fr)
    const now = localized(settings.now_fr, settings.now_en) || null

    // The hero comes entirely from the settings: an empty value hides its line.
    const roles = localized(settings.hero_roles_fr, settings.hero_roles_en)
      .split('\n')
      .map((role) => role.trim())
      .filter(Boolean)

    return inertia.render('home', {
      now,
      roles,
      location: settings.hero_location || null,
      cvPdfAvailable: await drive.use().exists(CV_PDF_KEY),
      latestArticles: articles.map((article) => ({
        slug: article.slug,
        title: article.translation(locale)!.title,
        summary: article.translation(locale)!.summary,
        publishedAt: longDate(article.publishedAt, locale),
        coverUrl: mediaUrl(article.cover),
      })),
      articlesTotal,
      projects: projects.map((project) => ({
        slug: project.slug,
        title: project.translation(locale)!.title,
        summary: project.translation(locale)!.summary,
        coverUrl: mediaUrl(project.cover),
        ongoing: project.isOngoing,
        technologies: project.technologies.map((technology) => technology.name),
      })),
      projectsTotal,
      technologies: technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      hiddenTechnologies: Math.max(0, technologiesTotal - technologies.length),
      talks: talks.map((talk) => ({
        slug: talk.slug,
        title: talk.translation(locale)!.title,
        eventName: talk.eventName,
        eventDate: monthYear(talk.eventDate, locale),
        city: talk.city,
        upcoming: talk.isUpcoming,
        summary: talk.translation(locale)!.summary,
        coverUrl: mediaUrl(talk.cover),
      })),
      talksTotal,
      timeline: timelineEntries.map((entry) => {
        const translation = entry.translation(locale)
        return {
          period: translation?.period ?? '',
          title: translation?.title ?? '',
          place: translation?.place ?? '',
          // The honours are stored once for both locales, only their
          // label is translated. "none" hides the mention.
          honours:
            entry.honours === 'none' ? null : i18n.t(`messages.home.honours.${entry.honours}`),
        }
      }),
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
