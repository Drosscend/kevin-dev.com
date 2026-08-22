import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import type { Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

export default class CvMarkdownController {
  async execute({ response, i18n }: HttpContext) {
    const markdown = await Llms.settingsMarkdown('cv', i18n.locale as Locale)

    if (!markdown) {
      return response.notFound('Not found')
    }

    response.header('content-type', MARKDOWN_CONTENT_TYPE)

    return markdown
  }
}
