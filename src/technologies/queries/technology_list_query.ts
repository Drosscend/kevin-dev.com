import { inject } from '@adonisjs/core'
import Technology from '#technologies/models/technology'
import type { MediaSource } from '#media/media_source'
import type { TechnologyCategory } from '#types/content'
import type { Locale } from '#types/i18n'

export interface TechnologyListItem {
  slug: string
  name: string
  category: TechnologyCategory
  logo: MediaSource | null
  docsUrl: string | null
  description: string
  projectsCount: number
  articlesCount: number
  talksCount: number
}

@inject()
export class TechnologyListQuery {
  async execute(locale: Locale): Promise<TechnologyListItem[]> {
    const technologies = await Technology.query()
      .preload('translations', (translations) =>
        translations.select('id', 'technology_id', 'locale', 'description')
      )
      .preload('logo')
      .withCount('projects', (projects) => projects.withScopes((scopes) => scopes.published()))
      .withCount('articles', (articles) => articles.withScopes((scopes) => scopes.published()))
      .withCount('talks', (talks) => talks.withScopes((scopes) => scopes.published()))
      .orderBy('name')

    return technologies.map((technology) => ({
      slug: technology.slug,
      name: technology.name,
      category: technology.category,
      logo: technology.logo,
      docsUrl: technology.docsUrl,
      description: technology.description(locale),
      projectsCount: Number(technology.$extras.projects_count ?? 0),
      articlesCount: Number(technology.$extras.articles_count ?? 0),
      talksCount: Number(technology.$extras.talks_count ?? 0),
    }))
  }
}
