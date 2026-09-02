import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface HomeTalkCard {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: string
  city: string
  upcoming: boolean
  cover: Picture | null
}

export default class HomeTalkTransformer extends BaseTransformer<HomeTalkCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'eventName',
      'eventDate',
      'city',
      'upcoming',
      'cover',
    ])
  }
}
