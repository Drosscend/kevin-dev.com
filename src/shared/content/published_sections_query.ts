import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import Project from '#portfolio/models/project'
import Talk from '#talks/models/talk'
import Technology from '#technologies/models/technology'
import type { Locale } from '#types/i18n'

/**
 * Which content sections have something to show in a locale. A type
 * alias rather than an interface: Inertia shares it as a prop, and a
 * shared prop needs the implicit index signature only aliases carry.
 */
export type PublishedSections = {
  projects: boolean
  blog: boolean
  talks: boolean
  technologies: boolean
}

/**
 * The navigation only lists a section once it has content a visitor
 * can open, on the same rules as the listings: published, and
 * translated in the language being browsed.
 */
@inject()
export class PublishedSectionsQuery {
  async execute(locale: Locale): Promise<PublishedSections> {
    const [project, article, talk, technology] = await Promise.all([
      Project.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .select('id')
        .first(),
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .select('id')
        .first(),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .select('id')
        .first(),
      Technology.query().select('id').first(),
    ])

    return {
      projects: project !== null,
      blog: article !== null,
      talks: talk !== null,
      technologies: technology !== null,
    }
  }
}
