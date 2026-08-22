import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { TechnologySchema } from '#database/schema'
import Media from '#media/models/media'
import Article from '#models/article'
import Project from '#models/project'
import Talk from '#models/talk'
import TechnologyTranslation from '#models/technology_translation'
import type { TechnologyCategory } from '#types/content'
import type { Locale } from '#types/i18n'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

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

  @manyToMany(() => Talk, { pivotTable: 'talk_technology' })
  declare talks: ManyToMany<typeof Talk>

  description(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)?.description ?? ''
  }
}
