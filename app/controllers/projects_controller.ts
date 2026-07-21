import { type DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import router from '@adonisjs/core/services/router'
import Project from '#models/project'
import type Media from '#models/media'
import type { Locale } from '#types/i18n'

function coverUrl(cover: Media | null) {
  if (!cover) {
    return null
  }
  const variant = cover.variants.find((item) => item.width === 640)?.file ?? 'original.webp'
  return router.makeUrl('uploads.show', { key: cover.key, file: variant })
}

function formatDate(date: DateTime | null, locale: Locale) {
  return date?.setLocale(locale).toLocaleString({ month: 'long', year: 'numeric' }) ?? null
}

export default class ProjectsController {
  async index({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const projects = await Project.query()
      .where('status', 'published')
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations')
      .preload('cover')
      .preload('technologies')
      .orderBy('featured', 'desc')
      .orderBy('published_at', 'desc')

    return inertia.render('portfolio/index', {
      locale,
      projects: projects.map((project) => {
        const translation = project.translation(locale)!
        return {
          slug: project.slug,
          title: translation.title,
          summary: translation.summary,
          coverUrl: coverUrl(project.cover),
          featured: project.featured,
          technologies: project.technologies.map((technology) => ({
            slug: technology.slug,
            name: technology.name,
          })),
        }
      }),
      labels: {
        title: i18n.t('messages.portfolio.title'),
        empty: i18n.t('messages.portfolio.empty'),
      },
    })
  }

  async show({ params, inertia, auth, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const project = await Project.query()
      .where('slug', params.slug)
      .preload('translations')
      .preload('cover')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .preload('articles', (articles) => {
        articles.where('status', 'published').preload('translations')
      })
      .firstOrFail()

    const translation = project.translation(locale)
    if (!translation) {
      throw new Exception('Not found', { status: 404 })
    }

    const isDraftPreview = !project.isPublished
    if (isDraftPreview && !auth.user) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('portfolio/show', {
      locale,
      isDraftPreview,
      project: {
        slug: project.slug,
        title: translation.title,
        summary: translation.summary,
        contentHtml: translation.contentHtml,
        coverUrl: coverUrl(project.cover),
        startedAt: formatDate(project.startedAt, locale),
        endedAt: formatDate(project.endedAt, locale),
        links: project.links.map((link) => ({
          label: link.label,
          url: link.url,
          type: link.type,
        })),
        technologies: project.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
        articles: project.articles
          .filter((article) => article.translation(locale) !== undefined)
          .map((article) => ({
            slug: article.slug,
            title: article.translation(locale)!.title,
          })),
      },
      hasOtherLocale: project.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      labels: {
        backToList: i18n.t('messages.portfolio.backToList'),
        draft: i18n.t('messages.blog.draft'),
        technologies: i18n.t('messages.portfolio.technologies'),
        relatedArticles: i18n.t('messages.portfolio.relatedArticles'),
      },
    })
  }
}
