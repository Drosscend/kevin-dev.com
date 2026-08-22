import { BaseTransformer } from '@adonisjs/core/transformers'

export interface HomeSettingsView {
  heroRolesFr: string
  heroRolesEn: string
  heroLocation: string
  nowFr: string
  nowEn: string
}

export default class HomeSettingsTransformer extends BaseTransformer<HomeSettingsView> {
  toObject() {
    return this.pick(this.resource, [
      'heroRolesFr',
      'heroRolesEn',
      'heroLocation',
      'nowFr',
      'nowEn',
    ])
  }
}
