import { Exception } from '@adonisjs/core/exceptions'
import type { ContentVisibility } from '#shared/content/publication'
import type { PreviewMode } from '#types/content'

/**
 * Turns the visibility of an entry into the preview banner the page
 * expects, or into the status a visitor deserves.
 */
export function previewOrFail(visibility: ContentVisibility): PreviewMode {
  if (visibility === 'gone') {
    throw new Exception('Gone', { status: 410 })
  }

  if (visibility === 'not_found') {
    throw new Exception('Not found', { status: 404 })
  }

  return visibility === 'public' ? null : visibility
}
