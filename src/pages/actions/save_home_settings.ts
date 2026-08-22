import { inject } from '@adonisjs/core'
import Settings from '#pages/repositories/settings_repository'

export interface HomeSettingsPayload {
  heroRolesFr: string
  heroRolesEn: string
  heroLocation: string
  nowFr: string
  nowEn: string
}

@inject()
export class SaveHomeSettings {
  async execute(payload: HomeSettingsPayload) {
    await Settings.set('hero_roles_fr', payload.heroRolesFr.trim())
    await Settings.set('hero_roles_en', payload.heroRolesEn.trim())
    await Settings.set('hero_location', payload.heroLocation.trim())
    await Settings.set('now_fr', payload.nowFr.trim())
    await Settings.set('now_en', payload.nowEn.trim())
  }
}
