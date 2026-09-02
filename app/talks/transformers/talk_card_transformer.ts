import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'
import type { TalkLinkType } from '#types/content'

export interface TalkCard {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: string
  city: string
  readingTimeLabel: string
  upcoming: boolean
  links: { label: string; url: string; type: TalkLinkType }[]
  technologies: { slug: string; name: string }[]
  cover: Picture | null
}

export default class TalkCardTransformer extends BaseTransformer<TalkCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'eventName',
      'eventDate',
      'city',
      'readingTimeLabel',
      'upcoming',
      'links',
      'technologies',
      'cover',
    ])
  }
}
