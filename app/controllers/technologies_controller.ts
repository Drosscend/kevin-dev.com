import type { HttpContext } from '@adonisjs/core/http'
import Technology from '#models/technology'
import MediaService from '#services/media_service'
import SeoService from '#services/seo_service'
import { localePath, type Locale } from '#types/i18n'

function logoUrl(technology: Technology) {
  return MediaService.url(technology.logo, 320)
}

export default class TechnologiesController {
  async index({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const technologies = await Technology.query()
      .preload('translations', (translations) =>
        translations.select('id', 'technology_id', 'locale', 'description')
      )
      .preload('logo')
      .withCount('projects', (projects) => projects.withScopes((scopes) => scopes.published()))
      .orderBy('name')

    return inertia.render('technologies/index', {
      technologies: technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        logoUrl: logoUrl(technology),
        description: technology.description(locale),
        projectsLabel: i18n.t('messages.technologies.projectsCount', {
          count: Number(technology.$extras.projects_count ?? 0),
        }),
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
      meta: SeoService.build({
        title: i18n.t('messages.technologies.title'),
        description: i18n.t('messages.technologies.metaDescription'),
        locale,
        path: localePath(locale, '/technologies'),
        alternates: { fr: '/technologies', en: '/en/technologies' },
      }),
    })
  }

  async show({ params, inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const technology = await Technology.query()
      .where('slug', params.slug)
      .preload('translations', (translations) =>
        translations.select('id', 'technology_id', 'locale', 'description')
      )
      .preload('logo')
      .preload('projects', (projects) => {
        projects
          .withScopes((scopes) => scopes.published())
          .whereHas('translations', (translations) => translations.where('locale', locale))
          .preload('translations', (translations) =>
            translations.select('id', 'project_id', 'locale', 'title', 'summary')
          )
          .preload('cover')
          .orderBy('published_at', 'desc')
      })
      .firstOrFail()

    return inertia.render('technologies/show', {
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
          coverUrl: MediaService.url(project.cover),
        })),
      },
      labels: {
        backToList: i18n.t('messages.technologies.backToList'),
        usedIn: i18n.t('messages.technologies.usedIn'),
        noProjects: i18n.t('messages.technologies.noProjects'),
      },
      meta: SeoService.build({
        title: technology.name,
        description:
          technology.description(locale) || i18n.t('messages.technologies.metaDescription'),
        locale,
        path: localePath(locale, `/technologies/${technology.slug}`),
        alternates: {
          fr: `/technologies/${technology.slug}`,
          en: `/en/technologies/${technology.slug}`,
        },
        jsonLd: [
          SeoService.breadcrumbs([
            {
              name: i18n.t('messages.technologies.title'),
              path: localePath(locale, '/technologies'),
            },
            {
              name: technology.name,
              path: localePath(locale, `/technologies/${technology.slug}`),
            },
          ]),
        ],
      }),
    })
  }
}
