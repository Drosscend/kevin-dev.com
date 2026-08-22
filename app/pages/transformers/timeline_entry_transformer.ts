import { BaseTransformer } from '@adonisjs/core/transformers'

export interface TimelineEntryView {
  period: string
  title: string
  place: string
  honours: string | null
}

export default class TimelineEntryTransformer extends BaseTransformer<TimelineEntryView> {
  toObject() {
    return this.pick(this.resource, ['period', 'title', 'place', 'honours'])
  }
}
