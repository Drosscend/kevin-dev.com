import { inject } from '@adonisjs/core'
import { longDate } from '#services/date_format'
import { TalkAdminListQuery } from '#talks/queries/talk_admin_list_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ManageTalksController {
  constructor(private readonly talkAdminList: TalkAdminListQuery) {}

  async render({ inertia }: HttpContext) {
    const talks = await this.talkAdminList.execute()

    return inertia.render('admin/talks/index', {
      talks: talks.map((talk) => ({
        id: talk.id,
        slug: talk.slug,
        title: talk.title,
        hasEnglish: talk.hasEnglish,
        status: talk.status,
        eventName: talk.eventName,
        eventDate: longDate(talk.eventDate),
        city: talk.city,
        upcoming: talk.upcoming,
        publishedAt: longDate(talk.publishedAt),
        scheduled: talk.scheduled,
      })),
    })
  }
}
