import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TalkTranslationSchema } from '#database/schema'
import Talk from '#models/talk'
import type { Locale } from '#types/i18n'

export default class TalkTranslation extends TalkTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Talk)
  declare talk: BelongsTo<typeof Talk>
}
