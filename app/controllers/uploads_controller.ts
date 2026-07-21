import { existsSync } from 'node:fs'
import type { HttpContext } from '@adonisjs/core/http'
import MediaService from '#services/media_service'

/**
 * Sert les fichiers de la bibliothèque média depuis storage/media.
 * Les deux segments sont validés strictement : aucun path traversal
 * possible, seuls les fichiers générés par MediaService sont servis.
 */
const KEY_PATTERN = /^[a-z0-9]{10,32}$/
const FILE_PATTERN = /^(original|w\d{3,4})\.webp$/

export default class UploadsController {
  async show({ params, response }: HttpContext) {
    const { key, file } = params

    if (!KEY_PATTERN.test(key) || !FILE_PATTERN.test(file)) {
      return response.notFound('Not found')
    }

    const path = MediaService.storagePath(key, file)
    if (!existsSync(path)) {
      return response.notFound('Not found')
    }

    response.header('cache-control', 'public, max-age=31536000, immutable')
    return response.download(path)
  }
}
