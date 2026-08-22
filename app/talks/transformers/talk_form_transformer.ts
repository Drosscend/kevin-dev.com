import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface TalkFormTranslationValues {
  title: string
  summary: string
  contentMarkdown: string
}

export interface TalkFormView {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  eventDate: string | null
  eventName: string
  city: string
  technologyIds: number[]
  // The form edits the type through a select, so it stays a plain
  // string until the validator narrows it back.
  links: { label: string; url: string; type: string }[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: TalkFormTranslationValues
  en: TalkFormTranslationValues | null
}

export default class TalkFormTransformer extends BaseTransformer<TalkFormView> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'status',
      'coverMediaId',
      'eventDate',
      'eventName',
      'city',
      'technologyIds',
      'links',
      'publishedAt',
      'hasBeenOnline',
      'fr',
      'en',
    ])
  }
}
