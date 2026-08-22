import { inject } from '@adonisjs/core'
import { mediaUrl, thumbnailUrl } from '#app/shared/media_url'
import SeoService from '#app/shared/seo_service'
import { MediaLibraryQuery } from '#media/queries/media_library_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MediaController {
  constructor(private readonly mediaLibrary: MediaLibraryQuery) {}

  async render({ inertia }: HttpContext) {
    const media = await this.mediaLibrary.execute()

    return inertia.render('admin/media', {
      media: media.map((item) => {
        const url = mediaUrl(item, 1280)!

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
          thumbnailUrl: thumbnailUrl(item),
        }
      }),
    })
  }
}
