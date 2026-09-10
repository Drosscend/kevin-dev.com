import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { makeArticle, makeProject } from '#tests/helpers/content'

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47])

test.group('Cartes sociales', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('un contenu publié sans couverture rend une carte PNG', async ({ client, assert }) => {
    await makeArticle('carte-sociale', 'published')

    const response = await client.get('/og/blog/carte-sociale.png')

    response.assertStatus(200)
    response.assertHeader('content-type', 'image/png')
    const body: Buffer = response.response.body
    assert.isTrue(body.subarray(0, 4).equals(PNG_SIGNATURE))
  })

  test('la carte anglaise passe par le préfixe de langue', async ({ client }) => {
    await makeProject('carte-projet', 'published', { english: true })

    const response = await client.get('/en/og/projects/carte-projet.png')

    response.assertStatus(200)
    response.assertHeader('content-type', 'image/png')
  })

  test('un brouillon, un type inconnu et une extension absente sont introuvables', async ({
    client,
  }) => {
    await makeArticle('carte-brouillon', 'draft')

    const draft = await client.get('/og/blog/carte-brouillon.png')
    const unknownType = await client.get('/og/pirate/carte-sociale.png')
    const noExtension = await client.get('/og/blog/carte-sociale')

    draft.assertStatus(404)
    unknownType.assertStatus(404)
    noExtension.assertStatus(404)
  })

  test('une page sans couverture pointe sa carte générée', async ({ client, assert }) => {
    await makeArticle('carte-meta', 'published')

    const page = await client.get('/blog/carte-meta').withInertia()

    assert.include(page.body().props.meta.ogImage, '/og/blog/carte-meta.png')
  })
})
