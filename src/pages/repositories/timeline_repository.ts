import TimelineEntry from '#pages/models/timeline_entry'
import { upsertTranslations } from '#shared/content/translations'
import type { TimelineHonours } from '#types/content'

export interface TimelineEntryPayload {
  honours: TimelineHonours
  periodFr: string
  titleFr: string
  placeFr: string
  periodEn?: string
  titleEn?: string
  placeEn?: string
}

export class TimelineRepository {
  async findById(id: number) {
    return TimelineEntry.find(id)
  }

  async lastPosition() {
    const last = await TimelineEntry.query().orderBy('position', 'desc').first()

    return last?.position ?? 0
  }

  async neighbourOf(entry: TimelineEntry, direction: 'up' | 'down') {
    return TimelineEntry.query()
      .where('position', direction === 'up' ? '<' : '>', entry.position)
      .orderBy('position', direction === 'up' ? 'desc' : 'asc')
      .first()
  }

  async create(position: number, honours: TimelineHonours) {
    return TimelineEntry.create({ position, honours })
  }

  /**
   * The English fields are optional one by one: any left empty falls
   * back to its French value, and an entirely empty English form drops
   * the translation altogether.
   */
  async saveTranslations(entry: TimelineEntry, payload: TimelineEntryPayload) {
    const fr = { period: payload.periodFr, title: payload.titleFr, place: payload.placeFr }
    const hasEnglish = Boolean(payload.periodEn || payload.titleEn || payload.placeEn)

    await upsertTranslations(entry.related('translations'), {
      fr,
      en: hasEnglish
        ? {
            period: payload.periodEn || fr.period,
            title: payload.titleEn || fr.title,
            place: payload.placeEn || fr.place,
          }
        : null,
    })
  }

  async saveHonours(entry: TimelineEntry, honours: TimelineHonours) {
    await entry.merge({ honours }).save()
  }

  async swapPositions(entry: TimelineEntry, neighbour: TimelineEntry) {
    const position = entry.position
    entry.position = neighbour.position
    neighbour.position = position

    await Promise.all([entry.save(), neighbour.save()])
  }

  async delete(entry: TimelineEntry) {
    await entry.delete()
  }
}
