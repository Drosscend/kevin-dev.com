import { DateTime } from 'luxon'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { TalkSchema } from '#database/schema'
import TalkTranslation from '#models/talk_translation'
import TalkLink from '#models/talk_link'
import Media from '#models/media'
import Technology from '#models/technology'
import { withPublication } from '#models/mixins/publishable'
import type { Locale } from '#types/i18n'

export default class Talk extends compose(TalkSchema, withPublication) {
  @hasMany(() => TalkTranslation)
  declare translations: HasMany<typeof TalkTranslation>

  @hasMany(() => TalkLink)
  declare links: HasMany<typeof TalkLink>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  @manyToMany(() => Technology, { pivotTable: 'talk_technology' })
  declare technologies: ManyToMany<typeof Technology>

  /** True while the talk has not been given yet. */
  get isUpcoming() {
    return this.eventDate > DateTime.now().startOf('day')
  }

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
