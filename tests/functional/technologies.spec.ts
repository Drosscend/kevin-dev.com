import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Article from '#models/article'
import Project from '#models/project'
import Talk from '#models/talk'
import Technology from '#models/technology'
import ArticleService from '#services/article_service'
import ProjectService from '#services/project_service'
import TalkService from '#services/talk_service'

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

function makeArticle(slug: string, technologyIds: number[]) {
  return ArticleService.save(new Article(), {
    slug,
    status: 'published',
    categoryId: null,
    coverMediaId: null,
    technologyIds,
    fr: {
      title: `Article ${slug}`,
      summary: "Résumé de l'article",
      contentMarkdown: '# Article\n\nContenu.',
    },
    en: null,
  })
}

function makeTalk(slug: string, technologyIds: number[]) {
  return TalkService.save(new Talk(), {
    slug,
    status: 'published',
    coverMediaId: null,
    eventDate: '2025-06-01',
    eventName: 'DevFest',
    city: 'Toulouse',
    technologyIds,
    links: [],
    fr: {
      title: `Intervention ${slug}`,
      summary: "Résumé de l'intervention",
      contentMarkdown: '# Intervention\n\nContenu.',
    },
    en: null,
  })
}

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
    await makeProject('un', [adonis.id])
    await makeProject('deux', [adonis.id])
    await makeArticle('un-article', [adonis.id])
    await makeTalk('une-intervention', [adonis.id])

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
    await makeProject('un', [adonis.id])

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
    await makeProject('avec-adonis', [adonis.id])
    await makeProject('sans-adonis', [])
    await makeArticle('article-adonis', [adonis.id])
    await makeArticle('article-autre', [])
    await makeTalk('intervention-adonis', [adonis.id])
    await makeTalk('intervention-autre', [])

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

  test('une technologie inconnue renvoie 404', async ({ client }) => {
    const response = await client.get('/technologies/inexistante')
    response.assertStatus(404)
  })
})
