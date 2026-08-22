import { inject } from '@adonisjs/core'
import { longDate } from '#app/shared/date_format'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { TalkListQuery } from '#talks/queries/talk_list_query'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TalkListController {
  constructor(private readonly talkList: TalkListQuery) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const talks = await this.talkList.execute(locale)

    return inertia.render('talks/index', {
      talks: talks.map((talk) => ({
        slug: talk.slug,
        title: talk.title,
        summary: talk.summary,
        eventName: talk.eventName,
        eventDate: longDate(talk.eventDate, locale),
        city: talk.city,
        readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: talk.readingTime }),
        upcoming: talk.upcoming,
        links: talk.links,
        technologies: talk.technologies,
        coverUrl: mediaUrl(talk.cover),
      })),
      labels: {
        title: i18n.t('messages.talks.title'),
        empty: i18n.t('messages.talks.empty'),
        upcoming: i18n.t('messages.talks.upcoming'),
      },
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
