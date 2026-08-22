import { compose } from '@adonisjs/core/helpers'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { ArticleSchema } from '#database/schema'
import Media from '#media/models/media'
import ArticleTranslation from '#models/article_translation'
import Category from '#models/category'
import { withPublication } from '#models/mixins/publishable'
import Technology from '#models/technology'
import type { Locale } from '#types/i18n'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

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
