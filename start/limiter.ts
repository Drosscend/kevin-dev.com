/*
|--------------------------------------------------------------------------
| Rate limiters
|--------------------------------------------------------------------------
|
| Named limiters attached to sensitive routes.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Admin login: 10 attempts per minute per IP.
 */
export const loginThrottle = limiter.define('login', ({ request }) => {
  return limiter.allowRequests(10).every('1 minute').usingKey(`login_${request.ip()}`)
})

/**
 * Contact form: 5 submissions per hour per IP.
 */
export const contactThrottle = limiter.define('contact', ({ request }) => {
  return limiter.allowRequests(5).every('1 hour').usingKey(`contact_${request.ip()}`)
})
