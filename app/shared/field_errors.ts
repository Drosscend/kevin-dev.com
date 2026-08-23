import type { HttpContext } from '@adonisjs/core/http'

/**
 * Flashes errors under the key the Inertia middleware reads, the same
 * one VineJS failures land in, so a controller can reject a field
 * after validation and still see the message on the form.
 */
export function flashFieldErrors(
  session: HttpContext['session'],
  errors: Record<string, string[]>
) {
  session.flash('inputErrorsBag', errors)
}
