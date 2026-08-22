import { inject } from '@adonisjs/core'
import Project from '#portfolio/models/project'
import type { MediaSource } from '#media/media_source'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface ProjectTechnologyItem {
  slug: string
  name: string
}

export interface ProjectListItem {
  slug: string
  title: string
  summary: string
  cover: MediaSource | null
  startedAt: DateTime | null
  endedAt: DateTime | null
  readingTime: number
  ongoing: boolean
  technologies: ProjectTechnologyItem[]
}

@inject()
export class ProjectListQuery {
  async execute(locale: Locale): Promise<ProjectListItem[]> {
    const projects = await Project.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary')
      )
      .preload('cover')
      .preload('technologies')
      .orderBy('featured', 'desc')
      .orderBy('published_at', 'desc')

    return projects.map((project) => {
      const translation = project.translation(locale)!

      return {
        slug: project.slug,
        title: translation.title,
        summary: translation.summary,
        cover: project.cover,
        startedAt: project.startedAt,
        endedAt: project.endedAt,
        readingTime: project.readingTime,
        ongoing: project.isOngoing,
        technologies: project.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
      }
    })
  }
}
