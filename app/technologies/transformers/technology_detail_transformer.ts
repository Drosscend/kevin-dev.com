import { BaseTransformer } from '@adonisjs/core/transformers'

export interface TechnologyEntry {
  slug: string
  title: string
  summary: string
  coverUrl: string | null
}

export interface TechnologyDetailView {
  name: string
  logoUrl: string | null
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
      'logoUrl',
      'docsUrl',
      'description',
      'projects',
      'articles',
      'talks',
    ])
  }
}
