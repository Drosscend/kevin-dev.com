import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { discardUpload } from '#app/shared/discard_upload'
import { flashFieldErrors } from '#app/shared/field_errors'
import { StoreDocument } from '#media/actions/store_document'
import { StoreImage } from '#media/actions/store_image'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Maximum accepted upload size: request.file() enforces the largest
 * one, images are then checked against their own, smaller limit.
 */
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024
const DOCUMENT_SIZE_LIMIT = '50mb'

@inject()
export default class StoreMediaController {
  static readonly validator = vine.create({
    alt: vine.string().trim().minLength(3).maxLength(255),
  })

  constructor(
    private readonly storeImage: StoreImage,
    private readonly storeDocument: StoreDocument
  ) {}

  async execute({ request, session, response }: HttpContext) {
    const file = request.file('file', {
      size: DOCUMENT_SIZE_LIMIT,
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'pdf'],
    })

    if (!file || !file.isValid) {
      flashFieldErrors(session, {
        file: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    const isDocument = file.extname === 'pdf'

    if (!isDocument && file.size > IMAGE_SIZE_LIMIT) {
      flashFieldErrors(session, { file: ['Une image ne peut pas dépasser 10 Mo'] })
      return response.redirect().back()
    }

    let result
    try {
      const { alt } = await request.validateUsing(StoreMediaController.validator)
      result = isDocument
        ? await this.storeDocument.execute({ file, alt })
        : await this.storeImage.execute({ file, alt })
    } finally {
      await discardUpload(file)
    }

    if (!result.ok) {
      flashFieldErrors(session, {
        file: [
          result.error.type === 'invalid_document'
            ? "Le fichier n'est pas un PDF valide"
            : "Le fichier n'est pas une image valide",
        ],
      })
      return response.redirect().back()
    }

    session.flash('success', isDocument ? 'Document ajouté' : 'Image ajoutée à la bibliothèque')
    return response.redirect().toRoute('admin.media.index')
  }
}
