import vine from '@vinejs/vine'

/**
 * Admin login validator (first step, email + password).
 */
export const loginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(72),
})

/**
 * Six-digit TOTP code validator (challenge and enrollment).
 */
export const totpCodeValidator = vine.create({
  code: vine
    .string()
    .fixedLength(6)
    .regex(/^\d{6}$/),
})
