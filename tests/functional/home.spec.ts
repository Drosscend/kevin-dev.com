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

test.group("Page d'accueil", (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la stack montre les technologies les plus utilisées et compte le reste', async ({
    client,
    assert,
  }) => {
    // Fourteen technologies for twelve slots: the two most used come first
    // and the two least relevant ones fall behind the counter.
    const created = []
    for (let index = 1; index <= 14; index++) {
      const suffix = String(index).padStart(2, '0')
      created.push(await Technology.create({ slug: `tech-${suffix}`, name: `Tech ${suffix}` }))
    }
    await makeProject('un', [created[13].id])
    await makeProject('deux', [created[13].id, created[12].id])

    const response = await client.get('/').withInertia()

    response.assertStatus(200)
    const technologies = response.inertiaProps.technologies as { slug: string }[]
    assert.lengthOf(technologies, 12)
    assert.deepEqual(
      technologies.slice(0, 3).map((technology) => technology.slug),
      ['tech-14', 'tech-13', 'tech-01']
    )
    assert.equal(response.inertiaProps.hiddenTechnologies, 2)
  })

  test('aucun compteur tant que toutes les technologies tiennent sur la page', async ({
    client,
    assert,
  }) => {
    await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const response = await client.get('/').withInertia()

    response.assertStatus(200)
    assert.lengthOf(response.inertiaProps.technologies as unknown[], 1)
    assert.equal(response.inertiaProps.hiddenTechnologies, 0)
  })
})
