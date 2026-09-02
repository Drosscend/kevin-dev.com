import { inject } from '@adonisjs/core'
import router from '@adonisjs/core/services/router'
import vine, { errors as vineErrors } from '@vinejs/vine'
import { discardUpload } from '#app/shared/discard_upload'
import { StoreImage } from '#media/actions/store_image'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * JSON variant of the library upload, used by the markdown editor:
 * same pipeline (multipart file + alt), but responds with the media
 * public URL instead of redirecting, and reports failures as a 422
 * payload of field errors.
 */
@inject()
export default class UploadImageController {
  static readonly validator = vine.create({
    alt: vine.string().trim().minLength(3).maxLength(255),
  })

  constructor(private readonly storeImage: StoreImage) {}

  async execute({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    })

    if (!file || !file.isValid) {
      return response.unprocessableEntity({
        errors: { file: file?.errors.map((error) => error.message) ?? ['Fichier requis'] },
      })
    }

    let result
    try {
      let alt: string
      try {
        const payload = await request.validateUsing(UploadImageController.validator)
        alt = payload.alt
      } catch (error) {
        if (!(error instanceof vineErrors.E_VALIDATION_ERROR)) {
          throw error
        }

        const fieldErrors: Record<string, string[]> = {}
        for (const message of error.messages) {
          fieldErrors[message.field] = [...(fieldErrors[message.field] ?? []), message.message]
        }

        return response.unprocessableEntity({ errors: fieldErrors })
      }

      result = await this.storeImage.execute({ file, alt })
    } finally {
      await discardUpload(file)
    }

    if (!result.ok) {
      return response.unprocessableEntity({
        errors: { file: ["Le fichier n'est pas une image valide"] },
      })
    }

    return response.created({
      id: result.value.id,
      alt: result.value.alt,
      url: router.makeUrl('uploads.show', { key: result.value.key, file: 'original.webp' }),
    })
  }
}
