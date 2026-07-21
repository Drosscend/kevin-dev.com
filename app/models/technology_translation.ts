import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TechnologyTranslationSchema } from '#database/schema'
import Technology from '#models/technology'
import type { Locale } from '#types/i18n'

export default class TechnologyTranslation extends TechnologyTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Technology)
  declare technology: BelongsTo<typeof Technology>
}
