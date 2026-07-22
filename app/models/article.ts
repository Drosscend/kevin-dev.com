import { DateTime } from 'luxon'
import { belongsTo, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ArticleSchema } from '#database/schema'
import ArticleTranslation from '#models/article_translation'
import Category from '#models/category'
import Tag from '#models/tag'
import Media from '#models/media'
import type { Locale } from '#types/i18n'

export type ArticleStatus = 'draft' | 'published'

export default class Article extends ArticleSchema {
  declare status: ArticleStatus

  @hasMany(() => ArticleTranslation)
  declare translations: HasMany<typeof ArticleTranslation>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  @manyToMany(() => Tag, { pivotTable: 'article_tag' })
  declare tags: ManyToMany<typeof Tag>

  /**
   * Publicly visible entries: published status AND publication date
   * reached. A future date means the entry is scheduled.
   */
  static published = scope((query) => {
    query.where('status', 'published').where((inner) => {
      inner.whereNull('published_at').orWhere('published_at', '<=', DateTime.now().toSQL())
    })
  })

  get isPublished() {
    return (
      this.status === 'published' &&
      (this.publishedAt === null || this.publishedAt <= DateTime.now())
    )
  }

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
