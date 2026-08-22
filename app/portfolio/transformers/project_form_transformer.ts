import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface ProjectFormTranslationValues {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ProjectFormView {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  // The form edits the type through a select, so it stays a plain
  // string until the validator narrows it back.
  links: { label: string; url: string; type: string }[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: ProjectFormTranslationValues
  en: ProjectFormTranslationValues | null
}

export default class ProjectFormTransformer extends BaseTransformer<ProjectFormView> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'status',
      'coverMediaId',
      'startedAt',
      'endedAt',
      'featured',
      'technologyIds',
      'articleIds',
      'links',
      'publishedAt',
      'hasBeenOnline',
      'fr',
      'en',
    ])
  }
}
