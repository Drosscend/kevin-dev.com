import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { errors as vineErrors } from '@vinejs/vine'
import Media from '#models/media'
import MediaService, { InvalidImageError } from '#services/media_service'
import { mediaValidator } from '#validators/media'

export default class MediaController {
  async index({ inertia }: HttpContext) {
    const media = await Media.query().orderBy('created_at', 'desc')

    return inertia.render('admin/media', {
      media: media.map((item) => ({
        id: item.id,
        alt: item.alt,
        originalName: item.originalName,
        width: item.width,
        height: item.height,
        size: item.size,
        url: router.makeUrl('uploads.show', { key: item.key, file: 'original.webp' }),
        thumbnailUrl: router.makeUrl('uploads.show', {
          key: item.key,
          file: item.variants.find((variant) => variant.width === 320)?.file ?? 'original.webp',
        }),
        createdAt: item.createdAt.toISO(),
      })),
    })
  }

  async store({ request, session, response }: HttpContext) {
    const file = request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    })

    if (!file || !file.isValid) {
      session.flash('errors', {
        file: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    const { alt } = await request.validateUsing(mediaValidator)

    try {
      await MediaService.store(file, alt)
    } catch (error) {
      if (!(error instanceof InvalidImageError)) {
        throw error
      }
      session.flash('errors', { file: ["Le fichier n'est pas une image valide"] })
      return response.redirect().back()
    }

    session.flash('success', 'Image ajoutée à la bibliothèque')
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
    await MediaService.delete(media)

    session.flash('success', 'Image supprimée')
    response.redirect().toRoute('admin.media.index')
  }
}
