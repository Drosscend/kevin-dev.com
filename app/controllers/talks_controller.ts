import { Exception } from '@adonisjs/core/exceptions'
import { mediaUrl } from '#app/shared/media_url'
import { previewOrFail } from '#app/shared/publication_response'
import Talk from '#models/talk'
import { longDate } from '#services/date_format'
import LlmsService, { MARKDOWN_CONTENT_TYPE } from '#services/llms_service'
import SeoService from '#services/seo_service'
import { visibilityOf } from '#shared/content/publication'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

export default class TalksController {
  async index({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const talks = await Talk.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .preload('cover')
      .orderBy('event_date', 'desc')

    return inertia.render('talks/index', {
      talks: talks.map((talk) => {
        const translation = talk.translation(locale)!
        return {
          slug: talk.slug,
          title: translation.title,
          summary: translation.summary,
          eventName: talk.eventName,
          eventDate: longDate(talk.eventDate, locale),
          city: talk.city,
          readingTimeLabel: i18n.t('messages.blog.readingTime', {
            minutes: talk.readingTime,
          }),
          upcoming: talk.isUpcoming,
          links: talk.links.map((link) => ({
            label: link.label,
            url: link.url,
            type: link.type,
          })),
          technologies: talk.technologies.map((technology) => ({
            slug: technology.slug,
            name: technology.name,
          })),
          coverUrl: mediaUrl(talk.cover),
        }
      }),
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

  async show({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = i18n.locale as Locale

    if (params.slug.endsWith('.md')) {
      const markdown = await LlmsService.talkMarkdown(params.slug.slice(0, -3), locale)
      if (!markdown) {
        return response.notFound('Not found')
      }
      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const talk = await Talk.query()
      .where('slug', params.slug)
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .firstOrFail()

    const translation = talk.translation(locale)
    if (!translation) {
      throw new Exception('Not found', { status: 404 })
    }

    const preview = previewOrFail(visibilityOf(talk, Boolean(auth.user)))

    return inertia.render('talks/show', {
      preview,
      talk: {
        title: translation.title,
        contentHtml: translation.contentHtml,
        coverUrl: mediaUrl(talk.cover),
        eventName: talk.eventName,
        eventDate: longDate(talk.eventDate, locale),
        city: talk.city,
        readingTimeLabel: i18n.t('messages.blog.readingTime', {
          minutes: talk.readingTime,
        }),
        upcoming: talk.isUpcoming,
        links: talk.links.map((link) => ({
          label: link.label,
          url: link.url,
          type: link.type,
        })),
        technologies: talk.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
      },
      hasOtherLocale: talk.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      labels: {
        backToList: i18n.t('messages.talks.backToList'),
        draft: i18n.t('messages.blog.draft'),
        archived: i18n.t('messages.blog.archived'),
        upcoming: i18n.t('messages.talks.upcoming'),
        technologies: i18n.t('messages.talks.technologies'),
      },
      meta: SeoService.build({
        title: translation.title,
        description: translation.summary || i18n.t('messages.talks.metaDescription'),
        locale,
        path: localePath(locale, `/talks/${talk.slug}`),
        alternates:
          talk.translation('en') !== undefined
            ? { fr: `/talks/${talk.slug}`, en: `/en/talks/${talk.slug}` }
            : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(talk.cover),
        jsonLd: [
          SeoService.breadcrumbs([
            { name: i18n.t('messages.talks.title'), path: localePath(locale, '/talks') },
            { name: translation.title, path: localePath(locale, `/talks/${talk.slug}`) },
          ]),
        ],
      }),
    })
  }
}
