import type { HttpContext } from '@adonisjs/core/http'
import { readMarkdownPage, saveMarkdownPage } from '#services/markdown_page_service'
import { markdownPageValidator } from '#validators/pages'

export default class LegalController {
  async show({ inertia }: HttpContext) {
    const contents = await readMarkdownPage('legal')

    return inertia.render('admin/legal', contents)
  }

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(markdownPageValidator)
    await saveMarkdownPage('legal', { fr: payload.fr ?? '', en: payload.en ?? '' })

    session.flash('success', 'Mentions légales enregistrées')
    response.redirect().toRoute('admin.legal.index')
  }
}
