import { test } from '@japa/runner'
import { violatedField } from '#exceptions/handler'

test.group('Handler / champ en violation d’unicité', () => {
  test('lit la colonne dans le détail Postgres', ({ assert }) => {
    assert.equal(violatedField('Key (slug)=(mon-article) already exists.'), 'slug')
  })

  test('lit une table dont le nom contient un underscore', ({ assert }) => {
    // The constraint name ("contact_messages_email_unique") could not
    // be parsed here: splitting it would yield "messages".
    assert.equal(violatedField('Key (email)=(a@b.c) already exists.'), 'email')
  })

  test('retient la première colonne d’une clé composite', ({ assert }) => {
    assert.equal(violatedField('Key (article_id, locale)=(1, fr) already exists.'), 'article_id')
  })

  test('retombe sur le slug quand le détail est absent ou inattendu', ({ assert }) => {
    assert.equal(violatedField(undefined), 'slug')
    assert.equal(violatedField('duplicate key value violates unique constraint'), 'slug')
  })
})
