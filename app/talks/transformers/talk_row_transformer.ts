import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface TalkRow {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  eventName: string
  eventDate: string | null
  city: string
  upcoming: boolean
  publishedAt: string | null
  scheduled: boolean
}

export default class TalkRowTransformer extends BaseTransformer<TalkRow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'hasEnglish',
      'status',
      'eventName',
      'eventDate',
      'city',
      'upcoming',
      'publishedAt',
      'scheduled',
    ])
  }
}
