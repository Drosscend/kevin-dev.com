import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
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
