import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import SettingsService from '#services/settings_service'
import { makeArticle, makeProject } from '#tests/helpers/content'

test.group('LLM markdown', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('llms.txt indexe les contenus publiés avec leurs variantes .md', async ({
    client,
    assert,
  }) => {
    await makeArticle('guide-adonis', 'published', { english: true })
    await makeArticle('brouillon-cache', 'draft')
    await makeProject('mon-projet')

    const response = await client.get('/llms.txt')

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/markdown; charset=utf-8')
    const text = response.text()
    assert.include(text, '# kevin-dev.com')
    assert.include(text, '/blog/guide-adonis.md')
    assert.include(text, '/en/blog/guide-adonis.md')
    assert.include(text, '/projects/mon-projet.md')
    assert.notInclude(text, 'brouillon-cache')
  })

  test('la variante .md d’un article sert le Markdown source', async ({ client, assert }) => {
    await makeArticle('guide-adonis', 'published', {
      fr: { contentMarkdown: '## Section\n\nCorps.' },
    })

    const response = await client.get('/blog/guide-adonis.md')

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/markdown; charset=utf-8')
    const text = response.text()
    assert.include(text, '# Titre guide-adonis')
    assert.include(text, '## Section\n\nCorps.')
    assert.notInclude(text, '<h2')
  })

  test('la variante .md EN sert la traduction et 404 sinon', async ({ client, assert }) => {
    await makeArticle('bilingue', 'published', { english: { contentMarkdown: '## Section EN' } })
    await makeArticle('fr-seul', 'published')

    const en = await client.get('/en/blog/bilingue.md')
    en.assertStatus(200)
    assert.include(en.text(), '## Section EN')

    const missing = await client.get('/en/blog/fr-seul.md')
    missing.assertStatus(404)
  })

  test('un brouillon en .md est introuvable', async ({ client }) => {
    await makeArticle('secret', 'draft')

    const response = await client.get('/blog/secret.md')
    response.assertStatus(404)
  })

  test('cv.md sert le Markdown du CV quand il existe', async ({ client, assert }) => {
    const empty = await client.get('/cv.md')
    empty.assertStatus(404)

    await SettingsService.set('cv_markdown_fr', '## Parcours')
    const response = await client.get('/cv.md')
    response.assertStatus(200)
    assert.include(response.text(), '## Parcours')
  })

  test('la page HTML normale reste servie sans le suffixe .md', async ({ client }) => {
    await makeArticle('guide-adonis', 'published')

    const response = await client.get('/blog/guide-adonis').withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('blog/show')
  })
})
