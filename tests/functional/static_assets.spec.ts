import { mkdir, rm, writeFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Static assets', (group) => {
  const file = 'cache-test-abc123.js'
  const directory = app.publicPath('assets')

  group.setup(async () => {
    await mkdir(directory, { recursive: true })
    await writeFile(app.publicPath('assets', file), 'export {}')
    return () => rm(app.publicPath('assets', file), { force: true })
  })

  test('un fichier fingerprinté est cachable un an', async ({ client }) => {
    const response = await client.get(`/assets/${file}`)

    response.assertStatus(200)
    response.assertHeader('cache-control', 'public, max-age=31536000, immutable')
  })

  test('un fichier public ordinaire reste revalidé', async ({ client, assert }) => {
    const response = await client.get('/favicon.ico')

    response.assertStatus(200)
    assert.notInclude(response.header('cache-control') ?? '', 'immutable')
  })
})
