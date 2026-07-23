import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

/**
 * Metadata carried by every validator using the shared slug rule:
 * the id of the row being edited, so it is excluded from the
 * uniqueness lookup (absent when creating), and the current slug when
 * it is frozen because the entry has already been online.
 */
export type EditedRow = { id?: number; lockedSlug?: string }

/**
 * Rejects any change to a slug whose URL has already been reachable,
 * so a link published elsewhere can never end up broken.
 */
const frozenSlug = vine.createRule((value: unknown, _options: undefined, field: FieldContext) => {
  const { lockedSlug } = field.meta as EditedRow

  if (lockedSlug && value !== lockedSlug) {
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
