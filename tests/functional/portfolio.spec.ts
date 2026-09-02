import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Technology from '#technologies/models/technology'
import { admin } from '#tests/helpers/auth'
import { makeProject } from '#tests/helpers/content'
import {
  projectListPage,
  projectPage,
  technologyListPage,
  technologyPage,
} from '#tests/helpers/pages'

test.group('Portfolio public', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la grille FR montre les projets publiés', async ({ client, assert }) => {
    await makeProject('projet-publie', 'published')
    await makeProject('projet-brouillon', 'draft')

    const response = await client.get('/projects').withInertia()

    response.assertStatus(200)
    const { projects } = projectListPage(response)
    const slugs = projects.map((project) => project.slug)
    assert.include(slugs, 'projet-publie')
    assert.notInclude(slugs, 'projet-brouillon')
  })

  test('la grille EN ne montre que les projets traduits', async ({ client, assert }) => {
    await makeProject('fr-seulement', 'published')
    await makeProject('fr-et-en', 'published', { english: true })

    const response = await client.get('/en/projects').withInertia()

    response.assertStatus(200)
    const { projects } = projectListPage(response)
    assert.deepEqual(
      projects.map((project) => project.slug),
      ['fr-et-en']
    )
    assert.equal(projects[0].title, 'Project fr-et-en')
  })

  test('la fiche projet expose liens et technologies', async ({ client, assert }) => {
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await makeProject('mon-projet', 'published', {
      technologyIds: [technology.id],
      links: true,
    })

    const response = await client.get('/projects/mon-projet').withInertia()

    response.assertStatus(200)
    const { project } = projectPage(response)
    assert.include(project.contentHtml, '<h1 id="présentation">Présentation</h1>')
    assert.deepEqual(
      project.links.map((link) => link.type),
      ['github']
    )
    assert.deepEqual(
      project.technologies.map((item) => item.slug),
      ['adonisjs']
    )
  })

  test('le temps de lecture vient du contenu français, sur la fiche seulement', async ({
    client,
    assert,
  }) => {
    await makeProject('long-projet', 'published', {
      english: true,
      fr: { contentMarkdown: Array(600).fill('mot').join(' ') },
    })

    const listing = await client.get('/projects').withInertia()
    const { projects } = projectListPage(listing)
    assert.notProperty(projects[0], 'readingTimeLabel')

    const detail = await client.get('/en/projects/long-projet').withInertia()
    const { project } = projectPage(detail)
    assert.equal(project.readingTimeLabel, '3 min read')
  })

  test('un projet brouillon est introuvable pour un visiteur', async ({ client }) => {
    await makeProject('secret', 'draft')

    const response = await client.get('/projects/secret')
    response.assertStatus(404)
  })

  test('un projet brouillon est prévisualisable connecté', async ({ client }) => {
    const user = await admin()
    await makeProject('secret', 'draft')

    const response = await client.get('/projects/secret').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({ preview: 'draft' })
  })

  test('la fiche techno liste les projets publiés qui l’utilisent', async ({ client, assert }) => {
    const technology = await Technology.create({ slug: 'react', name: 'React' })
    await makeProject('projet-react', 'published', { technologyIds: [technology.id] })
    await makeProject('brouillon-react', 'draft', { technologyIds: [technology.id] })

    const response = await client.get('/technologies/react').withInertia()

    response.assertStatus(200)
    const { technology: shown } = technologyPage(response)
    assert.deepEqual(
      shown.projects.map((project) => project.slug),
      ['projet-react']
    )
  })

  test('la liste des technologies ne compte que les projets publiés', async ({
    client,
    assert,
  }) => {
    const technology = await Technology.create({
      slug: 'docker',
      name: 'Docker',
      category: 'infra',
    })
    await makeProject('projet-docker', 'published', { technologyIds: [technology.id] })
    await makeProject('brouillon-docker', 'draft', { technologyIds: [technology.id] })

    const response = await client.get('/technologies').withInertia()

    response.assertStatus(200)
    const { technologies } = technologyListPage(response)
    const docker = technologies.find((item) => item.slug === 'docker')
    assert.equal(docker?.usageLabel, '1 projet')
  })
})
