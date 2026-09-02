import limiter from '@adonisjs/limiter/services/main'
import { TOTP_PENDING_KEY } from '#app/identity/session_keys'

export const loginThrottle = limiter.define('login', ({ request }) => {
  return limiter.allowRequests(10).every('1 minute').usingKey(`login_${request.ip()}`)
})

/**
 * A six-digit code with a one-step window is guessable at the login
 * throttle's rate, so the second factor gets its own budget, keyed on
 * the account under challenge rather than on the caller's address.
 */
export const totpThrottle = limiter.define('totp', ({ session }) => {
  return limiter
    .allowRequests(5)
    .every('15 minutes')
    .usingKey(`totp_${session.get(TOTP_PENDING_KEY, 'none')}`)
})

export const contactThrottle = limiter.define('contact', ({ request }) => {
  return limiter.allowRequests(5).every('1 hour').usingKey(`contact_${request.ip()}`)
})
