import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'
import type { ProjectLinkType } from '#types/content'

export interface ProjectDetailView {
  title: string
  contentHtml: string
  cover: Picture | null
  startedAt: string | null
  endedAt: string | null
  readingTimeLabel: string
  ongoing: boolean
  links: { label: string; url: string; type: ProjectLinkType }[]
  technologies: { slug: string; name: string }[]
  articles: { slug: string; title: string }[]
}

export default class ProjectDetailTransformer extends BaseTransformer<ProjectDetailView> {
  toObject() {
    return this.pick(this.resource, [
      'title',
      'contentHtml',
      'cover',
      'startedAt',
      'endedAt',
      'readingTimeLabel',
      'ongoing',
      'links',
      'technologies',
      'articles',
    ])
  }
}
