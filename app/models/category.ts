import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { CategorySchema } from '#database/schema'
import CategoryTranslation from '#models/category_translation'
import Article from '#models/article'
import type { Locale } from '#types/i18n'

export default class Category extends CategorySchema {
  @hasMany(() => CategoryTranslation)
  declare translations: HasMany<typeof CategoryTranslation>

  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>

  name(locale: Locale) {
    return (
      this.translations.find((item) => item.locale === locale)?.name ??
      this.translations[0]?.name ??
      this.slug
    )
  }
}
