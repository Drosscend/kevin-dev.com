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
    // An 800px-wide source only yields the 320 and 640 variants
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

  test('un PDF est stocké tel quel et servi en application/pdf', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    const pdf = Buffer.from('%PDF-1.7\n%stub\ntrailer\n%%EOF\n')

    const response = await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', pdf, { filename: 'memoire-master.pdf' })
      .field('alt', 'Mémoire de master')

    response.assertStatus(302)

    const media = await Media.query().firstOrFail()
    assert.equal(media.mimeType, 'application/pdf')
    assert.isTrue(media.isDocument)
    assert.isNull(media.width)
    assert.deepEqual(media.variants, [])
    assert.equal(media.size, pdf.byteLength)

    const document = await client.get(`/uploads/${media.key}/document.pdf`)
    document.assertStatus(200)
    document.assertHeader('content-type', 'application/pdf')
    document.assertHeader('content-disposition', 'inline; filename="memoire-master.pdf"')

    // Documents carry no image variant
    const missing = await client.get(`/uploads/${media.key}/original.webp`)
    missing.assertStatus(404)

    await MediaService.delete(media)
  })

  test('un faux PDF est rejeté', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const response = await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', Buffer.from('pas un pdf'), { filename: 'fake.pdf' })
      .field('alt', 'Document invalide')

    response.assertStatus(302)
    assert.equal(
      await Media.query()
        .count('* as total')
        .firstOrFail()
        .then((r) => Number(r.$extras.total)),
      0
    )
  })

  test('le sélecteur de couverture ignore les documents', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    await Media.create({
      key: 'a1b2c3d4e5f6',
      originalName: 'photo.png',
      alt: 'Une image',
      mimeType: 'image/webp',
      width: 800,
      height: 600,
      size: 1024,
      variants: [],
    })
    await Media.create({
      key: 'f6e5d4c3b2a1',
      originalName: 'memoire.pdf',
      alt: 'Un mémoire',
      mimeType: 'application/pdf',
      width: null,
      height: null,
      size: 2048,
      variants: [],
    })

    const response = await client.get('/admin/projects/create').loginAs(user).withInertia()

    response.assertStatus(200)
    assert.deepEqual(
      response.inertiaProps.options.media.map((item: { alt: string }) => item.alt),
      ['Une image']
    )
  })

  test('le path traversal sur /uploads est bloqué', async ({ client }) => {
    const response = await client.get('/uploads/..%2F..%2F.env/original.webp')
    response.assertStatus(404)
  })
})
