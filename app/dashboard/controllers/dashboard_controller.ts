import { inject } from '@adonisjs/core'
import DashboardStatsTransformer from '#app/dashboard/transformers/dashboard_stats_transformer'
import { DashboardStatsQuery } from '#dashboard/queries/dashboard_stats_query'
import Umami from '#dashboard/umami'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(private readonly dashboardStats: DashboardStatsQuery) {}

  async render({ inertia, auth }: HttpContext) {
    const [stats, umami] = await Promise.all([
      this.dashboardStats.execute(),
      Umami.statsLast30Days(),
    ])

    return inertia.render('admin/dashboard', {
      totpEnabled: auth.getUserOrFail().totpEnabled,
      umami,
      stats: DashboardStatsTransformer.transform(stats),
    })
  }
}
