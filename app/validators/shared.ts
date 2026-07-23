import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

/**
 * Metadata describing the row being edited: its id, so it is excluded
 * from the uniqueness lookup (absent when creating), its slug and
 * whether its URL has already been reachable, which is what freezes
 * the slug and restricts the reachable statuses.
 */
export type EditedRow = { id?: number; currentSlug?: string; wasOnline?: boolean }

/**
 * Rejects any change to a slug whose URL has already been reachable,
 * so a link published elsewhere can never end up broken.
 */
const frozenSlug = vine.createRule((value: unknown, _options: undefined, field: FieldContext) => {
  const { currentSlug, wasOnline } = field.meta as EditedRow

  if (wasOnline && value !== currentSlug) {
    field.report(
      "Le slug ne peut plus être modifié une fois l'entrée mise en ligne",
      'slug.frozen',
      field
    )
  }
})

/**
 * Slug shared by both locales: lowercase words joined by single
 * dashes, unique across the given table.
 */
export function slug(table: string) {
  return vine
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .maxLength(255)
    .use(frozenSlug())
    .unique(async (db, value, field) => {
      const query = db.from(table).select('id').where('slug', value)

      const editedId = (field.meta as EditedRow).id
      if (editedId) {
        query.whereNot('id', editedId)
      }

      return !(await query.first())
    })
}

/**
 * Rejects the two transitions the admin must never allow: going back
 * to draft once the URL has been public, which would turn a live page
 * into a bare 404, and archiving an entry that was never online.
 */
const publicationTransition = vine.createRule(
  (value: unknown, _options: undefined, field: FieldContext) => {
    const { wasOnline } = field.meta as EditedRow

    if (wasOnline && value === 'draft') {
      field.report(
        'Une entrée déjà en ligne ne peut plus revenir en brouillon, retirez-la du site à la place',
        'status.transition',
        field
      )
    }

    if (!wasOnline && value === 'archived') {
      field.report(
        'Seule une entrée déjà mise en ligne peut être retirée du site',
        'status.transition',
        field
      )
    }
  }
)

/**
 * Publication status, narrowed by what the entry already went
 * through. See the rule above for the two rejected transitions.
 */
export function status() {
  return vine.enum(['draft', 'published', 'archived'] as const).use(publicationTransition())
}

/**
 * Title / summary / Markdown content of a single locale, shared by
 * the article and project validators.
 */
export function translation() {
  return vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    summary: vine.string().trim().maxLength(500).optional(),
    contentMarkdown: vine.string().minLength(1),
  })
}

/**
 * "YYYY-MM-DDTHH:mm" publication date. A future value schedules the
 * entry instead of publishing it right away.
 */
export function publishedAt() {
  return vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .nullable()
    .optional()
}

/**
 * Optional foreign key pointing at an existing row.
 */
export function relationId(table: string) {
  return vine.number().positive().exists({ table, column: 'id' })
}
