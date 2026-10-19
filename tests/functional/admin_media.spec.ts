import { readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import drive from '@adonisjs/drive/services/main'
import { test } from '@japa/runner'
import sharp from 'sharp'
import { DeleteMedia } from '#media/actions/delete_media'
import Media from '#media/models/media'
import { MediaStorage } from '#media/storage'
import { admin } from '#tests/helpers/auth'

/** The bodyparser names its temporary files with a bare UUID. */
async function temporaryUploads() {
  const entries = await readdir(tmpdir())
  return entries.filter((name) => /^[0-9a-f-]{36}$/.test(name))
}

test.group('Admin media', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test("l'upload réencode en webp et génère les variantes", async ({ client, assert }) => {
    const user = await admin()

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

    await (await app.container.make(DeleteMedia)).execute(media.id)
  })

  test("l'upload d'une animation garde toutes ses images, sans perte", async ({
    client,
    assert,
  }) => {
    const user = await admin()
    // Close shades: a lossy encoder takes the next frame for the previous one
    const shades = [100, 102, 104]
    const frames = await Promise.all(
      shades
        .map((shade) => ({ r: shade, g: shade, b: shade }))
        .map((background) =>
          sharp({ create: { width: 800, height: 600, channels: 3, background } })
            .png()
            .toBuffer()
        )
    )
    const animation = await sharp(frames, { join: { animated: true } })
      .webp({ lossless: true, delay: [100, 100, 100] })
      .toBuffer()

    await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', animation, { filename: 'animation-test.webp' })
      .field('alt', 'Une animation de test')

    const media = await Media.query().firstOrFail()
    assert.equal(media.width, 800)
    assert.equal(media.height, 600)
    assert.deepEqual(
      media.variants.map((variant) => [variant.width, variant.height]),
      [
        [320, 240],
        [640, 480],
      ]
    )

    const storage = await app.container.make(MediaStorage)
    for (const file of ['original.webp', 'w320.webp', 'w640.webp']) {
      const stored = await drive.use().getBytes(storage.key(media.key, file))
      const { pages } = await sharp(stored, { animated: true }).metadata()
      assert.equal(pages, 3, file)

      for (const [page, shade] of shades.entries()) {
        const pixels = await sharp(stored, { page }).raw().toBuffer()
        assert.equal(pixels[0], shade, `${file}, image ${page}`)
      }
    }

    await (await app.container.make(DeleteMedia)).execute(media.id)
  })

  test("l'upload ne laisse pas son fichier temporaire derrière lui", async ({ client, assert }) => {
    const user = await admin()
    const image = await sharp({
      create: { width: 64, height: 64, channels: 3, background: { r: 10, g: 20, b: 30 } },
    })
      .png()
      .toBuffer()
    const before = await temporaryUploads()

    await client
      .post('/admin/media')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .file('file', image, { filename: 'photo-test.png' })
      .field('alt', 'Une image de test')

    const media = await Media.query().firstOrFail()
    assert.deepEqual(
      (await temporaryUploads()).filter((name) => !before.includes(name)),
      []
    )

    await (await app.container.make(DeleteMedia)).execute(media.id)
  })

  test('un fichier non-image est rejeté proprement', async ({ client, assert }) => {
    const user = await admin()

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
    const user = await admin()
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

    await (await app.container.make(DeleteMedia)).execute(media.id)
  })

  test('un faux PDF est rejeté', async ({ client, assert }) => {
    const user = await admin()

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
    const user = await admin()
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
