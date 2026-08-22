import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import HomeSettingsTransformer from '#app/pages/transformers/home_settings_transformer'
import { SaveHomeSettings } from '#pages/actions/save_home_settings'
import { HomeSettingsQuery } from '#pages/queries/home_settings_query'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Admin editor for the homepage settings blocks (hero, "right now").
 * All fields are plain text; an empty value hides its block on the
 * public page.
 */
@inject()
export default class ManageHomeController {
  static readonly validator = vine.create({
    heroRolesFr: vine.string().optional(),
    heroRolesEn: vine.string().optional(),
    heroLocation: vine.string().optional(),
    nowFr: vine.string().optional(),
    nowEn: vine.string().optional(),
  })

  constructor(
    private readonly homeSettings: HomeSettingsQuery,
    private readonly saveHomeSettings: SaveHomeSettings
  ) {}

  async render({ inertia }: HttpContext) {
    return inertia.render('admin/home', {
      settings: HomeSettingsTransformer.transform(await this.homeSettings.execute()),
    })
  }

  async execute({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(ManageHomeController.validator)

    await this.saveHomeSettings.execute({
      heroRolesFr: payload.heroRolesFr ?? '',
      heroRolesEn: payload.heroRolesEn ?? '',
      heroLocation: payload.heroLocation ?? '',
      nowFr: payload.nowFr ?? '',
      nowEn: payload.nowEn ?? '',
    })

    session.flash('success', 'Contenu de l’accueil enregistré')
    return response.redirect().toRoute('admin.home.index')
  }
}
