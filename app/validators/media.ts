import vine from '@vinejs/vine'

/**
 * Validator de l'upload média : le fichier lui-même est validé via
 * request.file() (taille, extension), l'alt est obligatoire (accessibilité).
 */
export const mediaValidator = vine.create({
  alt: vine.string().trim().minLength(3).maxLength(255),
})
