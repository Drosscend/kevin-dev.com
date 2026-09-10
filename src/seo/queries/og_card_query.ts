import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import Project from '#portfolio/models/project'
import Talk from '#talks/models/talk'
import type { Locale } from '#types/i18n'

/** URL segment of each section that owns shareable entries. */
export const OG_CARD_TYPES = ['blog', 'projects', 'talks'] as const
export type OgCardType = (typeof OG_CARD_TYPES)[number]

export function toOgCardType(value: string): OgCardType | null {
  return OG_CARD_TYPES.find((type) => type === value) ?? null
}

function findEntry(type: OgCardType, slug: string) {
  if (type === 'blog') {
    return Article.query()
      .withScopes((scopes) => scopes.published())
      .where('slug', slug)
      .preload('translations')
      .first()
  }

  if (type === 'projects') {
    return Project.query()
      .withScopes((scopes) => scopes.published())
      .where('slug', slug)
      .preload('translations')
      .first()
  }

  return Talk.query()
    .withScopes((scopes) => scopes.published())
    .where('slug', slug)
    .preload('translations')
    .first()
}

/**
 * Title of a published entry, in the requested locale. The social
 * card is drawn from it, so an entry that is not online, or has no
 * translation for that locale, has no card either.
 */
@inject()
export class OgCardQuery {
  async execute(type: OgCardType, slug: string, locale: Locale): Promise<string | null> {
    const entry = await findEntry(type, slug)

    return entry?.translation(locale)?.title ?? null
  }
}
