import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ProjectTranslationSchema } from '#database/schema'
import Project from '#models/project'
import type { Locale } from '#types/i18n'

export default class ProjectTranslation extends ProjectTranslationSchema {
  declare locale: Locale

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
