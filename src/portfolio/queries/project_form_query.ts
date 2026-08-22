import { inject } from '@adonisjs/core'
import Project from '#portfolio/models/project'
import type { ProjectLinkType, PublicationStatus } from '#types/content'
import type { DateTime } from 'luxon'

export interface ProjectFormTranslation {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ProjectForm {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  startedAt: DateTime | null
  endedAt: DateTime | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  links: { label: string; url: string; type: ProjectLinkType }[]
  publishedAt: DateTime | null
  hasBeenOnline: boolean
  fr: ProjectFormTranslation
  en: ProjectFormTranslation | null
}

@inject()
export class ProjectFormQuery {
  async execute(id: number): Promise<ProjectForm | null> {
    const project = await Project.query()
      .where('id', id)
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies', (technologies) => technologies.select('id'))
      .preload('articles', (articles) => articles.select('id'))
      .first()

    if (!project) {
      return null
    }

    const fr = project.translation('fr')
    const en = project.translation('en')

    return {
      id: project.id,
      slug: project.slug,
      status: project.status,
      coverMediaId: project.coverMediaId,
      startedAt: project.startedAt,
      endedAt: project.endedAt,
      featured: project.featured,
      technologyIds: project.technologies.map((technology) => technology.id),
      articleIds: project.articles.map((article) => article.id),
      links: project.links.map((link) => ({ label: link.label, url: link.url, type: link.type })),
      publishedAt: project.publishedAt,
      hasBeenOnline: project.hasBeenOnline,
      fr: {
        title: fr?.title ?? '',
        summary: fr?.summary ?? '',
        contentMarkdown: fr?.contentMarkdown ?? '',
      },
      en: en ? { title: en.title, summary: en.summary, contentMarkdown: en.contentMarkdown } : null,
    }
  }
}
