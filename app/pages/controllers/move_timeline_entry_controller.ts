import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { MoveTimelineEntry } from '#pages/actions/move_timeline_entry'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MoveTimelineEntryController {
  static readonly validator = vine.create({
    direction: vine.enum(['up', 'down']),
  })

  constructor(private readonly moveTimelineEntry: MoveTimelineEntry) {}

  async execute({ params, request, response }: HttpContext) {
    const { direction } = await request.validateUsing(MoveTimelineEntryController.validator)
    const result = await this.moveTimelineEntry.execute(params.id, direction)

    if (!result.ok) {
      return response.notFound()
    }

    return response.redirect().toRoute('admin.timeline.index')
  }
}
