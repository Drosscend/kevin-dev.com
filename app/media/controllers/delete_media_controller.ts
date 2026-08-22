import { inject } from '@adonisjs/core'
import { DeleteMedia } from '#media/actions/delete_media'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteMediaController {
  constructor(private readonly deleteMedia: DeleteMedia) {}

  async execute({ params, session, response }: HttpContext) {
    const result = await this.deleteMedia.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', result.value.isDocument ? 'Document supprimé' : 'Image supprimée')
    return response.redirect().toRoute('admin.media.index')
  }
}
