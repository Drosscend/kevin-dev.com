import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .maxLength(255)

const translation = () =>
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    summary: vine.string().trim().maxLength(500).optional(),
    contentMarkdown: vine.string().minLength(1),
  })

export const articleValidator = vine.create({
  slug: slug(),
  status: vine.enum(['draft', 'published'] as const),
  categoryId: vine
    .number()
    .positive()
    .exists({ table: 'categories', column: 'id' })
    .nullable()
    .optional(),
  coverMediaId: vine
    .number()
    .positive()
    .exists({ table: 'media', column: 'id' })
    .nullable()
    .optional(),
  tagIds: vine.array(vine.number().positive().exists({ table: 'tags', column: 'id' })).optional(),
  fr: translation(),
  en: translation().optional(),
})

export const previewValidator = vine.create({
  markdown: vine.string(),
})

export const categoryValidator = vine.create({
  slug: slug(),
  nameFr: vine.string().trim().minLength(1).maxLength(255),
  nameEn: vine.string().trim().maxLength(255).optional(),
})

export const tagValidator = vine.create({
  slug: slug(),
  nameFr: vine.string().trim().minLength(1).maxLength(255),
  nameEn: vine.string().trim().maxLength(255).optional(),
})
