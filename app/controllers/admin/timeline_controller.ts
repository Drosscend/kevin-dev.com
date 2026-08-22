import TimelineEntry from '#models/timeline_entry'
import { upsertTranslations } from '#services/translations_service'
import { timelineEntryValidator, timelineMoveValidator } from '#validators/timeline'
import type { HttpContext } from '@adonisjs/core/http'

type TimelinePayload = {
  periodFr: string
  titleFr: string
  placeFr: string
  periodEn?: string
  titleEn?: string
  placeEn?: string
}

/**
 * Saves both locales of a timeline entry. The English fields are
 * optional one by one: any that is left empty falls back to its
 * French value, and an entirely empty English form drops the
 * translation altogether.
 */
function saveTranslations(entry: TimelineEntry, payload: TimelinePayload) {
  const fr = { period: payload.periodFr, title: payload.titleFr, place: payload.placeFr }
  const hasEnglish = Boolean(payload.periodEn || payload.titleEn || payload.placeEn)

  return upsertTranslations(entry.related('translations'), {
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

/**
 * The career timeline of the homepage: an ordered collection, edited
 * on its own page like the other content models.
 */
export default class TimelineController {
  async index({ inertia }: HttpContext) {
    const entries = await TimelineEntry.query()
      .preload('translations', (translations) =>
        translations.select('id', 'timeline_entry_id', 'locale', 'period', 'title', 'place')
      )
      .orderBy('position')

    return inertia.render('admin/timeline', {
      timeline: entries.map((entry) => {
        const fr = entry.translations.find((item) => item.locale === 'fr')
        const en = entry.translations.find((item) => item.locale === 'en')
        return {
          id: entry.id,
          honours: entry.honours,
          periodFr: fr?.period ?? '',
          titleFr: fr?.title ?? '',
          placeFr: fr?.place ?? '',
          periodEn: en?.period ?? '',
          titleEn: en?.title ?? '',
          placeEn: en?.place ?? '',
        }
      }),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(timelineEntryValidator)

    const last = await TimelineEntry.query().orderBy('position', 'desc').first()
    const entry = await TimelineEntry.create({
      position: (last?.position ?? 0) + 1,
      honours: payload.honours ?? 'none',
    })
    await saveTranslations(entry, payload)

    session.flash('success', 'Étape ajoutée au parcours')
    response.redirect().toRoute('admin.timeline.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const entry = await TimelineEntry.findOrFail(params.id)
    const payload = await request.validateUsing(timelineEntryValidator)

    await entry.merge({ honours: payload.honours ?? 'none' }).save()
    await saveTranslations(entry, payload)

    session.flash('success', 'Étape mise à jour')
    response.redirect().toRoute('admin.timeline.index')
  }

  async move({ params, request, response }: HttpContext) {
    const { direction } = await request.validateUsing(timelineMoveValidator)
    const entry = await TimelineEntry.findOrFail(params.id)

    const neighbor = await TimelineEntry.query()
      .where('position', direction === 'up' ? '<' : '>', entry.position)
      .orderBy('position', direction === 'up' ? 'desc' : 'asc')
      .first()

    if (neighbor) {
      const position = entry.position
      entry.position = neighbor.position
      neighbor.position = position
      await Promise.all([entry.save(), neighbor.save()])
    }

    response.redirect().toRoute('admin.timeline.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const entry = await TimelineEntry.findOrFail(params.id)
    await entry.delete()

    session.flash('success', 'Étape supprimée')
    response.redirect().toRoute('admin.timeline.index')
  }
}
