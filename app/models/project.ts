import { DateTime } from 'luxon'
import { belongsTo, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ProjectSchema } from '#database/schema'
import ProjectTranslation from '#models/project_translation'
import ProjectLink from '#models/project_link'
import Media from '#models/media'
import Technology from '#models/technology'
import Article from '#models/article'
import type { Locale } from '#types/i18n'

export type ProjectStatus = 'draft' | 'published'

export default class Project extends ProjectSchema {
  declare status: ProjectStatus

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

  translation(locale: Locale) {
    return this.translations.find((item) => item.locale === locale)
  }
}
