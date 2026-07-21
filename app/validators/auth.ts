import vine from '@vinejs/vine'

/**
 * Validator du login admin (première étape, email + mot de passe).
 */
export const loginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(72),
})

/**
 * Validator d'un code TOTP à 6 chiffres (challenge et enrôlement).
 */
export const totpCodeValidator = vine.create({
  code: vine
    .string()
    .fixedLength(6)
    .regex(/^\d{6}$/),
})
