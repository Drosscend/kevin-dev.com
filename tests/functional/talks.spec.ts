import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import Talk from '#models/talk'
import Technology from '#models/technology'
import User from '#models/user'
import TalkService from '#services/talk_service'

function makeTalk(
  slug: string,
  status: 'draft' | 'published',
  options: {
    english?: boolean
    technologyIds?: number[]
    links?: boolean
    eventDate?: string
  } = {}
) {
  return TalkService.save(new Talk(), {
    slug,
    status,
    coverMediaId: null,
    eventDate: options.eventDate ?? '2025-06-01',
    eventName: 'DevFest Lyon',
    city: 'Lyon',
    technologyIds: options.technologyIds ?? [],
    links: options.links
      ? [{ label: 'Slides', url: 'https://slides.example.com/talk', type: 'slides' as const }]
      : [],
    fr: {
      title: `Intervention ${slug}`,
      summary: 'Résumé de l’intervention',
      contentMarkdown: '# Présentation\n\nContenu **français**.',
    },
    en: options.english
      ? { title: `Talk ${slug}`, summary: 'Summary', contentMarkdown: '# About' }
      : null,
  })
}

test.group('Interventions publiques', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la liste FR montre les interventions publiées, de la plus récente à la plus ancienne', async ({
    client,
    assert,
  }) => {
    await makeTalk('ancienne', 'published', { eventDate: '2024-03-01' })
    await makeTalk('recente', 'published', { eventDate: '2025-09-01' })
    await makeTalk('brouillon', 'draft')

    const response = await client.get('/talks').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('talks/index')
    const talks = response.inertiaProps.talks as { slug: string }[]
    assert.deepEqual(
      talks.map((talk) => talk.slug),
      ['recente', 'ancienne']
    )
  })

  test('la liste EN ne montre que les interventions traduites', async ({ client, assert }) => {
    await makeTalk('fr-seulement', 'published')
    await makeTalk('fr-et-en', 'published', { english: true })

    const response = await client.get('/en/talks').withInertia()

    response.assertStatus(200)
    const talks = response.inertiaProps.talks as { slug: string; title: string }[]
    assert.deepEqual(
      talks.map((talk) => talk.slug),
      ['fr-et-en']
    )
    assert.equal(talks[0].title, 'Talk fr-et-en')
  })

  test('une intervention à venir est signalée comme telle', async ({ client, assert }) => {
    await makeTalk('a-venir', 'published', {
      eventDate: DateTime.now().plus({ days: 30 }).toISODate()!,
    })
    await makeTalk('passee', 'published', { eventDate: '2024-01-01' })

    const response = await client.get('/talks').withInertia()

    const talks = response.inertiaProps.talks as { slug: string; upcoming: boolean }[]
    assert.isTrue(talks.find((talk) => talk.slug === 'a-venir')?.upcoming)
    assert.isFalse(talks.find((talk) => talk.slug === 'passee')?.upcoming)
  })

  test('la fiche expose liens, technologies et contenu rendu', async ({ client, assert }) => {
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await makeTalk('mon-talk', 'published', {
      technologyIds: [technology.id],
      links: true,
    })

    const response = await client.get('/talks/mon-talk').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('talks/show')
    const talk = response.inertiaProps.talk as {
      contentHtml: string
      eventName: string
      links: { type: string }[]
      technologies: { slug: string }[]
    }
    assert.include(talk.contentHtml, '<h1 id="présentation">Présentation</h1>')
    assert.equal(talk.eventName, 'DevFest Lyon')
    assert.deepEqual(
      talk.links.map((link) => link.type),
      ['slides']
    )
    assert.deepEqual(
      talk.technologies.map((item) => item.slug),
      ['adonisjs']
    )
  })

  test('une intervention brouillon est introuvable pour un visiteur', async ({ client }) => {
    await makeTalk('secrete', 'draft')

    const response = await client.get('/talks/secrete')
    response.assertStatus(404)
  })

  test('une intervention brouillon est prévisualisable connecté', async ({ client }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    await makeTalk('secrete', 'draft')

    const response = await client.get('/talks/secrete').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({ isDraftPreview: true })
  })

  test('l’accueil affiche les trois interventions les plus récentes', async ({
    client,
    assert,
  }) => {
    await makeTalk('t1', 'published', { eventDate: '2025-01-01' })
    await makeTalk('t2', 'published', { eventDate: '2025-02-01' })
    await makeTalk('t3', 'published', { eventDate: '2025-03-01' })
    await makeTalk('t4', 'published', { eventDate: '2025-04-01' })

    const response = await client.get('/').withInertia()

    response.assertStatus(200)
    const talks = response.inertiaProps.talks as { slug: string }[]
    assert.deepEqual(
      talks.map((talk) => talk.slug),
      ['t4', 't3', 't2']
    )
  })

  test('la variante Markdown expose les métadonnées de l’événement', async ({ client, assert }) => {
    await makeTalk('mon-talk', 'published', { links: true })

    const response = await client.get('/talks/mon-talk.md')

    response.assertStatus(200)
    const markdown = response.text()
    assert.include(markdown, '# Intervention mon-talk')
    assert.include(markdown, '- Événement : DevFest Lyon (Lyon)')
    assert.include(markdown, '- Date : 2025-06-01')
    assert.include(markdown, '- Slides : https://slides.example.com/talk')
  })

  test('le sitemap liste les interventions publiées', async ({ client, assert }) => {
    await makeTalk('publiee-fr', 'published')
    await makeTalk('publiee-bilingue', 'published', { english: true })
    await makeTalk('cachee', 'draft')

    const response = await client.get('/sitemap.xml')

    const xml = response.text()
    assert.include(xml, '/talks/publiee-fr</loc>')
    assert.include(xml, '/en/talks/publiee-bilingue</loc>')
    assert.notInclude(xml, '/en/talks/publiee-fr</loc>')
    assert.notInclude(xml, 'cachee')
  })
})

test.group('Admin CRUD interventions', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('créer une intervention publiée avec liens et technologies', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const response = await client
      .post('/admin/talks')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'mon-talk',
        status: 'published',
        eventDate: '2025-06-01',
        eventName: 'DevFest Lyon',
        city: 'Lyon',
        technologyIds: [technology.id],
        links: [{ label: 'Slides', url: 'https://slides.example.com/talk', type: 'slides' }],
        fr: { title: 'Mon intervention', summary: '', contentMarkdown: '# Intervention' },
      })

    response.assertStatus(302)
    const talk = await Talk.query()
      .where('slug', 'mon-talk')
      .preload('links')
      .preload('technologies')
      .firstOrFail()
    assert.lengthOf(talk.links, 1)
    assert.lengthOf(talk.technologies, 1)
    assert.equal(talk.eventName, 'DevFest Lyon')
    assert.isNotNull(talk.publishedAt)
  })

  test('le formulaire d’édition renvoie le Markdown source et les options', async ({
    client,
    assert,
  }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    const talk = await makeTalk('mon-talk', 'published', { technologyIds: [technology.id] })

    const response = await client.get(`/admin/talks/${talk.id}/edit`).loginAs(user).withInertia()

    response.assertStatus(200)
    const props = response.inertiaProps
    assert.include(props.talk.fr.contentMarkdown, '# Présentation')
    assert.equal(props.talk.eventDate, '2025-06-01')
    assert.deepEqual(props.talk.technologyIds, [technology.id])
    assert.deepEqual(props.options.technologies, [{ id: technology.id, name: 'AdonisJS' }])
  })

  test('une date d’événement invalide renvoie au formulaire sans rien créer', async ({
    client,
    assert,
  }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })

    const response = await client
      .post('/admin/talks')
      .loginAs(user)
      .header('referrer', '/admin/talks/create')
      .withCsrfToken()
      .withInertia()
      .json({
        slug: 'date-invalide',
        status: 'draft',
        eventDate: '01/06/2025',
        eventName: 'DevFest Lyon',
        fr: { title: 'Titre', summary: '', contentMarkdown: '# Contenu' },
      })

    response.assertStatus(200)
    response.assertInertiaComponent('admin/talks/form')
    assert.isNull(await Talk.findBy('slug', 'date-invalide'))
  })

  test('supprimer une intervention', async ({ client, assert }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    const talk = await makeTalk('a-supprimer', 'draft')

    const response = await client
      .delete(`/admin/talks/${talk.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)

    response.assertStatus(302)
    assert.isNull(await Talk.find(talk.id))
  })
})
