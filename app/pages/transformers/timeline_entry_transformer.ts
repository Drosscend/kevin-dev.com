import { BaseTransformer } from '@adonisjs/core/transformers'
import type { TimelineHonours } from '#types/content'

export interface TimelineEntryView {
  period: string
  title: string
  place: string
  honours: TimelineHonours
}

export default class TimelineEntryTransformer extends BaseTransformer<TimelineEntryView> {
  toObject() {
    return this.pick(this.resource, ['period', 'title', 'place', 'honours'])
  }
}
