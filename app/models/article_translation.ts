import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ArticleTranslationSchema } from '#database/schema'
import Article from '#models/article'
import type { Locale } from '#types/i18n'

export default class ArticleTranslation extends ArticleTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Article)
  declare article: BelongsTo<typeof Article>
}
