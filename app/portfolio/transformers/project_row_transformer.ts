import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface ProjectRow {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  featured: boolean
  publishedAt: string | null
  scheduled: boolean
  technologiesCount: number
}

export default class ProjectRowTransformer extends BaseTransformer<ProjectRow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'hasEnglish',
      'status',
      'featured',
      'publishedAt',
      'scheduled',
      'technologiesCount',
    ])
  }
}
