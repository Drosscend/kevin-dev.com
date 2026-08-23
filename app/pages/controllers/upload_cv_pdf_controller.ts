import { flashFieldErrors } from '#app/shared/field_errors'
import { CV_PDF_KEY } from '#pages/cv_document'
import type { HttpContext } from '@adonisjs/core/http'

export default class UploadCvPdfController {
  async execute({ request, response, session }: HttpContext) {
    const file = request.file('pdf', { size: '10mb', extnames: ['pdf'] })

    if (!file || !file.isValid) {
      flashFieldErrors(session, {
        pdf: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    await file.moveToDisk(CV_PDF_KEY)

    session.flash('success', 'CV PDF mis à jour')
    return response.redirect().toRoute('admin.cv.index')
  }
}
