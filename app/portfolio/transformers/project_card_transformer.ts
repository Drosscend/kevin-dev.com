import { BaseTransformer } from '@adonisjs/core/transformers'

export interface ProjectCard {
  slug: string
  title: string
  summary: string
  coverUrl: string | null
  period: string | null
  readingTimeLabel: string
  ongoing: boolean
  technologies: { slug: string; name: string }[]
}

export default class ProjectCardTransformer extends BaseTransformer<ProjectCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'coverUrl',
      'period',
      'readingTimeLabel',
      'ongoing',
      'technologies',
    ])
  }
}
