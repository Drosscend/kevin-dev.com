import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { longDate } from '#app/shared/date_format'
import { mediaUrl } from '#app/shared/media_url'
import { previewOrFail } from '#app/shared/publication_response'
import SeoService from '#app/shared/seo_service'
import TalkDetailTransformer from '#app/talks/transformers/talk_detail_transformer'
import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import { visibilityOf } from '#shared/content/publication'
import { TalkDetailQuery } from '#talks/queries/talk_detail_query'
import { localePath, toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TalkController {
  constructor(private readonly talkDetail: TalkDetailQuery) {}

  async render({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = toLocale(i18n.locale)

    if (params.slug.endsWith('.md')) {
      const markdown = await Llms.talkMarkdown(params.slug.slice(0, -3), locale)

      if (!markdown) {
        return response.notFound('Not found')
      }

      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const talk = await this.talkDetail.execute(params.slug, locale)

    if (!talk) {
      throw new Exception('Not found', { status: 404 })
    }

    const preview = previewOrFail(visibilityOf(talk, Boolean(auth.user)))

    return inertia.render('talks/show', {
      preview,
      talk: TalkDetailTransformer.transform({
        title: talk.title,
        contentHtml: talk.contentHtml,
        coverUrl: mediaUrl(talk.cover),
        eventName: talk.eventName,
        eventDate: longDate(talk.eventDate, locale),
        city: talk.city,
        readingTimeLabel: i18n.t('messages.blog.readingTime', { minutes: talk.readingTime }),
        upcoming: talk.upcoming,
        links: talk.links,
        technologies: talk.technologies,
      }),
      hasOtherLocale: talk.hasOtherLocale,
      labels: {
        backToList: i18n.t('messages.talks.backToList'),
        draft: i18n.t('messages.blog.draft'),
        archived: i18n.t('messages.blog.archived'),
        upcoming: i18n.t('messages.talks.upcoming'),
        technologies: i18n.t('messages.talks.technologies'),
      },
      meta: SeoService.build({
        title: talk.title,
        description: talk.summary || i18n.t('messages.talks.metaDescription'),
        locale,
        path: localePath(locale, `/talks/${talk.slug}`),
        alternates: talk.hasEnglish
          ? { fr: `/talks/${talk.slug}`, en: `/en/talks/${talk.slug}` }
          : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(talk.cover),
        jsonLd: [
          SeoService.breadcrumbs([
            { name: i18n.t('messages.talks.title'), path: localePath(locale, '/talks') },
            { name: talk.title, path: localePath(locale, `/talks/${talk.slug}`) },
          ]),
        ],
      }),
    })
  }
}
