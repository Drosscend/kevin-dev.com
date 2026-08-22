import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Technology from '#technologies/models/technology'
import { makeProject } from '#tests/helpers/content'

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
    await makeProject('un', 'published', { technologyIds: [created[13].id] })
    await makeProject('deux', 'published', { technologyIds: [created[13].id, created[12].id] })

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
