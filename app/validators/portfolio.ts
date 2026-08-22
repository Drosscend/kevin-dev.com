import vine from '@vinejs/vine'
import {
  publishedAt,
  relationId,
  slug,
  status,
  translation,
  type EditedRow,
} from '#app/shared/validators'
import { PROJECT_LINK_TYPES, TALK_LINK_TYPES } from '#types/content'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const date = () => vine.string().trim().regex(DATE_PATTERN).nullable().optional()

export const projectValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('projects'),
  status: status(),
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

export const talkValidator = vine.withMetaData<EditedRow>().create({
  slug: slug('talks'),
  status: status(),
  coverMediaId: relationId('media').nullable().optional(),
  eventDate: vine.string().trim().regex(DATE_PATTERN),
  eventName: vine.string().trim().minLength(1).maxLength(200),
  city: vine.string().trim().maxLength(120).optional(),
  technologyIds: vine.array(relationId('technologies')).optional(),
  links: vine
    .array(
      vine.object({
        label: vine.string().trim().minLength(1).maxLength(100),
        url: vine.string().trim().url().maxLength(2048),
        type: vine.enum(TALK_LINK_TYPES),
      })
    )
    .optional(),
  publishedAt: publishedAt(),
  fr: translation(),
  en: translation().optional(),
})
