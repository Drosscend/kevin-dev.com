import { Exception } from '@adonisjs/core/exceptions'

export type PreviewMode = 'draft' | 'archived' | null

type PublishableEntry = { status: string; isPublished: boolean }

/**
 * Decides what happens on an entry that is not publicly visible.
 * A signed-in author reads it as a preview; anybody else gets 410
 * when it was withdrawn from the site and 404 otherwise, since a
 * withdrawn URL used to exist while a draft never did.
 */
export default class PublicationService {
  static preview(entry: PublishableEntry, signedIn: boolean): PreviewMode {
    if (entry.isPublished) {
      return null
    }

    if (!signedIn) {
      throw entry.status === 'archived'
        ? new Exception('Gone', { status: 410 })
        : new Exception('Not found', { status: 404 })
    }

    return entry.status === 'archived' ? 'archived' : 'draft'
  }
}
