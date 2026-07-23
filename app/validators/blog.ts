import vine from '@vinejs/vine'
import {
  publishedAt,
  relationId,
  slug,
  status,
  translation,
  type EditedRow,
} from '#validators/shared'

export const articleValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('articles'),
  status: status(),
  categoryId: relationId('categories').nullable().optional(),
  coverMediaId: relationId('media').nullable().optional(),
  technologyIds: vine.array(relationId('technologies')).optional(),
  publishedAt: publishedAt(),
  fr: translation(),
  en: translation().optional(),
})

export const categoryValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('categories'),
  nameFr: vine.string().trim().minLength(1).maxLength(255),
  nameEn: vine.string().trim().maxLength(255).optional(),
})
