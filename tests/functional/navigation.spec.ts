import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { makeArticle } from '#tests/helpers/content'
import { homePage, notFoundPage } from '#tests/helpers/pages'
import enMessages from '../../resources/lang/en/messages.json' with { type: 'json' }
import frMessages from '../../resources/lang/fr/messages.json' with { type: 'json' }

/** A translation file: nested groups down to the leaf strings. */
type Messages = { [key: string]: string | Messages }

function isGroup(value: string | Messages): value is Messages {
  return typeof value === 'object'
}

/** Every leaf string of a translation file, keyed by its dotted path. */
function flatten(messages: Messages, prefix = ''): [string, string][] {
  return Object.entries(messages).flatMap(([key, value]): [string, string][] =>
    isGroup(value) ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]]
  )
}

test.group('Chrome de navigation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('les libellés du header et du footer suivent la langue', async ({ client, assert }) => {
    const fr = await client.get('/').withInertia()
    const en = await client.get('/en').withInertia()

    fr.assertStatus(200)
    en.assertStatus(200)
    const { messages: french } = homePage(fr)
    const { messages: english } = homePage(en)

    assert.equal(french.nav.talks, 'Interventions')
    assert.equal(french.nav.cv, 'CV')
    assert.equal(french.nav.legal, 'Mentions légales')
    assert.equal(english.nav.talks, 'Speaking')
    assert.equal(english.nav.cv, 'Resume')
    assert.equal(english.nav.legal, 'Legal notice')
  })

  test('une page introuvable sous /en garde le chrome en anglais', async ({ client, assert }) => {
    const response = await client.get('/en/nothing-here').withInertia()

    response.assertStatus(404)
    const { messages, locale } = notFoundPage(response)
    assert.equal(messages.nav.talks, 'Speaking')
    assert.equal(messages.errors.notFound, 'Page not found')
    assert.equal(locale, 'en')
  })

  test('la navigation ne liste que les sections qui ont du contenu publié', async ({
    client,
    assert,
  }) => {
    const empty = await client.get('/').withInertia()
    assert.deepEqual(homePage(empty).sections, {
      projects: false,
      blog: false,
      talks: false,
      technologies: false,
    })

    await makeArticle('article-fr', 'published')
    await makeArticle('article-brouillon', 'draft', { english: true })

    const french = await client.get('/').withInertia()
    assert.isTrue(homePage(french).sections.blog)
    assert.isFalse(homePage(french).sections.projects)

    const english = await client.get('/en').withInertia()
    assert.isFalse(homePage(english).sections.blog, 'seul un brouillon existe en anglais')

    const html = await client.get('/')
    assert.include(html.text(), '>Blog</a>')
    assert.notInclude(html.text(), '>Interventions</a>')
  })

  test('le HTML servi porte un lien d’évitement vers le contenu', async ({ client, assert }) => {
    const response = await client.get('/en')

    response.assertStatus(200)
    assert.include(response.text(), 'href="#main"')
    assert.include(response.text(), 'Skip to content')
    assert.include(response.text(), '<main id="main"')
  })

  test('le lien vers l’autre langue annonce sa langue cible', async ({ client, assert }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    const link = response.text().match(/<a[^>]*>EN<\/a>/)?.[0] ?? ''
    assert.match(link, /hreflang="en"/i)
    assert.match(link, /\slang="en"/)
  })

  test('les libellés d’accessibilité des contrôles sont traduits', async ({ client, assert }) => {
    const response = await client.get('/en').withInertia()

    const { messages } = homePage(response)
    assert.equal(messages.nav.primary, 'Main navigation')
    assert.equal(messages.nav.secondary, 'Secondary navigation')
    assert.equal(messages.nav.openMenu, 'Open the menu')
    assert.equal(messages.nav.closeMenu, 'Close the menu')
    assert.equal(messages.nav.theme, 'Toggle light or dark theme')
  })

  /**
   * Arrows belong to LinkArrow, which animates them and hides them from
   * screen readers. One left in a translation would be read aloud and
   * doubled by the component.
   */
  test('aucune traduction ne contient de flèche', ({ assert }) => {
    for (const [locale, messages] of [
      ['fr', frMessages],
      ['en', enMessages],
    ] as const) {
      for (const [key, value] of flatten(messages)) {
        assert.notMatch(value, /[←→]/, `messages.${key} (${locale}) contient une flèche`)
      }
    }
  })

  test('les deux dictionnaires ont les mêmes clés', ({ assert }) => {
    const keysOf = (messages: Messages) => flatten(messages).map(([key]) => key)

    assert.sameMembers(keysOf(enMessages), keysOf(frMessages))
  })
})
