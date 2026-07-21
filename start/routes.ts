/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { loginThrottle } from '#start/limiter'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router.get('/health', [controllers.HealthChecks, 'handle']).as('health')

/**
 * Media library files (generated names, immutable).
 */
router.get('/uploads/:key/:file', [controllers.Uploads, 'show']).as('uploads.show')

/**
 * Two-step admin login (password then TOTP).
 */
router
  .group(() => {
    router.get('login', [controllers.admin.Session, 'create']).as('admin.login')
    router
      .post('login', [controllers.admin.Session, 'store'])
      .as('admin.login.store')
      .use(loginThrottle)

    router.get('login/verify', [controllers.admin.Session, 'totpCreate']).as('admin.totp')
    router
      .post('login/verify', [controllers.admin.Session, 'totpStore'])
      .as('admin.totp.store')
      .use(loginThrottle)
  })
  .prefix('/admin')
  .use(middleware.guest())

/**
 * Administration (authenticated session required).
 */
router
  .group(() => {
    router.get('/', [controllers.admin.Dashboard, 'handle']).as('admin.dashboard')
    router.post('logout', [controllers.admin.Session, 'destroy']).as('admin.logout')

    router.get('security', [controllers.admin.Security, 'show']).as('admin.security')
    router.post('security', [controllers.admin.Security, 'store']).as('admin.security.store')
    router.delete('security', [controllers.admin.Security, 'destroy']).as('admin.security.destroy')

    router.get('media', [controllers.admin.Media, 'index']).as('admin.media.index')
    router.post('media', [controllers.admin.Media, 'store']).as('admin.media.store')
    router.delete('media/:id', [controllers.admin.Media, 'destroy']).as('admin.media.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
