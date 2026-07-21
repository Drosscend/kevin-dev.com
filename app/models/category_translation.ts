import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { CategoryTranslationSchema } from '#database/schema'
import Category from '#models/category'
import type { Locale } from '#types/i18n'

export default class CategoryTranslation extends CategoryTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
