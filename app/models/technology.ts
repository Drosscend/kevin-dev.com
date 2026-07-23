import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { TechnologySchema } from '#database/schema'
import TechnologyTranslation from '#models/technology_translation'
import Media from '#models/media'
import Project from '#models/project'
import Article from '#models/article'
import type { Locale } from '#types/i18n'

export const TECHNOLOGY_CATEGORIES = ['langage', 'framework', 'outil', 'infra'] as const
export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number]

export default class Technology extends TechnologySchema {
  declare category: TechnologyCategory

  @hasMany(() => TechnologyTranslation)
  declare translations: HasMany<typeof TechnologyTranslation>

  @belongsTo(() => Media, { foreignKey: 'logoMediaId' })
  declare logo: BelongsTo<typeof Media>

  @manyToMany(() => Project, { pivotTable: 'project_technology' })
  declare projects: ManyToMany<typeof Project>

  @manyToMany(() => Article, { pivotTable: 'article_technology' })
  declare articles: ManyToMany<typeof Article>

  description(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)?.description ?? ''
  }
}
