import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { picture } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import TechnologyDetailTransformer from '#app/technologies/transformers/technology_detail_transformer'
import { TechnologyDetailQuery } from '#technologies/queries/technology_detail_query'
import { localePath, toLocale } from '#types/i18n'
import type { ContentCard } from '#shared/content/content_card'
import type { HttpContext } from '@adonisjs/core/http'

function card(entry: ContentCard) {
  return {
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    cover: picture(entry.cover),
  }
}

@inject()
export default class TechnologyController {
  constructor(private readonly technologyDetail: TechnologyDetailQuery) {}

  async render({ params, inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)
    const technology = await this.technologyDetail.execute(params.slug, locale)

    if (!technology) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('technologies/show', {
      technology: TechnologyDetailTransformer.transform({
        name: technology.name,
        logo: picture(technology.logo),
        docsUrl: technology.docsUrl,
        description: technology.description,
        projects: technology.projects.map(card),
        articles: technology.articles.map(card),
        talks: technology.talks.map(card),
      }),
      meta: SeoService.build({
        title: technology.name,
        description: technology.description || i18n.t('messages.technologies.metaDescription'),
        locale,
        path: localePath(locale, `/technologies/${technology.slug}`),
        alternates: {
          fr: `/technologies/${technology.slug}`,
          en: `/en/technologies/${technology.slug}`,
        },
        // One thin page per technology dilutes the site in search
        // results: the pages stay for navigation, out of the index.
        noindex: true,
        jsonLd: [
          SeoService.breadcrumbs([
            {
              name: i18n.t('messages.technologies.title'),
              path: localePath(locale, '/technologies'),
            },
            {
              name: technology.name,
              path: localePath(locale, `/technologies/${technology.slug}`),
            },
          ]),
        ],
      }),
    })
  }
}
