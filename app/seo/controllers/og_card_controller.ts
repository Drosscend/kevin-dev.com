import { inject } from '@adonisjs/core'
import { ogCardPng } from '#app/seo/og_card'
import { OgCardQuery, toOgCardType, type OgCardType } from '#seo/queries/og_card_query'
import { toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

const SLUG_PATTERN = /^[a-z0-9-]{1,120}\.png$/
/** Section names double as the card kicker, so no label of its own is needed. */
const KICKER_KEY = {
  blog: 'messages.nav.blog',
  projects: 'messages.nav.projects',
  talks: 'messages.nav.talks',
} satisfies Record<OgCardType, string>

@inject()
export default class OgCardController {
  constructor(private readonly ogCard: OgCardQuery) {}

  async execute({ params, response, i18n }: HttpContext) {
    const type = toOgCardType(params.type)

    if (!type || !SLUG_PATTERN.test(params.slug)) {
      return response.notFound('Not found')
    }

    const slug = params.slug.slice(0, -4)
    const title = await this.ogCard.execute(type, slug, toLocale(i18n.locale))

    if (!title) {
      return response.notFound('Not found')
    }

    response.header('content-type', 'image/png')
    response.header('cache-control', 'public, max-age=86400')
    return response.send(ogCardPng({ title, kicker: i18n.t(KICKER_KEY[type]) }))
  }
}
