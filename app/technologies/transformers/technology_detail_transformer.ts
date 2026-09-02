import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface TechnologyEntry {
  slug: string
  title: string
  summary: string
  cover: Picture | null
}

export interface TechnologyDetailView {
  name: string
  logo: Picture | null
  docsUrl: string | null
  description: string
  projects: TechnologyEntry[]
  articles: TechnologyEntry[]
  talks: TechnologyEntry[]
}

export default class TechnologyDetailTransformer extends BaseTransformer<TechnologyDetailView> {
  toObject() {
    return this.pick(this.resource, [
      'name',
      'logo',
      'docsUrl',
      'description',
      'projects',
      'articles',
      'talks',
    ])
  }
}
