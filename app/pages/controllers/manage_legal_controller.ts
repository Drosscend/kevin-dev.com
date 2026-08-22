import vine from '@vinejs/vine'
import { readMarkdownPage, saveMarkdownPage } from '#pages/queries/markdown_page'
import type { HttpContext } from '@adonisjs/core/http'

export default class ManageLegalController {
  static readonly validator = vine.create({
    fr: vine.string().optional(),
    en: vine.string().optional(),
  })

  async render({ inertia }: HttpContext) {
    return inertia.render('admin/legal', await readMarkdownPage('legal'))
  }

  async execute({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(ManageLegalController.validator)
    await saveMarkdownPage('legal', { fr: payload.fr ?? '', en: payload.en ?? '' })

    session.flash('success', 'Mentions légales enregistrées')
    return response.redirect().toRoute('admin.legal.index')
  }
}
