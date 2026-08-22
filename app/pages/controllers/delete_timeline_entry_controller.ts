import { inject } from '@adonisjs/core'
import { DeleteTimelineEntry } from '#pages/actions/delete_timeline_entry'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteTimelineEntryController {
  constructor(private readonly deleteTimelineEntry: DeleteTimelineEntry) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteTimelineEntry.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Étape supprimée')
    return response.redirect().toRoute('admin.timeline.index')
  }
}
