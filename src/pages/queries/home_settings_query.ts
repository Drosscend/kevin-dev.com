import { inject } from '@adonisjs/core'
import Settings from '#pages/repositories/settings_repository'

export interface HomeSettings {
  heroRolesFr: string
  heroRolesEn: string
  heroLocation: string
  nowFr: string
  nowEn: string
}

@inject()
export class HomeSettingsQuery {
  async execute(): Promise<HomeSettings> {
    const settings = await Settings.getMany([
      'hero_roles_fr',
      'hero_roles_en',
      'hero_location',
      'now_fr',
      'now_en',
    ])

    return {
      heroRolesFr: settings.hero_roles_fr,
      heroRolesEn: settings.hero_roles_en,
      heroLocation: settings.hero_location,
      nowFr: settings.now_fr,
      nowEn: settings.now_en,
    }
  }
}
