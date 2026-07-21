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

  test('calcule un temps de lecture minimal de 1 minute', ({ assert }) => {
    assert.equal(MarkdownService.readingTime('quelques mots'), 1)
    assert.equal(MarkdownService.readingTime(Array(600).fill('mot').join(' ')), 3)
  })
})
