import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'
import { CV_PDF_KEY } from '#pages/cv_document'
import { readMarkdownPage, saveMarkdownPage } from '#pages/queries/markdown_page'
import type { HttpContext } from '@adonisjs/core/http'

export default class ManageCvController {
  static readonly validator = vine.create({
    fr: vine.string().optional(),
    en: vine.string().optional(),
  })

  async render({ inertia }: HttpContext) {
    const contents = await readMarkdownPage('cv')
    const disk = drive.use()

    let pdf: { size: number } | null = null

    if (await disk.exists(CV_PDF_KEY)) {
      const metadata = await disk.getMetaData(CV_PDF_KEY)
      pdf = { size: metadata.contentLength }
    }

    return inertia.render('admin/cv', { fr: contents.fr, en: contents.en, pdf })
  }

  async execute({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(ManageCvController.validator)
    await saveMarkdownPage('cv', { fr: payload.fr ?? '', en: payload.en ?? '' })

    session.flash('success', 'CV enregistré')
    return response.redirect().toRoute('admin.cv.index')
  }
}
