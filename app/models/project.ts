import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ProjectSchema } from '#database/schema'
import ProjectTranslation from '#models/project_translation'
import ProjectLink from '#models/project_link'
import Media from '#models/media'
import Technology from '#models/technology'
import Article from '#models/article'
import { withPublication } from '#models/mixins/publishable'
import type { Locale } from '#types/i18n'

export default class Project extends compose(ProjectSchema, withPublication) {
  @hasMany(() => ProjectTranslation)
  declare translations: HasMany<typeof ProjectTranslation>

  @hasMany(() => ProjectLink)
  declare links: HasMany<typeof ProjectLink>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  @manyToMany(() => Technology, { pivotTable: 'project_technology' })
  declare technologies: ManyToMany<typeof Technology>

  @manyToMany(() => Article, { pivotTable: 'article_project' })
  declare articles: ManyToMany<typeof Article>

  /** A started project with no end date yet is still running. */
  get isOngoing() {
    return this.startedAt !== null && this.endedAt === null
  }

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
