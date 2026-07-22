import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import drive from '@adonisjs/drive/services/main'
import Article from '#models/article'
import Project from '#models/project'
import Technology from '#models/technology'
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

/** Career timeline, static content displayed on the homepage. */
const TIMELINE: Record<Locale, { period: string; title: string; place: string }[]> = {
  fr: [
    {
      period: '2025 — auj.',
      title: 'Consultant Data Migration · Développeur Full Stack & IA',
      place: 'En poste',
    },
    {
      period: '2023 — 2025',
      title: 'Master MIASHS ICE-LD',
      place: 'Université Toulouse Jean Jaurès',
    },
    { period: '2022 — 2023', title: 'Licence pro APSIO', place: 'IUT de Blagnac' },
    { period: '2020 — 2022', title: 'DUT Informatique', place: 'IUT de Blagnac' },
    { period: '2020', title: 'BAC STI2D', place: 'LPO Le Garros, Auch' },
  ],
  en: [
    {
      period: '2025 — today',
      title: 'Data Migration Consultant · Full Stack & AI Developer',
      place: 'Currently employed',
    },
    {
      period: '2023 — 2025',
      title: "Master's degree MIASHS ICE-LD",
      place: 'Université Toulouse Jean Jaurès',
    },
    {
      period: '2022 — 2023',
      title: 'Professional bachelor APSIO',
      place: 'IUT de Blagnac',
    },
    {
      period: '2020 — 2022',
      title: 'DUT in computer science',
      place: 'IUT de Blagnac',
    },
    { period: '2020', title: 'STI2D high school diploma', place: 'LPO Le Garros, Auch' },
  ],
}

export default class HomeController {
  async handle({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const [articles, projects, technologies, settings] = await Promise.all([
      Article.query()
        .where('status', 'published')
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'article_id', 'locale', 'title', 'summary')
        )
        .orderBy('published_at', 'desc')
        .limit(3),
      Project.query()
        .where('status', 'published')
        .where('featured', true)
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'project_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('published_at', 'desc')
        .limit(3),
      Technology.query().orderBy('name').select('slug', 'name'),
      SettingsService.getMany(['now_fr', 'now_en']),
    ])

    const now = (locale === 'en' ? settings.now_en : settings.now_fr) || null

    return inertia.render('home', {
      now,
      cvPdfAvailable: await drive.use().exists(CV_PDF_KEY),
      latestArticles: articles.map((article) => ({
        slug: article.slug,
        title: article.translation(locale)!.title,
        summary: article.translation(locale)!.summary,
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
      timeline: TIMELINE[locale],
      labels: {
        roles: [i18n.t('messages.home.roleFullStack'), i18n.t('messages.home.roleAi')],
        location: i18n.t('messages.home.location'),
        downloadCv: i18n.t('messages.home.downloadCv'),
        contactMe: i18n.t('messages.home.contactMe'),
        photoAlt: i18n.t('messages.home.photoAlt'),
        now: i18n.t('messages.home.now'),
        featuredProjects: i18n.t('messages.home.featuredProjects'),
        viewProject: i18n.t('messages.home.viewProject'),
        latestArticles: i18n.t('messages.home.latestArticles'),
        allArticles: i18n.t('messages.home.allArticles'),
        allProjects: i18n.t('messages.home.allProjects'),
        timeline: i18n.t('messages.home.timeline'),
        stack: i18n.t('messages.home.stack'),
        allTechnologies: i18n.t('messages.home.allTechnologies'),
        talks: i18n.t('messages.home.talks'),
        talksText: i18n.t('messages.home.talksText'),
        talksContact: i18n.t('messages.home.talksContact'),
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
