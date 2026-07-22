import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Project from '#models/project'
import Technology from '#models/technology'
import ProjectService from '#services/project_service'

function makeProject(slug: string, technologyIds: number[]) {
  return ProjectService.save(new Project(), {
    slug,
    status: 'published',
    featured: false,
    coverMediaId: null,
    startedAt: '2025-01-01',
    endedAt: null,
    technologyIds,
    articleIds: [],
    links: [],
    fr: {
      title: `Projet ${slug}`,
      summary: 'Résumé du projet',
      contentMarkdown: '# Projet\n\nContenu.',
    },
    en: null,
  })
}

test.group('Technologies publiques', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la liste groupe les technologies et compte les projets publiés', async ({
    client,
    assert,
  }) => {
    const adonis = await Technology.create({
      slug: 'adonisjs',
      name: 'AdonisJS',
      category: 'framework',
    })
    await Technology.create({ slug: 'go', name: 'Go', category: 'langage' })
    await makeProject('un', [adonis.id])
    await makeProject('deux', [adonis.id])

    const response = await client.get('/technologies').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('technologies/index')
    const technologies = response.inertiaProps.technologies as {
      slug: string
      projectsLabel: string
    }[]
    assert.equal(technologies.find((item) => item.slug === 'adonisjs')?.projectsLabel, '2 projets')
    assert.equal(technologies.find((item) => item.slug === 'go')?.projectsLabel, 'aucun projet')
  })

  test('le compte de projets est traduit et accordé en anglais', async ({ client, assert }) => {
    const adonis = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await Technology.create({ slug: 'go', name: 'Go' })
    await makeProject('un', [adonis.id])

    const response = await client.get('/en/technologies').withInertia()

    response.assertStatus(200)
    const technologies = response.inertiaProps.technologies as {
      slug: string
      projectsLabel: string
    }[]
    assert.equal(technologies.find((item) => item.slug === 'adonisjs')?.projectsLabel, '1 project')
    assert.equal(technologies.find((item) => item.slug === 'go')?.projectsLabel, 'no project')
  })

  test('la fiche liste les projets publiés qui utilisent la technologie', async ({
    client,
    assert,
  }) => {
    const adonis = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })
    await makeProject('avec-adonis', [adonis.id])
    await makeProject('sans-adonis', [])

    const response = await client.get('/technologies/adonisjs').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('technologies/show')
    const technology = response.inertiaProps.technology as {
      projects: { slug: string; coverUrl: string | null }[]
    }
    assert.deepEqual(
      technology.projects.map((project) => project.slug),
      ['avec-adonis']
    )
    assert.isNull(technology.projects[0].coverUrl)
  })

  test('une technologie inconnue renvoie 404', async ({ client }) => {
    const response = await client.get('/technologies/inexistante')
    response.assertStatus(404)
  })
})
