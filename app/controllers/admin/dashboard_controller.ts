import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import Media from '#models/media'
import Project from '#models/project'
import ContactMessage from '#models/contact_message'
import UmamiService from '#services/umami_service'

const asTotal = (row: { $extras: Record<string, unknown> }) => Number(row.$extras.total)

export default class DashboardController {
  async handle({ inertia, auth }: HttpContext) {
    const [
      articlesPublished,
      articlesDraft,
      projectsPublished,
      projectsDraft,
      mediaCount,
      unreadMessages,
      umami,
    ] = await Promise.all([
      Article.query().where('status', 'published').count('* as total').firstOrFail().then(asTotal),
      Article.query().where('status', 'draft').count('* as total').firstOrFail().then(asTotal),
      Project.query().where('status', 'published').count('* as total').firstOrFail().then(asTotal),
      Project.query().where('status', 'draft').count('* as total').firstOrFail().then(asTotal),
      Media.query().count('* as total').firstOrFail().then(asTotal),
      ContactMessage.query().whereNull('read_at').count('* as total').firstOrFail().then(asTotal),
      UmamiService.statsLast30Days(),
    ])

    return inertia.render('admin/dashboard', {
      totpEnabled: auth.user!.totpEnabled,
      umami,
      stats: {
        articlesPublished,
        articlesDraft,
        projectsPublished,
        projectsDraft,
        mediaCount,
        unreadMessages,
      },
    })
  }
}
