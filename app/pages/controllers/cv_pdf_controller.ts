import drive from '@adonisjs/drive/services/main'
import { CV_PDF_KEY } from '#pages/cv_document'
import type { HttpContext } from '@adonisjs/core/http'

export default class CvPdfController {
  async execute({ response }: HttpContext) {
    const disk = drive.use()

    if (!(await disk.exists(CV_PDF_KEY))) {
      return response.notFound('Not found')
    }

    response.header('content-type', 'application/pdf')
    response.header('content-disposition', 'attachment; filename="CV-Kevin-Veronesi.pdf"')

    return response.stream(await disk.getStream(CV_PDF_KEY))
  }
}
