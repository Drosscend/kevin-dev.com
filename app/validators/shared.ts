import vine from '@vinejs/vine'

/**
 * Metadata carried by every validator using the shared slug rule:
 * the id of the row being edited, so it is excluded from the
 * uniqueness lookup (absent when creating).
 */
export type EditedRow = { id?: number }

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
