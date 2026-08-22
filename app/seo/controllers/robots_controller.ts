import SeoService from '#app/shared/seo_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RobotsController {
  execute({ response }: HttpContext) {
    response.header('content-type', 'text/plain; charset=utf-8')

    return [
      'User-agent: *',
      'Disallow: /admin',
      `Sitemap: ${SeoService.absolute('/sitemap.xml')}`,
      '',
    ].join('\n')
  }
}
