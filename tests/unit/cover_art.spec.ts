import { test } from '@japa/runner'
import { coverArt, MARK_FRAME, OG_FRAME, type ArtText } from '#types/cover_art'

const LONG_TITLE = 'Des tests end-to-end qui ne mentent pas, même le vendredi soir'

function titleLines(width: number, height: number, title: string) {
  return coverArt({ layout: 'cover', width, height, title, seed: 'seed' }).figures.filter(
    (figure): figure is ArtText => figure.kind === 'text' && figure.family === 'display'
  )
}

test.group('Cover art', () => {
  test('un slug donne toujours le même dessin', ({ assert }) => {
    const draw = () =>
      coverArt({ layout: 'mark', ...MARK_FRAME, title: 'MiniBox', seed: 'minibox' })

    assert.deepEqual(draw(), draw())
  })

  test('deux slugs ne donnent pas le même dessin', ({ assert }) => {
    const first = coverArt({ layout: 'mark', ...MARK_FRAME, title: 'MiniBox', seed: 'minibox' })
    const second = coverArt({ layout: 'mark', ...MARK_FRAME, title: 'MiniBox', seed: 'relais' })

    assert.notDeepEqual(first.figures, second.figures)
  })

  test('un mark porte l’initiale du titre', ({ assert }) => {
    const art = coverArt({ layout: 'mark', ...MARK_FRAME, title: 'orbite', seed: 'orbite' })
    const text = art.figures.filter((figure): figure is ArtText => figure.kind === 'text')

    assert.lengthOf(text, 1)
    assert.equal(text[0].value, 'O')
  })

  test('un titre long tient en trois lignes', ({ assert }) => {
    const lines = titleLines(OG_FRAME.width, OG_FRAME.height, LONG_TITLE)

    assert.isAtMost(lines.length, 3)
    assert.equal(lines.map((line) => line.value).join(' '), LONG_TITLE)
  })

  test('un titre court est composé plus grand qu’un titre long', ({ assert }) => {
    const short = titleLines(OG_FRAME.width, OG_FRAME.height, 'Orbite')
    const long = titleLines(OG_FRAME.width, OG_FRAME.height, LONG_TITLE)

    assert.isAbove(short[0].size, long[0].size)
  })

  test('le titre reste dans le cadre', ({ assert }) => {
    const lines = titleLines(OG_FRAME.width, OG_FRAME.height, LONG_TITLE)

    for (const line of lines) {
      assert.isAbove(line.y - line.size, 0)
      assert.isBelow(line.y, OG_FRAME.height)
    }
  })
})
