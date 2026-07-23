import type { HttpContext } from '@adonisjs/core/http'
import Talk from '#models/talk'
import Technology from '#models/technology'
import Media from '#models/media'
import TalkService from '#services/talk_service'
import { talkValidator } from '#validators/portfolio'

async function formOptions() {
  const [technologies, media] = await Promise.all([
    Technology.query().select('id', 'name').orderBy('name'),
    Media.query()
      .withScopes((scopes) => scopes.images())
      .select('id', 'alt')
      .orderBy('created_at', 'desc'),
  ])

  return {
    technologies: technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
    })),
    media: media.map((item) => ({ id: item.id, alt: item.alt })),
  }
}

function payloadFromRequest(payload: Awaited<ReturnType<typeof talkValidator.validate>>) {
  return {
    slug: payload.slug,
    status: payload.status,
    coverMediaId: payload.coverMediaId ?? null,
    eventDate: payload.eventDate,
    eventName: payload.eventName,
    city: payload.city ?? '',
    technologyIds: payload.technologyIds ?? [],
    links: payload.links ?? [],
    publishedAt: payload.publishedAt ?? null,
    fr: { summary: '', ...payload.fr },
    en: payload.en ? { summary: '', ...payload.en } : null,
  }
}

export default class TalksController {
  async index({ inertia }: HttpContext) {
    const talks = await Talk.query()
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title')
      )
      .orderBy('event_date', 'desc')

    return inertia.render('admin/talks/index', {
      talks: talks.map((talk) => ({
        id: talk.id,
        slug: talk.slug,
        title: talk.translation('fr')?.title ?? talk.slug,
        hasEnglish: talk.translation('en') !== undefined,
        status: talk.status,
        eventName: talk.eventName,
        eventDate: talk.eventDate.toISODate(),
        city: talk.city,
        upcoming: talk.isUpcoming,
        publishedAt: talk.publishedAt?.toISODate() ?? null,
        scheduled: !talk.isPublished && talk.status === 'published',
      })),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/talks/form', {
      talk: null,
      options: await formOptions(),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(talkValidator, { meta: {} })

    const talk = await TalkService.save(new Talk(), payloadFromRequest(payload))

    session.flash('success', 'Intervention enregistrée')
    response.redirect().toRoute('admin.talks.edit', { id: talk.id })
  }

  async edit({ params, inertia }: HttpContext) {
    const talk = await Talk.query()
      .where('id', params.id)
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies', (technologies) => technologies.select('id'))
      .firstOrFail()

    const fr = talk.translation('fr')
    const en = talk.translation('en')

    return inertia.render('admin/talks/form', {
      talk: {
        id: talk.id,
        slug: talk.slug,
        status: talk.status,
        coverMediaId: talk.coverMediaId,
        eventDate: talk.eventDate.toISODate(),
        eventName: talk.eventName,
        city: talk.city,
        technologyIds: talk.technologies.map((technology) => technology.id),
        links: talk.links.map((link) => ({
          label: link.label,
          url: link.url,
          type: link.type,
        })),
        publishedAt: talk.publishedAt?.toISO({ includeOffset: false })?.slice(0, 16) ?? null,
        hasBeenOnline: talk.hasBeenOnline,
        fr: {
          title: fr?.title ?? '',
          summary: fr?.summary ?? '',
          contentMarkdown: fr?.contentMarkdown ?? '',
        },
        en: en
          ? { title: en.title, summary: en.summary, contentMarkdown: en.contentMarkdown }
          : null,
      },
      options: await formOptions(),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const talk = await Talk.findOrFail(params.id)
    const payload = await request.validateUsing(talkValidator, {
      meta: { id: talk.id, currentSlug: talk.slug, wasOnline: talk.hasBeenOnline },
    })

    await TalkService.save(talk, payloadFromRequest(payload))

    session.flash('success', 'Intervention enregistrée')
    response.redirect().toRoute('admin.talks.edit', { id: talk.id })
  }

  async destroy({ params, response, session }: HttpContext) {
    const talk = await Talk.findOrFail(params.id)
    await talk.delete()

    session.flash('success', 'Intervention supprimée')
    response.redirect().toRoute('admin.talks.index')
  }
}
