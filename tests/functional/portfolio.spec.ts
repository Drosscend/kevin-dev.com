import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Project from '#models/project'
import Technology from '#models/technology'
import User from '#models/user'
import ProjectService from '#services/project_service'

function makeProject(
  slug: string,
  status: 'draft' | 'published',
  options: { english?: boolean; technologyIds?: number[]; links?: boolean } = {}
) {
  return ProjectService.save(new Project(), {
    slug,
    status,
    coverMediaId: null,
    startedAt: '2024-01-01',
    endedAt: null,
    featured: false,
    technologyIds: options.technologyIds ?? [],
    articleIds: [],
    links: options.links
      ? [{ label: 'GitHub', url: 'https://github.com/Drosscend/test', type: 'github' as const }]
      : [],
    fr: {
      title: `Projet ${slug}`,
      summary: 'Résumé du projet',
      contentMarkdown: '# Présentation\n\nContenu **français**.',
    },
    en: options.english
      ? { title: `Project ${slug}`, summary: 'Summary', contentMarkdown: '# About' }
      : null,
  })
}

test.group('Portfolio public', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la grille FR montre les projets publiés', async ({ client, assert }) => {
    await makeProject('projet-publie', 'published')
    await makeProject('projet-brouillon', 'draft')

    const response = await client.get('/projets').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('portfolio/index')
    const projects = response.inertiaProps.projects as { slug: string }[]
    const slugs = projects.map((project) => project.slug)
    assert.include(slugs, 'projet-publie')
    assert.notInclude(slugs, 'projet-brouillon')
  })

  test('la grille EN ne montre que les projets traduits', async ({ client, assert }) => {
    await makeProject('fr-seulement', 'published')
    await makeProject('fr-et-en', 'published', { english: true })

    const response = await client.get('/en/projets').withInertia()

    response.assertStatus(200)
    const projects = response.inertiaProps.projects as { slug: string; title: string }[]
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

    const response = await client.get('/projets/mon-projet').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('portfolio/show')
    const project = response.inertiaProps.project as {
      contentHtml: string
      links: { type: string }[]
      technologies: { slug: string }[]
    }
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

  test('un projet brouillon est introuvable pour un visiteur', async ({ client }) => {
    await makeProject('secret', 'draft')

    const response = await client.get('/projets/secret')
    response.assertStatus(404)
  })

  test('un projet brouillon est prévisualisable connecté', async ({ client }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    await makeProject('secret', 'draft')

    const response = await client.get('/projets/secret').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({ isDraftPreview: true })
  })

  test('la fiche techno liste les projets publiés qui l’utilisent', async ({ client, assert }) => {
    const technology = await Technology.create({ slug: 'react', name: 'React' })
    await makeProject('projet-react', 'published', { technologyIds: [technology.id] })
    await makeProject('brouillon-react', 'draft', { technologyIds: [technology.id] })

    const response = await client.get('/technologies/react').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('technologies/show')
    const data = response.inertiaProps.technology as { projects: { slug: string }[] }
    assert.deepEqual(
      data.projects.map((project) => project.slug),
      ['projet-react']
    )
  })

  test('la grille des technologies compte les projets publiés', async ({ client, assert }) => {
    const technology = await Technology.create({
      slug: 'docker',
      name: 'Docker',
      category: 'infra',
    })
    await makeProject('projet-docker', 'published', { technologyIds: [technology.id] })
    await makeProject('brouillon-docker', 'draft', { technologyIds: [technology.id] })

    const response = await client.get('/technologies').withInertia()

    response.assertStatus(200)
    const technologies = response.inertiaProps.technologies as {
      slug: string
      projectsCount: number
    }[]
    const docker = technologies.find((item) => item.slug === 'docker')
    assert.equal(docker?.projectsCount, 1)
  })
})
