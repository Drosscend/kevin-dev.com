import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TagTranslationSchema } from '#database/schema'
import Tag from '#models/tag'
import type { Locale } from '#types/i18n'

export default class TagTranslation extends TagTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Tag)
  declare tag: BelongsTo<typeof Tag>
}
