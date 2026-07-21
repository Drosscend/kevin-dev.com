import sharp from 'sharp'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Media from '#models/media'
import MediaService from '#services/media_service'

test.group('Admin media', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test("l'upload réencode en webp et génère les variantes", async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const image = await sharp({
      create: { width: 800, height: 600, channels: 3, background: { r: 200, g: 100, b: 50 } },
    })
      .png()
      .toBuffer()

    const response = await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', image, { filename: 'photo-test.png' })
      .field('alt', 'Une image de test')

    response.assertStatus(302)
    response.assertHeader('location', '/admin/media')

    const media = await Media.query().firstOrFail()
    assert.equal(media.alt, 'Une image de test')
    assert.equal(media.originalName, 'photo-test.png')
    assert.equal(media.mimeType, 'image/webp')
    assert.equal(media.width, 800)
    // 800px de large → variantes 320 et 640 uniquement
    assert.deepEqual(
      media.variants.map((variant) => variant.width),
      [320, 640]
    )

    const original = await client.get(`/uploads/${media.key}/original.webp`)
    original.assertStatus(200)
    original.assertHeader('content-type', 'image/webp')

    const variant = await client.get(`/uploads/${media.key}/w320.webp`)
    variant.assertStatus(200)

    await MediaService.delete(media)
  })

  test('un fichier non-image est rejeté proprement', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const response = await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', Buffer.from('pas une image'), { filename: 'fake.png' })
      .field('alt', 'Fichier invalide')

    response.assertStatus(302)
    assert.equal(
      await Media.query()
        .count('* as total')
        .firstOrFail()
        .then((r) => Number(r.$extras.total)),
      0
    )
  })

  test('le path traversal sur /uploads est bloqué', async ({ client }) => {
    const response = await client.get('/uploads/..%2F..%2F.env/original.webp')
    response.assertStatus(404)
  })
})
