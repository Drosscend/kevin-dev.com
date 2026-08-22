import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { contactThrottle } from '#start/limiter'

router.get('/contact', [controllers.contact.Contact, 'render']).as('contact.show')
router
  .post('/contact', [controllers.contact.Contact, 'execute'])
  .as('contact.store')
  .use(contactThrottle)
router.get('/en/contact', [controllers.contact.Contact, 'render']).as('en.contact.show')
router
  .post('/en/contact', [controllers.contact.Contact, 'execute'])
  .as('en.contact.store')
  .use(contactThrottle)

router
  .group(() => {
    router.get('messages', [controllers.contact.Messages, 'render']).as('admin.messages.index')
    router
      .put('messages/:id/read', [controllers.contact.ToggleMessageRead, 'execute'])
      .as('admin.messages.read')
    router
      .delete('messages/:id', [controllers.contact.DeleteMessage, 'execute'])
      .as('admin.messages.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
