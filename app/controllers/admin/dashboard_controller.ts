import ContactMessage from '#contact/models/contact_message'
import Media from '#media/models/media'
import Article from '#models/article'
import Project from '#portfolio/models/project'
import UmamiService from '#services/umami_service'
import type { HttpContext } from '@adonisjs/core/http'

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
      // The published scope, not the status alone: an entry dated in the
      // future is scheduled, and counting it as online would contradict
      // what the site actually serves.
      Article.query()
        .withScopes((scopes) => scopes.published())
        .count('* as total')
        .firstOrFail()
        .then(asTotal),
      Article.query().where('status', 'draft').count('* as total').firstOrFail().then(asTotal),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .count('* as total')
        .firstOrFail()
        .then(asTotal),
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
