import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { pickerDateTime } from '#app/shared/date_format'
import { variantUrl } from '#app/shared/media_url'
import { publishedAt, relationId, slug, status, translation } from '#app/shared/validators'
import { MediaPickerQuery } from '#media/queries/media_picker_query'
import { SaveTalk } from '#talks/actions/save_talk'
import { TalkFormQuery } from '#talks/queries/talk_form_query'
import { TechnologyOptionsQuery } from '#technologies/queries/technology_options_query'
import { TALK_LINK_TYPES } from '#types/content'
import type { EditedRow } from '#app/shared/validators'
import type { HttpContext } from '@adonisjs/core/http'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

@inject()
export default class TalkFormController {
  static readonly validator = vine.withMetaData<EditedRow>().create({
    slug: slug('talks'),
    status: status(),
    coverMediaId: relationId('media').nullable().optional(),
    eventDate: vine.string().trim().regex(DATE_PATTERN),
    eventName: vine.string().trim().minLength(1).maxLength(150),
    city: vine.string().trim().maxLength(100).optional(),
    technologyIds: vine.array(relationId('technologies')).optional(),
    links: vine
      .array(
        vine.object({
          label: vine.string().trim().minLength(1).maxLength(100),
          url: vine.string().trim().url().maxLength(2048),
          type: vine.enum(TALK_LINK_TYPES),
        })
      )
      .optional(),
    publishedAt: publishedAt(),
    fr: translation(),
    en: translation().optional(),
  })

  constructor(
    private readonly talkForm: TalkFormQuery,
    private readonly saveTalk: SaveTalk,
    private readonly mediaPicker: MediaPickerQuery,
    private readonly technologyOptions: TechnologyOptionsQuery
  ) {}

  async render({ params, inertia, response }: HttpContext) {
    const talk = params.id ? await this.talkForm.execute(params.id) : null

    if (params.id && !talk) {
      return response.notFound()
    }

    return inertia.render('admin/talks/form', {
      talk: talk && {
        ...talk,
        eventDate: talk.eventDate.toISODate(),
        publishedAt: pickerDateTime(talk.publishedAt),
      },
      options: await this.formOptions(),
    })
  }

  async execute({ params, request, response, session }: HttpContext) {
    const current = params.id ? await this.talkForm.execute(params.id) : null

    if (params.id && !current) {
      return response.notFound()
    }

    const payload = await request.validateUsing(TalkFormController.validator, {
      meta: current
        ? { id: current.id, currentSlug: current.slug, wasOnline: current.hasBeenOnline }
        : {},
    })

    const result = await this.saveTalk.execute({
      id: current?.id,
      payload: {
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
      },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Intervention enregistrée')
    return response.redirect().toRoute('admin.talks.edit', { id: result.value.id })
  }

  private async formOptions() {
    const [technologies, media] = await Promise.all([
      this.technologyOptions.execute(),
      this.mediaPicker.execute(),
    ])

    return {
      technologies,
      media: media.map((item) => ({
        id: item.id,
        alt: item.alt,
        originalName: item.originalName,
        thumbnailUrl: variantUrl(item, 320),
      })),
    }
  }
}
