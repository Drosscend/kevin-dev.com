import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'

export default class DashboardController {
  async handle({ inertia, auth }: HttpContext) {
    const mediaCount = await Media.query().count('* as total').firstOrFail()

    return inertia.render('admin/dashboard', {
      totpEnabled: auth.user!.totpEnabled,
      mediaCount: Number(mediaCount.$extras.total),
    })
  }
}
