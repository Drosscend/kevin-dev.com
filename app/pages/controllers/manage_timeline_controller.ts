import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import TimelineRowTransformer from '#app/pages/transformers/timeline_row_transformer'
import { SaveTimelineEntry } from '#pages/actions/save_timeline_entry'
import { TimelineAdminListQuery } from '#pages/queries/timeline_admin_list_query'
import { TIMELINE_HONOURS } from '#types/content'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * The career timeline of the homepage: an ordered collection, edited
 * on its own page like the other content models. The English
 * translation is optional as a whole: when every EN field is empty,
 * the French entry is shown to both locales.
 */
@inject()
export default class ManageTimelineController {
  static readonly validator = vine.create({
    honours: vine.enum(TIMELINE_HONOURS).optional(),
    periodFr: vine.string().trim().minLength(1).maxLength(50),
    titleFr: vine.string().trim().minLength(1).maxLength(200),
    placeFr: vine.string().trim().minLength(1).maxLength(200),
    periodEn: vine.string().trim().maxLength(50).optional(),
    titleEn: vine.string().trim().maxLength(200).optional(),
    placeEn: vine.string().trim().maxLength(200).optional(),
  })

  constructor(
    private readonly timelineAdminList: TimelineAdminListQuery,
    private readonly saveTimelineEntry: SaveTimelineEntry
  ) {}

  async render({ inertia }: HttpContext) {
    return inertia.render('admin/timeline', {
      timeline: TimelineRowTransformer.transform(await this.timelineAdminList.execute()),
    })
  }

  async execute({ params, request, response, session }: HttpContext) {
    const id = params.id ? Number(params.id) : undefined
    const payload = await request.validateUsing(ManageTimelineController.validator)

    const result = await this.saveTimelineEntry.execute({
      id,
      payload: { ...payload, honours: payload.honours ?? 'none' },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', id ? 'Étape mise à jour' : 'Étape ajoutée au parcours')
    return response.redirect().toRoute('admin.timeline.index')
  }
}
