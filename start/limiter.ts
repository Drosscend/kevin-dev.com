import limiter from '@adonisjs/limiter/services/main'

export const loginThrottle = limiter.define('login', ({ request }) => {
  return limiter.allowRequests(10).every('1 minute').usingKey(`login_${request.ip()}`)
})

export const contactThrottle = limiter.define('contact', ({ request }) => {
  return limiter.allowRequests(5).every('1 hour').usingKey(`contact_${request.ip()}`)
})
