import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { TimelineRepository } from '#pages/repositories/timeline_repository'
import type { TimelineEntryNotFoundError } from '#pages/actions/save_timeline_entry'

export type MoveTimelineEntryResult = Result<null, TimelineEntryNotFoundError>

@inject()
export class MoveTimelineEntry {
  constructor(private readonly timeline: TimelineRepository) {}

  async execute(id: number, direction: 'up' | 'down'): Promise<MoveTimelineEntryResult> {
    const entry = await this.timeline.findById(id)

    if (!entry) {
      return err({ type: 'timeline_entry_not_found' })
    }

    const neighbour = await this.timeline.neighbourOf(entry, direction)

    if (neighbour) {
      await this.timeline.swapPositions(entry, neighbour)
    }

    return ok(null)
  }
}
