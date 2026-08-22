import SettingsService from '#services/settings_service'
import { homeSettingsValidator } from '#validators/home'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async show({ inertia }: HttpContext) {
    const settings = await SettingsService.getMany([
      'hero_roles_fr',
      'hero_roles_en',
      'hero_location',
      'now_fr',
      'now_en',
    ])

    return inertia.render('admin/home', {
      settings: {
        heroRolesFr: settings.hero_roles_fr,
        heroRolesEn: settings.hero_roles_en,
        heroLocation: settings.hero_location,
        nowFr: settings.now_fr,
        nowEn: settings.now_en,
      },
    })
  }

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(homeSettingsValidator)

    await SettingsService.set('hero_roles_fr', (payload.heroRolesFr ?? '').trim())
    await SettingsService.set('hero_roles_en', (payload.heroRolesEn ?? '').trim())
    await SettingsService.set('hero_location', (payload.heroLocation ?? '').trim())
    await SettingsService.set('now_fr', (payload.nowFr ?? '').trim())
    await SettingsService.set('now_en', (payload.nowEn ?? '').trim())

    session.flash('success', 'Contenu de l’accueil enregistré')
    response.redirect().toRoute('admin.home.index')
  }
}
