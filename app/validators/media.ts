import vine from '@vinejs/vine'

/**
 * Media upload validator: the file itself is validated through
 * request.file() (size, extension); alt text is required for
 * accessibility.
 */
export const mediaValidator = vine.create({
  alt: vine.string().trim().minLength(3).maxLength(255),
})
