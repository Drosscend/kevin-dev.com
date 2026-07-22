import vine from '@vinejs/vine'
import { publishedAt, relationId, slug, translation, type EditedRow } from '#validators/shared'

export const articleValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('articles'),
  status: vine.enum(['draft', 'published'] as const),
  categoryId: relationId('categories').nullable().optional(),
  coverMediaId: relationId('media').nullable().optional(),
  tagIds: vine.array(relationId('tags')).optional(),
  publishedAt: publishedAt(),
  fr: translation(),
  en: translation().optional(),
})

export const previewValidator = vine.create({
  markdown: vine.string(),
})

/**
 * Categories and tags share the same shape: a slug plus an FR name
 * and an optional EN one.
 */
function taxonomyValidator(table: string) {
  return vine.withMetaData<EditedRow>().create({
    slug: slug(table),
    nameFr: vine.string().trim().minLength(1).maxLength(255),
    nameEn: vine.string().trim().maxLength(255).optional(),
  })
}

export const categoryValidator = taxonomyValidator('categories')
export const tagValidator = taxonomyValidator('tags')
