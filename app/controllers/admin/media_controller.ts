import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { errors as vineErrors } from '@vinejs/vine'
import Media from '#models/media'
import MediaService, { InvalidDocumentError, InvalidImageError } from '#services/media_service'
import SeoService from '#services/seo_service'
import { mediaValidator } from '#validators/media'

/**
 * Maximum accepted upload size: request.file() enforces the largest
 * one, images are then checked against their own, smaller limit.
 */
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024
const DOCUMENT_SIZE_LIMIT = '50mb'

export default class MediaController {
  async index({ inertia }: HttpContext) {
    const media = await Media.query().orderBy('created_at', 'desc')

    return inertia.render('admin/media', {
      media: media.map((item) => {
        const url = MediaService.url(item, 1280)!

        return {
          id: item.id,
          alt: item.alt,
          originalName: item.originalName,
          isDocument: item.isDocument,
          width: item.width,
          height: item.height,
          size: item.size,
          url,
          /**
           * Absolute so it can be pasted straight into a project link,
           * whose validator requires a full URL.
           */
          absoluteUrl: SeoService.absolute(url),
          thumbnailUrl: item.isDocument
            ? null
            : router.makeUrl('uploads.show', {
                key: item.key,
                file:
                  item.variants.find((variant) => variant.width === 320)?.file ?? 'original.webp',
              }),
          createdAt: item.createdAt.toISO(),
        }
      }),
    })
  }

  async store({ request, session, response }: HttpContext) {
    const file = request.file('file', {
      size: DOCUMENT_SIZE_LIMIT,
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'pdf'],
    })

    if (!file || !file.isValid) {
      session.flash('errors', {
        file: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    const isDocument = file.extname === 'pdf'
    if (!isDocument && file.size > IMAGE_SIZE_LIMIT) {
      session.flash('errors', { file: ['Une image ne peut pas dépasser 10 Mo'] })
      return response.redirect().back()
    }

    const { alt } = await request.validateUsing(mediaValidator)

    try {
      await (isDocument ? MediaService.storeDocument(file, alt) : MediaService.store(file, alt))
    } catch (error) {
      if (error instanceof InvalidDocumentError) {
        session.flash('errors', { file: ["Le fichier n'est pas un PDF valide"] })
        return response.redirect().back()
      }
      if (!(error instanceof InvalidImageError)) {
        throw error
      }
      session.flash('errors', { file: ["Le fichier n'est pas une image valide"] })
      return response.redirect().back()
    }

    session.flash('success', isDocument ? 'Document ajouté' : 'Image ajoutée à la bibliothèque')
    response.redirect().toRoute('admin.media.index')
  }

  /**
   * JSON variant of store used by the markdown editor inline upload:
   * same pipeline (multipart file + alt), but responds with the media
   * public URL instead of redirecting, and reports failures as a 422
   * payload of field errors.
   */
  async upload({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    })

    if (!file || !file.isValid) {
      return response.unprocessableEntity({
        errors: { file: file?.errors.map((error) => error.message) ?? ['Fichier requis'] },
      })
    }

    let alt: string
    try {
      const payload = await request.validateUsing(mediaValidator)
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

    let media: Media
    try {
      media = await MediaService.store(file, alt)
    } catch (error) {
      if (!(error instanceof InvalidImageError)) {
        throw error
      }
      return response.unprocessableEntity({
        errors: { file: ["Le fichier n'est pas une image valide"] },
      })
    }

    return response.created({
      id: media.id,
      alt: media.alt,
      url: router.makeUrl('uploads.show', { key: media.key, file: 'original.webp' }),
    })
  }

  async destroy({ params, session, response }: HttpContext) {
    const media = await Media.findOrFail(params.id)
    const isDocument = media.isDocument
    await MediaService.delete(media)

    session.flash('success', isDocument ? 'Document supprimé' : 'Image supprimée')
    response.redirect().toRoute('admin.media.index')
  }
}
