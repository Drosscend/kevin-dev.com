import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { TOTP, Secret } from 'otpauth'
import User from '#models/user'
import TotpService from '#services/totp_service'

function currentCode(secret: string, email: string) {
  return new TOTP({
    issuer: 'kevin-dev.com',
    label: email,
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  }).generate()
}

test.group('Admin auth', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('les pages admin exigent une session', async ({ client }) => {
    const response = await client.get('/admin').redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/admin/login')
  })

  test('le login échoue avec un mauvais mot de passe', async ({ client }) => {
    await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const response = await client
      .post('/admin/login')
      .header('referrer', '/admin/login')
      .withCsrfToken()
      .redirects(0)
      .form({ email: 'admin@example.com', password: 'mauvais-mdp' })

    response.assertStatus(302)
    response.assertHeader('location', '/admin/login')
  })

  test('le login sans 2FA ouvre une session directement', async ({ client }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const response = await client
      .post('/admin/login')
      .withCsrfToken()
      .redirects(0)
      .form({ email: user.email, password: 'motdepasse' })

    response.assertStatus(302)
    response.assertHeader('location', '/admin')
    response.assertSession('auth_web', user.id)
  })

  test('le login avec 2FA passe par le challenge TOTP', async ({ client }) => {
    const secret = TotpService.generateSecret()
    const user = await User.create({
      email: 'admin@example.com',
      password: 'motdepasse',
      totpSecret: secret,
    })

    const login = await client
      .post('/admin/login')
      .withCsrfToken()
      .redirects(0)
      .form({ email: user.email, password: 'motdepasse' })

    login.assertStatus(302)
    login.assertHeader('location', '/admin/login/verify')
    login.assertSession('totp_pending_user_id', user.id)
    login.assertSessionMissing('auth_web')

    const verify = await client
      .post('/admin/login/verify')
      .withCsrfToken()
      .withSession({ totp_pending_user_id: user.id })
      .redirects(0)
      .form({ code: currentCode(secret, user.email) })

    verify.assertStatus(302)
    verify.assertHeader('location', '/admin')
    verify.assertSession('auth_web', user.id)
    verify.assertSessionMissing('totp_pending_user_id')
  })

  test('un mauvais code TOTP ne connecte pas', async ({ client }) => {
    const secret = TotpService.generateSecret()
    const user = await User.create({
      email: 'admin@example.com',
      password: 'motdepasse',
      totpSecret: secret,
    })

    const verify = await client
      .post('/admin/login/verify')
      .header('referrer', '/admin/login/verify')
      .withCsrfToken()
      .withSession({ totp_pending_user_id: user.id })
      .redirects(0)
      .form({ code: '000000' })

    verify.assertStatus(302)
    verify.assertHeader('location', '/admin/login/verify')
    verify.assertSessionMissing('auth_web')
  })
})
