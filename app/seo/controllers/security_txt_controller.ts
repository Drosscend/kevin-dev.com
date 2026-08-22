import SeoService from '#app/shared/seo_service'
import type { HttpContext } from '@adonisjs/core/http'

const EXPIRY_DAYS = 182

/**
 * RFC 9116 security contact. The expiry is computed so the file
 * never goes stale.
 */
export default class SecurityTxtController {
  execute({ response }: HttpContext) {
    const expires = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
    response.header('content-type', 'text/plain; charset=utf-8')

    return [
      'Contact: mailto:contact@kevin-dev.com',
      `Expires: ${expires}`,
      'Preferred-Languages: fr, en',
      `Canonical: ${SeoService.absolute('/.well-known/security.txt')}`,
      '',
    ].join('\n')
  }
}
