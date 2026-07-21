import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import ContactMessage from '#models/contact_message'
import User from '#models/user'
import SettingsService from '#services/settings_service'
import MarkdownService from '#services/markdown_service'

async function messagesCount() {
  const row = await ContactMessage.query().count('* as total').firstOrFail()
  return Number(row.$extras.total)
}

test.group('Contact', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('un message valide est stocké en base', async ({ client, assert }) => {
    const response = await client
      .post('/contact')
      .header('referrer', '/contact')
      .withCsrfToken()
      .redirects(0)
      .form({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        message: 'Bonjour, ceci est un message de test suffisant.',
      })

    response.assertStatus(302)
    const message = await ContactMessage.query().firstOrFail()
    assert.equal(message.name, 'Jean Dupont')
    assert.equal(message.email, 'jean@example.com')
    assert.isNull(message.readAt)
  })

  test('le honeypot rempli ne stocke rien mais répond comme un succès', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post('/contact')
      .header('referrer', '/contact')
      .withCsrfToken()
      .redirects(0)
      .form({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'Un message de robot assez long pour passer.',
        website: 'https://spam.example.com',
      })

    response.assertStatus(302)
    assert.equal(await messagesCount(), 0)
  })

  test('un message trop court est rejeté', async ({ client, assert }) => {
    const response = await client
      .post('/contact')
      .header('referrer', '/contact')
      .withCsrfToken()
      .withInertia()
      .form({ name: 'Jean', email: 'jean@example.com', message: 'court' })

    response.assertStatus(200)
    response.assertInertiaComponent('contact')
    const errors = response.inertiaProps.errors as Record<string, unknown>
    assert.property(errors, 'message')
    assert.equal(await messagesCount(), 0)
  })

  test('la page contact est servie dans les deux langues', async ({ client }) => {
    const fr = await client.get('/contact').withInertia()
    fr.assertStatus(200)
    fr.assertInertiaComponent('contact')

    const en = await client.get('/en/contact').withInertia()
    en.assertStatus(200)
    en.assertInertiaPropsContains({ locale: 'en' })
  })
})

test.group('CV et mentions légales', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la page CV rend le contenu des settings', async ({ client, assert }) => {
    await SettingsService.set('cv_markdown_fr', '## Parcours')
    await SettingsService.set('cv_html_fr', await MarkdownService.render('## Parcours'))

    const response = await client.get('/cv').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('cv')
    const html = response.inertiaProps.contentHtml as string
    assert.include(html, '<h2 id="parcours">Parcours</h2>')
  })

  test('le PDF absent répond 404', async ({ client }) => {
    const response = await client.get('/cv.pdf')
    response.assertStatus(404)
  })

  test('les mentions légales rendent le contenu seedé', async ({ client, assert }) => {
    await SettingsService.set('legal_html_fr', '<p>Contenu légal</p>')

    const response = await client.get('/mentions-legales').withInertia()

    response.assertStatus(200)
    assert.include(response.inertiaProps.contentHtml as string, 'Contenu légal')
  })
})

test.group('Admin messages', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('marquer lu puis supprimer un message', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    const message = await ContactMessage.create({
      name: 'Jean',
      email: 'jean@example.com',
      body: 'Message',
    })

    const read = await client
      .put(`/admin/messages/${message.id}/read`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
    read.assertStatus(302)
    await message.refresh()
    assert.isTrue(message.isRead)

    const destroy = await client
      .delete(`/admin/messages/${message.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
    destroy.assertStatus(302)
    assert.equal(await messagesCount(), 0)
  })
})
