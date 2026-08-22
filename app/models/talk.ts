import { compose } from '@adonisjs/core/helpers'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { TalkSchema } from '#database/schema'
import Media from '#media/models/media'
import { withPublication } from '#models/mixins/publishable'
import TalkLink from '#models/talk_link'
import TalkTranslation from '#models/talk_translation'
import Technology from '#models/technology'
import type { Locale } from '#types/i18n'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

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
