import { DateTime } from 'luxon'
import { scope } from '@adonisjs/lucid/orm'
import type { LucidModel } from '@adonisjs/lucid/types/model'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { PublicationStatus } from '#types/content'

/**
 * Publication rules shared by articles, projects and talks: a status,
 * an optional publication date, and what "online" means from them.
 */
export function withPublication<Model extends NormalizeConstructor<LucidModel>>(superclass: Model) {
  class Publishable extends superclass {
    declare status: PublicationStatus
    declare publishedAt: DateTime | null

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
  }

  return Publishable
}
