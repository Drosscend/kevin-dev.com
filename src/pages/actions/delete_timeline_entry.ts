import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { TimelineRepository } from '#pages/repositories/timeline_repository'
import type { TimelineEntryNotFoundError } from '#pages/actions/save_timeline_entry'

export type DeleteTimelineEntryResult = Result<null, TimelineEntryNotFoundError>

@inject()
export class DeleteTimelineEntry {
  constructor(private readonly timeline: TimelineRepository) {}

  async execute(id: number): Promise<DeleteTimelineEntryResult> {
    const entry = await this.timeline.findById(id)

    if (!entry) {
      return err({ type: 'timeline_entry_not_found' })
    }

    await this.timeline.delete(entry)

    return ok(null)
  }
}
