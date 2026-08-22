import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { TimelineRepository } from '#pages/repositories/timeline_repository'
import type TimelineEntry from '#pages/models/timeline_entry'
import type { TimelineEntryPayload } from '#pages/repositories/timeline_repository'

export interface SaveTimelineEntryParams {
  id?: number
  payload: TimelineEntryPayload
}

export interface TimelineEntryNotFoundError {
  type: 'timeline_entry_not_found'
}

export type SaveTimelineEntryResult = Result<TimelineEntry, TimelineEntryNotFoundError>

@inject()
export class SaveTimelineEntry {
  constructor(private readonly timeline: TimelineRepository) {}

  async execute(params: SaveTimelineEntryParams): Promise<SaveTimelineEntryResult> {
    if (params.id === undefined) {
      const position = (await this.timeline.lastPosition()) + 1
      const entry = await this.timeline.create(position, params.payload.honours)
      await this.timeline.saveTranslations(entry, params.payload)

      return ok(entry)
    }

    const entry = await this.timeline.findById(params.id)

    if (!entry) {
      return err({ type: 'timeline_entry_not_found' })
    }

    await this.timeline.saveHonours(entry, params.payload.honours)
    await this.timeline.saveTranslations(entry, params.payload)

    return ok(entry)
  }
}
