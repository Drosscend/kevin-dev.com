import type { HttpContext } from '@adonisjs/core/http'
import TimelineEntry, { type TimelineHonours } from '#models/timeline_entry'
import SettingsService from '#services/settings_service'
import { upsertTranslations } from '#services/translations_service'
import {
  homeSettingsValidator,
  timelineEntryValidator,
  timelineMoveValidator,
} from '#validators/home'

type TimelinePayload = {
  honours?: TimelineHonours
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
function saveTimelineTranslations(entry: TimelineEntry, payload: TimelinePayload) {
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

export default class HomeController {
  async show({ inertia }: HttpContext) {
    const [settings, entries] = await Promise.all([
      SettingsService.getMany([
        'hero_roles_fr',
        'hero_roles_en',
        'hero_location',
        'now_fr',
        'now_en',
      ]),
      TimelineEntry.query()
        .preload('translations', (translations) =>
          translations.select('id', 'timeline_entry_id', 'locale', 'period', 'title', 'place')
        )
        .orderBy('position'),
    ])

    return inertia.render('admin/home', {
      settings: {
        heroRolesFr: settings.hero_roles_fr,
        heroRolesEn: settings.hero_roles_en,
        heroLocation: settings.hero_location,
        nowFr: settings.now_fr,
        nowEn: settings.now_en,
      },
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

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(homeSettingsValidator)

    await SettingsService.set('hero_roles_fr', (payload.heroRolesFr ?? '').trim())
    await SettingsService.set('hero_roles_en', (payload.heroRolesEn ?? '').trim())
    await SettingsService.set('hero_location', (payload.heroLocation ?? '').trim())
    await SettingsService.set('now_fr', (payload.nowFr ?? '').trim())
    await SettingsService.set('now_en', (payload.nowEn ?? '').trim())

    session.flash('success', 'Contenu de l’accueil enregistré')
    response.redirect().toRoute('admin.home.index')
  }

  async timelineStore({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(timelineEntryValidator)

    const last = await TimelineEntry.query().orderBy('position', 'desc').first()
    const entry = await TimelineEntry.create({
      position: (last?.position ?? 0) + 1,
      honours: payload.honours ?? 'none',
    })
    await saveTimelineTranslations(entry, payload)

    session.flash('success', 'Étape ajoutée au parcours')
    response.redirect().toRoute('admin.home.index')
  }

  async timelineUpdate({ params, request, response, session }: HttpContext) {
    const entry = await TimelineEntry.findOrFail(params.id)
    const payload = await request.validateUsing(timelineEntryValidator)

    await entry.merge({ honours: payload.honours ?? 'none' }).save()
    await saveTimelineTranslations(entry, payload)

    session.flash('success', 'Étape mise à jour')
    response.redirect().toRoute('admin.home.index')
  }

  async timelineMove({ params, request, response }: HttpContext) {
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

    response.redirect().toRoute('admin.home.index')
  }

  async timelineDestroy({ params, response, session }: HttpContext) {
    const entry = await TimelineEntry.findOrFail(params.id)
    await entry.delete()

    session.flash('success', 'Étape supprimée')
    response.redirect().toRoute('admin.home.index')
  }
}
