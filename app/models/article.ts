import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ArticleSchema } from '#database/schema'
import ArticleTranslation from '#models/article_translation'
import Category from '#models/category'
import Technology from '#models/technology'
import Media from '#models/media'
import { withPublication } from '#models/mixins/publishable'
import type { Locale } from '#types/i18n'

export default class Article extends compose(ArticleSchema, withPublication) {
  @hasMany(() => ArticleTranslation)
  declare translations: HasMany<typeof ArticleTranslation>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  @manyToMany(() => Technology, { pivotTable: 'article_technology' })
  declare technologies: ManyToMany<typeof Technology>

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
