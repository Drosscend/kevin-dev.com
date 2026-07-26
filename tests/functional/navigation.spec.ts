import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import frMessages from '../../resources/lang/fr/messages.json' with { type: 'json' }
import enMessages from '../../resources/lang/en/messages.json' with { type: 'json' }

/** Every leaf string of a translation file, keyed by its dotted path. */
function flatten(messages: object, prefix = ''): [string, string][] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flatten(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, String(value)] as [string, string]]
  )
}

test.group('Chrome de navigation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('les libellés du header et du footer suivent la langue', async ({ client, assert }) => {
    const fr = await client.get('/').withInertia()
    const en = await client.get('/en').withInertia()

    fr.assertStatus(200)
    en.assertStatus(200)
    const french = fr.inertiaProps.chrome as Record<string, string>
    const english = en.inertiaProps.chrome as Record<string, string>

    assert.equal(french.talks, 'Interventions')
    assert.equal(french.cv, 'CV')
    assert.equal(french.legal, 'Mentions légales')
    assert.equal(english.talks, 'Speaking')
    assert.equal(english.cv, 'Resume')
    assert.equal(english.legal, 'Legal notice')
  })

  test('les libellés d’accessibilité des contrôles sont traduits', async ({ client, assert }) => {
    const response = await client.get('/en').withInertia()

    const chrome = response.inertiaProps.chrome as Record<string, string>
    assert.equal(chrome.primary, 'Main navigation')
    assert.equal(chrome.secondary, 'Secondary navigation')
    assert.equal(chrome.openMenu, 'Open the menu')
    assert.equal(chrome.closeMenu, 'Close the menu')
    assert.equal(chrome.theme, 'Toggle light or dark theme')
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

  test('aucun libellé de navigation ne reste introuvable', async ({ client, assert }) => {
    for (const url of ['/', '/en']) {
      const response = await client.get(url).withInertia()
      const chrome = response.inertiaProps.chrome as Record<string, string>

      for (const [key, value] of Object.entries(chrome)) {
        assert.notInclude(value, 'translation missing', `messages.nav.${key} est introuvable`)
      }
    }
  })
})
