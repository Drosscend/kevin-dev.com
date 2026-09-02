import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { pickerDateTime } from '#app/shared/date_format'
import { applyContentFields } from '#shared/content/content_fields'

const payload = {
  slug: 'demo',
  status: 'published' as const,
  coverMediaId: null,
  fr: { title: 'Démo', summary: '', contentMarkdown: 'Texte' },
  en: null,
}

function scheduledAt(publishedAt: string) {
  const entry: { publishedAt: DateTime | null } & typeof payload & { readingTime: number } = {
    ...payload,
    readingTime: 0,
    publishedAt: null,
  }
  applyContentFields(entry, { ...payload, publishedAt })
  return entry.publishedAt
}

test.group('Date format', () => {
  test('une date saisie dans le sélecteur revient identique au formulaire', ({ assert }) => {
    assert.equal(pickerDateTime(scheduledAt('2026-07-24T14:30')), '2026-07-24T14:30')
  })

  test("l'heure saisie est celle de Paris, quel que soit le fuseau du serveur", ({ assert }) => {
    assert.equal(scheduledAt('2026-07-24T14:30')?.toUTC().toISO(), '2026-07-24T12:30:00.000Z')
  })

  test('une date en base se relit sur la même horloge', ({ assert }) => {
    const stored = DateTime.fromISO('2026-01-15T23:30:00.000Z')

    assert.equal(pickerDateTime(stored), '2026-01-16T00:30')
  })
})
