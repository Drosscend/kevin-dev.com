import { inject } from '@adonisjs/core'
import { DeleteTalk } from '#talks/actions/delete_talk'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteTalkController {
  constructor(private readonly deleteTalk: DeleteTalk) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteTalk.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Intervention supprimée')
    return response.redirect().toRoute('admin.talks.index')
  }
}
