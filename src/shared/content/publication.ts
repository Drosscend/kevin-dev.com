import type { PreviewMode } from '#types/content'

interface PublishableEntry {
  status: string
  isPublished: boolean
}

export type ContentVisibility = 'public' | 'gone' | 'not_found' | PreviewMode

/**
 * What a visitor is allowed to see of an entry that is not publicly
 * visible. A signed-in author reads it as a preview; anybody else gets
 * "gone" when it was withdrawn from the site and "not found" otherwise,
 * since a withdrawn URL used to exist while a draft never did.
 */
export function visibilityOf(entry: PublishableEntry, signedIn: boolean): ContentVisibility {
  if (entry.isPublished) {
    return 'public'
  }

  if (!signedIn) {
    return entry.status === 'archived' ? 'gone' : 'not_found'
  }

  return entry.status === 'archived' ? 'archived' : 'draft'
}
