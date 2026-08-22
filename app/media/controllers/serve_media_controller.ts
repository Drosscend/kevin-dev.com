import { inject } from '@adonisjs/core'
import { MediaRepository } from '#media/repositories/media_repository'
import { DOCUMENT_FILE, MediaStorage } from '#media/storage'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Serves media library files from the Drive disk. Both URL segments
 * are strictly validated, so only generated files can be reached.
 */
const KEY_PATTERN = /^[a-z0-9]{10,32}$/
const FILE_PATTERN = /^(original|w\d{3,4})\.webp$/

/**
 * Download name of a document: the uploaded name stripped of
 * anything that could break out of the content-disposition header.
 */
function downloadName(originalName: string) {
  const cleaned = originalName
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .slice(0, 100)

  if (!cleaned || cleaned === '.pdf') {
    return DOCUMENT_FILE
  }

  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : `${cleaned}.pdf`
}

@inject()
export default class ServeMediaController {
  constructor(
    private readonly media: MediaRepository,
    private readonly storage: MediaStorage
  ) {}

  async execute({ params, response }: HttpContext) {
    const { key, file } = params
    const isDocument = file === DOCUMENT_FILE

    if (!KEY_PATTERN.test(key) || !(isDocument || FILE_PATTERN.test(file))) {
      return response.notFound('Not found')
    }

    if (!(await this.storage.exists(key, file))) {
      return response.notFound('Not found')
    }

    /**
     * Documents open in the browser viewer and are saved under the
     * name they were uploaded with, not the generated one.
     */
    if (isDocument) {
      const media = await this.media.findByKey(key)
      response.header('content-type', 'application/pdf')
      response.header(
        'content-disposition',
        `inline; filename="${downloadName(media?.originalName ?? DOCUMENT_FILE)}"`
      )
    } else {
      response.header('content-type', 'image/webp')
    }

    response.header('cache-control', 'public, max-age=31536000, immutable')
    return response.stream(await this.storage.stream(key, file))
  }
}
