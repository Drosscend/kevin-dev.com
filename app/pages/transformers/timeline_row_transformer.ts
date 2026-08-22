import { BaseTransformer } from '@adonisjs/core/transformers'
import type { TimelineHonours } from '#types/content'

export interface TimelineRow {
  id: number
  honours: TimelineHonours
  periodFr: string
  titleFr: string
  placeFr: string
  periodEn: string
  titleEn: string
  placeEn: string
}

export default class TimelineRowTransformer extends BaseTransformer<TimelineRow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'honours',
      'periodFr',
      'titleFr',
      'placeFr',
      'periodEn',
      'titleEn',
      'placeEn',
    ])
  }
}
