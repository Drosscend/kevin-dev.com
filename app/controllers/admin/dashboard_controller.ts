import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import ContactMessage from '#models/contact_message'

export default class DashboardController {
  async handle({ inertia, auth }: HttpContext) {
    const [mediaCount, unreadMessages] = await Promise.all([
      Media.query().count('* as total').firstOrFail(),
      ContactMessage.query().whereNull('read_at').count('* as total').firstOrFail(),
    ])

    return inertia.render('admin/dashboard', {
      totpEnabled: auth.user!.totpEnabled,
      mediaCount: Number(mediaCount.$extras.total),
      unreadMessages: Number(unreadMessages.$extras.total),
    })
  }
}
