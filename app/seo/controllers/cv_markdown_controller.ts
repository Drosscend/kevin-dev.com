import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import { toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

export default class CvMarkdownController {
  async execute({ response, i18n }: HttpContext) {
    const markdown = await Llms.settingsMarkdown('cv', toLocale(i18n.locale))

    if (!markdown) {
      return response.notFound('Not found')
    }

    response.header('content-type', MARKDOWN_CONTENT_TYPE)

    return markdown
  }
}
