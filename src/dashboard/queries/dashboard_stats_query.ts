import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import ContactMessage from '#contact/models/contact_message'
import Media from '#media/models/media'
import Project from '#portfolio/models/project'

const asTotal = (row: { $extras: Record<string, unknown> }) => Number(row.$extras.total)

export interface DashboardStats {
  articlesPublished: number
  articlesDraft: number
  projectsPublished: number
  projectsDraft: number
  mediaCount: number
  unreadMessages: number
}

@inject()
export class DashboardStatsQuery {
  async execute(): Promise<DashboardStats> {
    const [
      articlesPublished,
      articlesDraft,
      projectsPublished,
      projectsDraft,
      mediaCount,
      unreadMessages,
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
    ])

    return {
      articlesPublished,
      articlesDraft,
      projectsPublished,
      projectsDraft,
      mediaCount,
      unreadMessages,
    }
  }
}
