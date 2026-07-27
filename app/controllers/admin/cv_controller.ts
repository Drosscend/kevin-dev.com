import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { readMarkdownPage, saveMarkdownPage } from '#services/markdown_page_service'
import { markdownPageValidator } from '#validators/pages'
import { CV_PDF_KEY } from '#controllers/cv_controller'

/**
 * The /cv page: its markdown content in both locales, and the PDF
 * offered for download beside it.
 */
export default class CvController {
  async show({ inertia }: HttpContext) {
    const contents = await readMarkdownPage('cv')
    const disk = drive.use()

    let pdf: { size: number } | null = null
    if (await disk.exists(CV_PDF_KEY)) {
      const metadata = await disk.getMetaData(CV_PDF_KEY)
      pdf = { size: metadata.contentLength }
    }

    return inertia.render('admin/cv', { fr: contents.fr, en: contents.en, pdf })
  }

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(markdownPageValidator)
    await saveMarkdownPage('cv', { fr: payload.fr ?? '', en: payload.en ?? '' })

    session.flash('success', 'CV enregistré')
    response.redirect().toRoute('admin.cv.index')
  }

  async uploadPdf({ request, response, session }: HttpContext) {
    const file = request.file('pdf', { size: '10mb', extnames: ['pdf'] })

    if (!file || !file.isValid) {
      session.flash('errors', {
        pdf: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    await file.moveToDisk(CV_PDF_KEY)

    session.flash('success', 'CV PDF mis à jour')
    response.redirect().toRoute('admin.cv.index')
  }
}
