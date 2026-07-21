import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import Technology from '#models/technology'
import type { Locale } from '#types/i18n'

function logoUrl(technology: Technology) {
  if (!technology.logo) {
    return null
  }
  const variant =
    technology.logo.variants.find((item) => item.width === 320)?.file ?? 'original.webp'
  return router.makeUrl('uploads.show', { key: technology.logo.key, file: variant })
}

export default class TechnologiesController {
  async index({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const technologies = await Technology.query()
      .preload('translations')
      .preload('logo')
      .withCount('projects', (projects) => projects.where('status', 'published'))
      .orderBy('name')

    return inertia.render('technologies/index', {
      locale,
      technologies: technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        logoUrl: logoUrl(technology),
        description: technology.description(locale),
        projectsCount: Number(technology.$extras.projects_count ?? 0),
      })),
      labels: {
        title: i18n.t('messages.technologies.title'),
        empty: i18n.t('messages.technologies.empty'),
        categories: {
          langage: i18n.t('messages.technologies.categories.langage'),
          framework: i18n.t('messages.technologies.categories.framework'),
          outil: i18n.t('messages.technologies.categories.outil'),
          infra: i18n.t('messages.technologies.categories.infra'),
        },
      },
    })
  }

  async show({ params, inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const technology = await Technology.query()
      .where('slug', params.slug)
      .preload('translations')
      .preload('logo')
      .preload('projects', (projects) => {
        projects
          .where('status', 'published')
          .whereHas('translations', (translations) => translations.where('locale', locale))
          .preload('translations')
          .orderBy('published_at', 'desc')
      })
      .firstOrFail()

    return inertia.render('technologies/show', {
      locale,
      technology: {
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        logoUrl: logoUrl(technology),
        description: technology.description(locale),
        projects: technology.projects.map((project) => ({
          slug: project.slug,
          title: project.translation(locale)!.title,
          summary: project.translation(locale)!.summary,
        })),
      },
      labels: {
        backToList: i18n.t('messages.technologies.backToList'),
        usedIn: i18n.t('messages.technologies.usedIn'),
        noProjects: i18n.t('messages.technologies.noProjects'),
      },
    })
  }
}
