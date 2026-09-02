import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'
import type { TalkLinkType } from '#types/content'

export interface TalkDetailView {
  title: string
  contentHtml: string
  cover: Picture | null
  eventName: string
  eventDate: string
  city: string
  readingTimeLabel: string
  upcoming: boolean
  links: { label: string; url: string; type: TalkLinkType }[]
  technologies: { slug: string; name: string }[]
}

export default class TalkDetailTransformer extends BaseTransformer<TalkDetailView> {
  toObject() {
    return this.pick(this.resource, [
      'title',
      'contentHtml',
      'cover',
      'eventName',
      'eventDate',
      'city',
      'readingTimeLabel',
      'upcoming',
      'links',
      'technologies',
    ])
  }
}
