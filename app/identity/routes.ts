import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { loginThrottle } from '#start/limiter'

/**
 * Two-step admin login: password, then TOTP.
 */
router
  .group(() => {
    router.get('login', [controllers.identity.Login, 'render']).as('admin.login')
    router
      .post('login', [controllers.identity.Login, 'execute'])
      .as('admin.login.store')
      .use(loginThrottle)

    router.get('login/verify', [controllers.identity.TotpChallenge, 'render']).as('admin.totp')
    router
      .post('login/verify', [controllers.identity.TotpChallenge, 'execute'])
      .as('admin.totp.store')
      .use(loginThrottle)
  })
  .prefix('/admin')
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.identity.Logout, 'execute']).as('admin.logout')

    router.get('security', [controllers.identity.Security, 'render']).as('admin.security')
    router.post('security', [controllers.identity.EnableTotp, 'execute']).as('admin.security.store')
    router
      .delete('security', [controllers.identity.DisableTotp, 'execute'])
      .as('admin.security.destroy')
    router
      .post('security/recovery', [controllers.identity.RegenerateRecoveryCodes, 'execute'])
      .as('admin.security.recovery.store')
  })
  .prefix('/admin')
  .use(middleware.auth())
