import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Serves the site under a single hostname. The "www" variant answers
 * with a permanent redirect to the host declared by APP_URL, so search
 * engines never crawl two copies of the same page. Any other hostname
 * (localhost, container health checks) is left untouched.
 */
export default class CanonicalHostMiddleware {
  static #canonical = new URL(env.get('APP_URL'))

  async handle(ctx: HttpContext, next: NextFn) {
    const hostname = ctx.request.hostname()

    if (hostname === `www.${CanonicalHostMiddleware.#canonical.hostname}`) {
      const target = `${CanonicalHostMiddleware.#canonical.origin}${ctx.request.url(true)}`
      return ctx.response.redirect(target, false, 301)
    }

    return next()
  }
}
