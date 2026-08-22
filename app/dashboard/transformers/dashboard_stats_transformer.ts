import { BaseTransformer } from '@adonisjs/core/transformers'

export interface DashboardStatsView {
  articlesPublished: number
  articlesDraft: number
  projectsPublished: number
  projectsDraft: number
  mediaCount: number
  unreadMessages: number
}

export default class DashboardStatsTransformer extends BaseTransformer<DashboardStatsView> {
  toObject() {
    return this.pick(this.resource, [
      'articlesPublished',
      'articlesDraft',
      'projectsPublished',
      'projectsDraft',
      'mediaCount',
      'unreadMessages',
    ])
  }
}
