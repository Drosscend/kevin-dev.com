import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface HomeProjectCard {
  slug: string
  title: string
  summary: string
  cover: Picture | null
  ongoing: boolean
  technologies: string[]
}

export default class HomeProjectTransformer extends BaseTransformer<HomeProjectCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'cover',
      'ongoing',
      'technologies',
    ])
  }
}
