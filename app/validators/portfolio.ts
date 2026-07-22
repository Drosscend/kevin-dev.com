import vine from '@vinejs/vine'
import { PROJECT_LINK_TYPES } from '#models/project_link'
import { TECHNOLOGY_CATEGORIES } from '#models/technology'
import { publishedAt, relationId, slug, translation, type EditedRow } from '#validators/shared'

const date = () =>
  vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional()

export const projectValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('projects'),
  status: vine.enum(['draft', 'published'] as const),
  coverMediaId: relationId('media').nullable().optional(),
  startedAt: date(),
  endedAt: date(),
  featured: vine.boolean().optional(),
  technologyIds: vine.array(relationId('technologies')).optional(),
  articleIds: vine.array(relationId('articles')).optional(),
  links: vine
    .array(
      vine.object({
        label: vine.string().trim().minLength(1).maxLength(100),
        url: vine.string().trim().url().maxLength(2048),
        type: vine.enum(PROJECT_LINK_TYPES),
      })
    )
    .optional(),
  publishedAt: publishedAt(),
  fr: translation(),
  en: translation().optional(),
})

export const technologyValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('technologies'),
  name: vine.string().trim().minLength(1).maxLength(100),
  category: vine.enum(TECHNOLOGY_CATEGORIES),
  logoMediaId: relationId('media').nullable().optional(),
  descriptionFr: vine.string().trim().maxLength(1000).optional(),
  descriptionEn: vine.string().trim().maxLength(1000).optional(),
})
