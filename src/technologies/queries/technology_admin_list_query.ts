import { inject } from '@adonisjs/core'
import Technology from '#technologies/models/technology'
import type { MediaSource } from '#media/media_source'
import type { TechnologyCategory } from '#types/content'

export interface TechnologyAdminListItem {
  id: number
  slug: string
  name: string
  category: TechnologyCategory
  logoMediaId: number | null
  logo: MediaSource | null
  docsUrl: string | null
  descriptionFr: string
  descriptionEn: string
  projectsCount: number
}

@inject()
export class TechnologyAdminListQuery {
  async execute(): Promise<TechnologyAdminListItem[]> {
    const technologies = await Technology.query()
      .preload('translations', (translations) =>
        translations.select('id', 'technology_id', 'locale', 'description')
      )
      .preload('logo')
      .withCount('projects')
      .orderBy('name')

    return technologies.map((technology) => ({
      id: technology.id,
      slug: technology.slug,
      name: technology.name,
      category: technology.category,
      logoMediaId: technology.logoMediaId,
      logo: technology.logo,
      docsUrl: technology.docsUrl,
      descriptionFr:
        technology.translations.find((item) => item.locale === 'fr')?.description ?? '',
      descriptionEn:
        technology.translations.find((item) => item.locale === 'en')?.description ?? '',
      projectsCount: Number(technology.$extras.projects_count ?? 0),
    }))
  }
}
