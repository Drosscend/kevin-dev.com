/*
|--------------------------------------------------------------------------
| Event listeners
|--------------------------------------------------------------------------
|
| Bindings between application events and their listeners.
|
*/

import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

/**
 * Mails are queued, so a delivery failure surfaces here instead of in
 * the request. It is logged and goes no further: the contact message
 * is already stored when the mailer runs.
 */
emitter.on('queued:mail:error', (event) => {
  logger.error({ err: event.error, mailer: event.mailerName }, 'Queued mail delivery failed')
})
