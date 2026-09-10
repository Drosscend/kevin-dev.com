import { test } from '@japa/runner'
import { coverArt, MARK_FRAMES, OG_FRAME, type ArtRect, type ArtText } from '#types/cover_art'

const LONG_TITLE = 'Des tests end-to-end qui ne mentent pas, même le vendredi soir'

function titleLines(title: string) {
  return coverArt({ layout: 'cover', ...OG_FRAME, title }).figures.filter(
    (figure): figure is ArtText => figure.kind === 'text' && figure.family === 'display'
  )
}

test.group('Cover art', () => {
  test('un mark porte le filet et l’initiale du titre, dans le cadre', ({ assert }) => {
    for (const frame of Object.values(MARK_FRAMES)) {
      const art = coverArt({ layout: 'mark', ...frame, title: 'orbite' })
      const rects = art.figures.filter((figure): figure is ArtRect => figure.kind === 'rect')
      const text = art.figures.filter((figure): figure is ArtText => figure.kind === 'text')

      assert.equal(rects.filter((rect) => rect.role === 'accent').length, 1)
      assert.lengthOf(text, 1)
      assert.equal(text[0].value, 'O')
      assert.isBelow(text[0].y, frame.height)
      assert.isAbove(text[0].y - text[0].size, 0)
    }
  })

  test('un titre long tient en trois lignes', ({ assert }) => {
    const lines = titleLines(LONG_TITLE)

    assert.isAtMost(lines.length, 3)
    assert.equal(lines.map((line) => line.value).join(' '), LONG_TITLE)
  })

  test('un titre court est composé plus grand qu’un titre long', ({ assert }) => {
    assert.isAbove(titleLines('Orbite')[0].size, titleLines(LONG_TITLE)[0].size)
  })

  test('le titre reste dans le cadre', ({ assert }) => {
    for (const line of titleLines(LONG_TITLE)) {
      assert.isAbove(line.y - line.size, 0)
      assert.isBelow(line.y, OG_FRAME.height)
    }
  })
})
