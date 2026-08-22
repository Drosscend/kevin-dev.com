import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router
  .get('/admin', [controllers.dashboard.Dashboard, 'render'])
  .as('admin.dashboard')
  .use(middleware.auth())
