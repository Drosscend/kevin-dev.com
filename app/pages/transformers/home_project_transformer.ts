import { BaseTransformer } from '@adonisjs/core/transformers'

export interface HomeProjectCard {
  slug: string
  title: string
  summary: string
  coverUrl: string | null
  ongoing: boolean
  technologies: string[]
}

export default class HomeProjectTransformer extends BaseTransformer<HomeProjectCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'coverUrl',
      'ongoing',
      'technologies',
    ])
  }
}
