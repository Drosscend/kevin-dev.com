import { test } from '@japa/runner'
import MarkdownService from '#services/markdown_service'

test.group('MarkdownService', () => {
  test('rend le markdown en HTML avec titres sluggés', async ({ assert }) => {
    const html = await MarkdownService.render('# Mon titre\n\nUn **paragraphe**.')

    assert.include(html, '<h1 id="mon-titre">Mon titre</h1>')
    assert.include(html, '<strong>paragraphe</strong>')
  })

  test('surligne les blocs de code avec shiki', async ({ assert }) => {
    const html = await MarkdownService.render('```ts\nconst a: number = 1\n```')

    assert.include(html, 'class="shiki')
    assert.include(html, '<code>')
  })

  test('supporte les tableaux GFM', async ({ assert }) => {
    const html = await MarkdownService.render('| a | b |\n| - | - |\n| 1 | 2 |')

    assert.include(html, '<table>')
  })

  test('relie les notes de bas de page à leur appel', async ({ assert }) => {
    const html = await MarkdownService.render('Texte[^1].\n\n[^1]: La note.')

    assert.include(html, 'href="#user-content-fn-1"')
    assert.include(html, 'id="user-content-fn-1"')
    assert.include(html, 'href="#user-content-fnref-1"')
    assert.include(html, 'id="user-content-fnref-1"')
  })

  test('expose le langage des blocs de code via data-language', async ({ assert }) => {
    const html = await MarkdownService.render('```ts\nconst a = 1\n```')

    assert.include(html, 'data-language="ts"')
  })

  test('calcule un temps de lecture minimal de 1 minute', ({ assert }) => {
    assert.equal(MarkdownService.readingTime('quelques mots'), 1)
    assert.equal(MarkdownService.readingTime(Array(600).fill('mot').join(' ')), 3)
  })
})
