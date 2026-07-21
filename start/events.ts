/*
|--------------------------------------------------------------------------
| Event listeners
|--------------------------------------------------------------------------
|
| Bindings between application events and their listeners.
|
*/

import emitter from '@adonisjs/core/services/emitter'
import ContactMessageReceived from '#events/contact_message_received'

const SendContactNotification = () => import('#listeners/send_contact_notification')

emitter.on(ContactMessageReceived, [SendContactNotification])
