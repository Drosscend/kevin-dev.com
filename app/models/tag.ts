import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { TagSchema } from '#database/schema'
import TagTranslation from '#models/tag_translation'
import Article from '#models/article'
import type { Locale } from '#types/i18n'

export default class Tag extends TagSchema {
  @hasMany(() => TagTranslation)
  declare translations: HasMany<typeof TagTranslation>

  @manyToMany(() => Article, { pivotTable: 'article_tag' })
  declare articles: ManyToMany<typeof Article>

  name(locale: Locale) {
    return (
      this.translations.find((item) => item.locale === locale)?.name ??
      this.translations[0]?.name ??
      this.slug
    )
  }
}
