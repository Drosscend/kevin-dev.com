import { inject } from '@adonisjs/core'
import { longDate } from '#app/shared/date_format'
import { picture } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import TalkCardTransformer from '#app/talks/transformers/talk_card_transformer'
import { TalkListQuery } from '#talks/queries/talk_list_query'
import { localePath, toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TalkListController {
  constructor(private readonly talkList: TalkListQuery) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)
    const talks = await this.talkList.execute(locale)

    return inertia.render('talks/index', {
      talks: TalkCardTransformer.transform(
        talks.map((talk) => ({
          slug: talk.slug,
          title: talk.title,
          summary: talk.summary,
          eventName: talk.eventName,
          eventDate: longDate(talk.eventDate, locale),
          city: talk.city,
          readingTimeLabel: i18n.t('messages.content.readingTime', { minutes: talk.readingTime }),
          upcoming: talk.upcoming,
          links: talk.links,
          technologies: talk.technologies,
          cover: picture(talk.cover),
        }))
      ),
      meta: SeoService.build({
        title: i18n.t('messages.talks.title'),
        description: i18n.t('messages.talks.metaDescription'),
        locale,
        path: localePath(locale, '/talks'),
        alternates: { fr: '/talks', en: '/en/talks' },
        noindex: talks.length === 0,
      }),
    })
  }
}
