import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import drive from '@adonisjs/drive/services/main'
import Article from '#models/article'
import Project from '#models/project'
import Talk from '#models/talk'
import Technology from '#models/technology'
import TimelineEntry from '#models/timeline_entry'
import type Media from '#models/media'
import SeoService from '#services/seo_service'
import SettingsService from '#services/settings_service'
import { CV_PDF_KEY } from '#controllers/cv_controller'
import { localePath, type Locale } from '#types/i18n'

function thumbnailUrl(media: Media | null) {
  if (!media) {
    return null
  }
  const variant = media.variants.find((item) => item.width === 640)?.file ?? 'original.webp'
  return router.makeUrl('uploads.show', { key: media.key, file: variant })
}

export default class HomeController {
  async handle({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const [articles, projects, talks, technologies, settings, timelineEntries] = await Promise.all([
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'article_id', 'locale', 'title', 'summary')
        )
        .orderBy('published_at', 'desc')
        .limit(3),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .where('featured', true)
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'project_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('published_at', 'desc')
        .limit(3),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'talk_id', 'locale', 'title')
        )
        .orderBy('event_date', 'desc')
        .limit(3),
      Technology.query().orderBy('name').select('slug', 'name'),
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

    // Settings override the default i18n copy; empty values fall back.
    const roles = localized(settings.hero_roles_fr, settings.hero_roles_en)
      .split('\n')
      .map((role) => role.trim())
      .filter(Boolean)

    return inertia.render('home', {
      now,
      cvPdfAvailable: await drive.use().exists(CV_PDF_KEY),
      latestArticles: articles.map((article) => ({
        slug: article.slug,
        title: article.translation(locale)!.title,
        summary: article.translation(locale)!.summary,
        publishedAt:
          article.publishedAt
            ?.setLocale(locale)
            .toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' }) ?? null,
      })),
      featuredProjects: projects.map((project) => ({
        slug: project.slug,
        title: project.translation(locale)!.title,
        summary: project.translation(locale)!.summary,
        coverUrl: thumbnailUrl(project.cover),
      })),
      technologies: technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      talks: talks.map((talk) => ({
        slug: talk.slug,
        title: talk.translation(locale)!.title,
        eventName: talk.eventName,
        eventDate: talk.eventDate
          .setLocale(locale)
          .toLocaleString({ month: 'long', year: 'numeric' }),
        city: talk.city,
        upcoming: talk.isUpcoming,
      })),
      timeline: timelineEntries.map((entry) => {
        const translation = entry.translation(locale)
        return {
          period: translation?.period ?? '',
          title: translation?.title ?? '',
          place: translation?.place ?? '',
        }
      }),
      labels: {
        roles:
          roles.length > 0
            ? roles
            : [i18n.t('messages.home.roleFullStack'), i18n.t('messages.home.roleAi')],
        location: settings.hero_location || i18n.t('messages.home.location'),
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
      },
      meta: SeoService.build({
        title: 'kevin-dev.com',
        description: i18n.t('messages.home.metaDescription'),
        locale,
        path: localePath(locale, '/'),
        alternates: { fr: '/', en: '/en' },
        jsonLd: [SeoService.person()],
      }),
    })
  }
}
