import vine from '@vinejs/vine'

/**
 * Admin login validator (first step, email + password).
 */
export const loginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(72),
})

/**
 * Six-digit TOTP code validator (enrollment, disabling, recovery-code
 * regeneration).
 */
export const totpCodeValidator = vine.create({
  code: vine
    .string()
    .fixedLength(6)
    .regex(/^\d{6}$/),
})

/**
 * Login challenge code: either a six-digit TOTP code or an
 * XXXXX-XXXXX one-time recovery code.
 */
export const challengeCodeValidator = vine.create({
  code: vine.string().trim().minLength(6).maxLength(11),
})
