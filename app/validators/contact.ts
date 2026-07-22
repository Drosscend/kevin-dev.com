import vine from '@vinejs/vine'

export const contactValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100),
  email: vine.string().trim().email().maxLength(254),
  message: vine.string().trim().minLength(10).maxLength(5000),
})

/**
 * Admin editor for settings-backed pages (CV and legal notice).
 */
export const pagesValidator = vine.create({
  cvFr: vine.string().optional(),
  cvEn: vine.string().optional(),
  legalFr: vine.string().optional(),
  legalEn: vine.string().optional(),
  nowFr: vine.string().optional(),
  nowEn: vine.string().optional(),
})
