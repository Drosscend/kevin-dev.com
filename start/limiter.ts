/*
|--------------------------------------------------------------------------
| Rate limiters
|--------------------------------------------------------------------------
|
| Limiteurs nommés, à attacher aux routes sensibles.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Login admin : 10 tentatives par minute et par IP.
 */
export const loginThrottle = limiter.define('login', ({ request }) => {
  return limiter.allowRequests(10).every('1 minute').usingKey(`login_${request.ip()}`)
})
