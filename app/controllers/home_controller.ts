import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import Article from '#models/article'
import Project from '#models/project'
import type Media from '#models/media'
import SeoService from '#services/seo_service'
import type { Locale } from '#types/i18n'

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
    const base = locale === 'en' ? '/en' : ''

    const [articles, projects] = await Promise.all([
      Article.query()
        .where('status', 'published')
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations')
        .orderBy('published_at', 'desc')
        .limit(3),
      Project.query()
        .where('status', 'published')
        .where('featured', true)
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations')
        .preload('cover')
        .orderBy('published_at', 'desc')
        .limit(3),
    ])

    return inertia.render('home', {
      locale,
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
      labels: {
        intro: i18n.t('messages.home.intro'),
        latestArticles: i18n.t('messages.home.latestArticles'),
        featuredProjects: i18n.t('messages.home.featuredProjects'),
        allArticles: i18n.t('messages.home.allArticles'),
        allProjects: i18n.t('messages.home.allProjects'),
      },
      meta: SeoService.build({
        title: 'kevin-dev.com',
        description: i18n.t('messages.home.metaDescription'),
        locale,
        path: base || '/',
        alternates: { fr: '/', en: '/en' },
        jsonLd: [SeoService.person()],
      }),
    })
  }
}
