import { inject } from '@adonisjs/core'
import Project from '#portfolio/models/project'
import type { PublicationStatus } from '#types/content'
import type { DateTime } from 'luxon'

export interface ProjectAdminListItem {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  featured: boolean
  publishedAt: DateTime | null
  scheduled: boolean
  technologiesCount: number
}

@inject()
export class ProjectAdminListQuery {
  async execute(): Promise<ProjectAdminListItem[]> {
    const projects = await Project.query()
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title')
      )
      .withCount('technologies')
      // Ordered by the date the list shows. Drafts carry none, so they
      // surface first, where the work waiting to be finished belongs.
      .orderByRaw('published_at desc nulls first')
      .orderBy('created_at', 'desc')

    return projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.translation('fr')?.title ?? project.slug,
      hasEnglish: project.translation('en') !== undefined,
      status: project.status,
      featured: project.featured,
      publishedAt: project.publishedAt,
      scheduled: !project.isPublished && project.status === 'published',
      technologiesCount: Number(project.$extras.technologies_count ?? 0),
    }))
  }
}
