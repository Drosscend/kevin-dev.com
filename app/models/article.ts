import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ArticleSchema } from '#database/schema'
import ArticleTranslation from '#models/article_translation'
import Category from '#models/category'
import Tag from '#models/tag'
import type { Locale } from '#types/i18n'

export type ArticleStatus = 'draft' | 'published'

export default class Article extends ArticleSchema {
  declare status: ArticleStatus

  @hasMany(() => ArticleTranslation)
  declare translations: HasMany<typeof ArticleTranslation>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @manyToMany(() => Tag, { pivotTable: 'article_tag' })
  declare tags: ManyToMany<typeof Tag>

  get isPublished() {
    return this.status === 'published'
  }

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
