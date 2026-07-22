import vine from '@vinejs/vine'
import { PROJECT_LINK_TYPES } from '#models/project_link'
import { TECHNOLOGY_CATEGORIES } from '#models/technology'

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

export const projectValidator = vine.create({
  slug: slug(),
  status: vine.enum(['draft', 'published'] as const),
  coverMediaId: vine
    .number()
    .positive()
    .exists({ table: 'media', column: 'id' })
    .nullable()
    .optional(),
  startedAt: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  endedAt: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  featured: vine.boolean().optional(),
  technologyIds: vine
    .array(vine.number().positive().exists({ table: 'technologies', column: 'id' }))
    .optional(),
  articleIds: vine
    .array(vine.number().positive().exists({ table: 'articles', column: 'id' }))
    .optional(),
  links: vine
    .array(
      vine.object({
        label: vine.string().trim().minLength(1).maxLength(100),
        url: vine.string().trim().url().maxLength(2048),
        type: vine.enum(PROJECT_LINK_TYPES),
      })
    )
    .optional(),
  fr: translation(),
  en: translation().optional(),
})

export const technologyValidator = vine.create({
  slug: slug(),
  name: vine.string().trim().minLength(1).maxLength(100),
  category: vine.enum(TECHNOLOGY_CATEGORIES),
  logoMediaId: vine
    .number()
    .positive()
    .exists({ table: 'media', column: 'id' })
    .nullable()
    .optional(),
  descriptionFr: vine.string().trim().maxLength(1000).optional(),
  descriptionEn: vine.string().trim().maxLength(1000).optional(),
})
