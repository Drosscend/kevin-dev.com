import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Technology from '#technologies/models/technology'
import { makeArticle, makeProject, makeTalk } from '#tests/helpers/content'

test.group('Technologies publiques', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la liste groupe les technologies et compte tout ce qui est publié', async ({
    client,
    assert,
  }) => {
    const adonis = await Technology.create({
      slug: 'adonisjs',
      name: 'AdonisJS',
      category: 'framework',
    })
    await Technology.create({ slug: 'go', name: 'Go', category: 'langage' })
    await makeProject('un', 'published', { technologyIds: [adonis.id] })
    await makeProject('deux', 'published', { technologyIds: [adonis.id] })
    await makeArticle('un-article', 'published', { technologyIds: [adonis.id] })
    await makeTalk('une-intervention', 'published', { technologyIds: [adonis.id] })

    const response = await client.get('/technologies').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('technologies/index')
    const technologies = response.inertiaProps.technologies as {
      slug: string
      usageLabel: string
    }[]
    assert.equal(
      technologies.find((item) => item.slug === 'adonisjs')?.usageLabel,
      '2 projets · 1 article · 1 intervention'
    )
    assert.equal(
      technologies.find((item) => item.slug === 'go')?.usageLabel,
      "Rien de publié sur cette technologie pour l'instant."
    )
  })

  test('le compte est traduit et accordé en anglais', async ({ client, assert }) => {
    const adonis = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await Technology.create({ slug: 'go', name: 'Go' })
    await makeProject('un', 'published', { technologyIds: [adonis.id] })

    const response = await client.get('/en/technologies').withInertia()

    response.assertStatus(200)
    const technologies = response.inertiaProps.technologies as {
      slug: string
      usageLabel: string
    }[]
    assert.equal(technologies.find((item) => item.slug === 'adonisjs')?.usageLabel, '1 project')
    assert.equal(
      technologies.find((item) => item.slug === 'go')?.usageLabel,
      'Nothing published about this technology yet.'
    )
  })

  test('la fiche liste projets, articles et interventions qui portent la technologie', async ({
    client,
    assert,
  }) => {
    const adonis = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await makeProject('avec-adonis', 'published', { technologyIds: [adonis.id] })
    await makeProject('sans-adonis')
    await makeArticle('article-adonis', 'published', { technologyIds: [adonis.id] })
    await makeArticle('article-autre')
    await makeTalk('intervention-adonis', 'published', { technologyIds: [adonis.id] })
    await makeTalk('intervention-autre')

    const response = await client.get('/technologies/adonisjs').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('technologies/show')
    const technology = response.inertiaProps.technology as {
      projects: { slug: string; coverUrl: string | null }[]
      articles: { slug: string }[]
      talks: { slug: string }[]
    }
    assert.deepEqual(
      technology.projects.map((project) => project.slug),
      ['avec-adonis']
    )
    assert.isNull(technology.projects[0].coverUrl)
    assert.deepEqual(
      technology.articles.map((article) => article.slug),
      ['article-adonis']
    )
    assert.deepEqual(
      technology.talks.map((talk) => talk.slug),
      ['intervention-adonis']
    )
  })

  test('le lien de documentation suit la technologie sur la liste et sa fiche', async ({
    client,
    assert,
  }) => {
    await Technology.create({
      slug: 'adonisjs',
      name: 'AdonisJS',
      category: 'framework',
      docsUrl: 'https://docs.adonisjs.com',
    })
    await Technology.create({ slug: 'go', name: 'Go', category: 'langage' })

    const list = await client.get('/technologies').withInertia()
    const technologies = list.inertiaProps.technologies as {
      slug: string
      docsUrl: string | null
    }[]
    assert.equal(
      technologies.find((item) => item.slug === 'adonisjs')?.docsUrl,
      'https://docs.adonisjs.com'
    )
    assert.isNull(technologies.find((item) => item.slug === 'go')?.docsUrl ?? null)

    const show = await client.get('/technologies/adonisjs').withInertia()
    assert.equal(
      (show.inertiaProps.technology as { docsUrl: string | null }).docsUrl,
      'https://docs.adonisjs.com'
    )
    assert.equal((show.inertiaProps.labels as { docs: string }).docs, 'Documentation officielle')
  })

  test('la fiche reste navigable mais sort des résultats de recherche', async ({
    client,
    assert,
  }) => {
    await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const list = await client.get('/technologies').withInertia()
    const show = await client.get('/technologies/adonisjs').withInertia()

    assert.isFalse((list.inertiaProps.meta as { noindex: boolean }).noindex)
    assert.isTrue((show.inertiaProps.meta as { noindex: boolean }).noindex)
  })

  test('une technologie inconnue renvoie 404', async ({ client }) => {
    const response = await client.get('/technologies/inexistante')
    response.assertStatus(404)
  })
})
