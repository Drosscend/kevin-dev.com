import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface ProjectCard {
  slug: string
  title: string
  summary: string
  cover: Picture | null
  period: string | null
  ongoing: boolean
  featured: boolean
  technologies: { slug: string; name: string }[]
}

export default class ProjectCardTransformer extends BaseTransformer<ProjectCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'cover',
      'period',
      'ongoing',
      'featured',
      'technologies',
    ])
  }
}
