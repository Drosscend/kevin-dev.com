import vine from '@vinejs/vine'

/**
 * Admin editor of a settings-backed markdown page (CV, legal notice).
 * Both locales are optional: leaving one empty removes it.
 */
export const markdownPageValidator = vine.create({
  fr: vine.string().optional(),
  en: vine.string().optional(),
})
