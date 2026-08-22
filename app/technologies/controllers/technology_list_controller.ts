import { inject } from '@adonisjs/core'
import { mediaUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import TechnologyCardTransformer from '#app/technologies/transformers/technology_card_transformer'
import { TechnologyListQuery } from '#technologies/queries/technology_list_query'
import { localePath, toLocale } from '#types/i18n'
import type { TechnologyListItem } from '#technologies/queries/technology_list_query'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Usage line of an index card: the published counts on both sides of
 * the taxonomy, zeros omitted rather than spelled out.
 */
function usageLabel(technology: TechnologyListItem, i18n: HttpContext['i18n']) {
  const counts = [
    ['projectsCount', technology.projectsCount],
    ['articlesCount', technology.articlesCount],
    ['talksCount', technology.talksCount],
  ] as const

  const parts = counts
    .filter(([, count]) => count > 0)
    .map(([key, count]) => i18n.t(`messages.technologies.${key}`, { count }))

  return parts.length > 0 ? parts.join(' · ') : i18n.t('messages.technologies.unused')
}

@inject()
export default class TechnologyListController {
  constructor(private readonly technologyList: TechnologyListQuery) {}

  async render({ inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)
    const technologies = await this.technologyList.execute(locale)

    return inertia.render('technologies/index', {
      technologies: TechnologyCardTransformer.transform(
        technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
          category: technology.category,
          logoUrl: mediaUrl(technology.logo, 320),
          docsUrl: technology.docsUrl,
          description: technology.description,
          usageLabel: usageLabel(technology, i18n),
        }))
      ),
      labels: {
        title: i18n.t('messages.technologies.title'),
        empty: i18n.t('messages.technologies.empty'),
        docs: i18n.t('messages.technologies.docs'),
        categories: {
          langage: i18n.t('messages.technologies.categories.langage'),
          framework: i18n.t('messages.technologies.categories.framework'),
          outil: i18n.t('messages.technologies.categories.outil'),
          infra: i18n.t('messages.technologies.categories.infra'),
        },
      },
      meta: SeoService.build({
        title: i18n.t('messages.technologies.title'),
        description: i18n.t('messages.technologies.metaDescription'),
        locale,
        path: localePath(locale, '/technologies'),
        alternates: { fr: '/technologies', en: '/en/technologies' },
      }),
    })
  }
}
