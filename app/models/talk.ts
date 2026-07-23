import { DateTime } from 'luxon'
import { belongsTo, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { TalkSchema } from '#database/schema'
import TalkTranslation from '#models/talk_translation'
import TalkLink from '#models/talk_link'
import Media from '#models/media'
import Technology from '#models/technology'
import type { Locale } from '#types/i18n'

export type TalkStatus = 'draft' | 'published' | 'archived'

export default class Talk extends TalkSchema {
  declare status: TalkStatus

  @hasMany(() => TalkTranslation)
  declare translations: HasMany<typeof TalkTranslation>

  @hasMany(() => TalkLink)
  declare links: HasMany<typeof TalkLink>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  @manyToMany(() => Technology, { pivotTable: 'talk_technology' })
  declare technologies: ManyToMany<typeof Technology>

  /**
   * Publicly visible entries: published status AND publication date
   * reached. A future date means the entry is scheduled.
   */
  static published = scope((query) => {
    query.where('status', 'published').where((inner) => {
      inner.whereNull('published_at').orWhere('published_at', '<=', DateTime.now().toSQL())
    })
  })

  get isPublished() {
    return (
      this.status === 'published' &&
      (this.publishedAt === null || this.publishedAt <= DateTime.now())
    )
  }

  /**
   * True once the URL has actually been reachable. Two rules derive
   * from it: the slug is frozen so an already shared link cannot
   * break, and the entry can no longer go back to draft, only be
   * archived. A scheduled entry has not been online yet.
   */
  get hasBeenOnline() {
    return Boolean(this.publishedAt) && this.publishedAt! <= DateTime.now()
  }

  /** True while the talk has not been given yet. */
  get isUpcoming() {
    return this.eventDate > DateTime.now().startOf('day')
  }

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
