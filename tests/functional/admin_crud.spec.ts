import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Category from '#models/category'
import Tag from '#models/tag'
import Technology from '#models/technology'
import Article from '#models/article'
import Project from '#models/project'
import TimelineEntry from '#models/timeline_entry'
import SettingsService from '#services/settings_service'

async function admin() {
  return User.create({ email: 'admin@example.com', password: 'motdepasse' })
}

test.group('Admin CRUD catégories et tags', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('créer, modifier puis supprimer une catégorie', async ({ client, assert }) => {
    const user = await admin()

    const store = await client
      .post('/admin/categories')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'dev', nameFr: 'Développement', nameEn: 'Development' })
    store.assertStatus(302)

    const category = await Category.query()
      .where('slug', 'dev')
      .preload('translations')
      .firstOrFail()
    assert.equal(category.name('fr'), 'Développement')
    assert.equal(category.name('en'), 'Development')

    const update = await client
      .put(`/admin/categories/${category.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'developpement', nameFr: 'Développement' })
    update.assertStatus(302)

    await category.refresh()
    await category.load('translations')
    assert.equal(category.slug, 'developpement')
    assert.isUndefined(
      category.translations.find((translation) => translation.locale === 'en'),
      'vider nameEn doit supprimer la traduction anglaise'
    )

    const destroy = await client
      .delete(`/admin/categories/${category.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
    destroy.assertStatus(302)
    assert.isNull(await Category.find(category.id))
  })

  test('un slug de catégorie dupliqué est rejeté avec un flash', async ({ client, assert }) => {
    const user = await admin()
    await Category.create({ slug: 'dev' })

    const response = await client
      .post('/admin/categories')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'dev', nameFr: 'Doublon' })

    response.assertStatus(302)
    const total = await Category.query().count('* as total').firstOrFail()
    assert.equal(Number(total.$extras.total), 1)
  })

  test('modifier une catégorie en gardant son slug est accepté', async ({ client, assert }) => {
    const user = await admin()
    const category = await Category.create({ slug: 'dev' })

    const response = await client
      .put(`/admin/categories/${category.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'dev', nameFr: 'Développement' })

    response.assertStatus(302)
    await category.load('translations')
    assert.equal(category.name('fr'), 'Développement')
  })

  test('créer un tag', async ({ client, assert }) => {
    const user = await admin()

    const response = await client
      .post('/admin/tags')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'adonisjs', nameFr: 'AdonisJS' })

    response.assertStatus(302)
    assert.isNotNull(await Tag.findBy('slug', 'adonisjs'))
  })
})

test.group('Admin CRUD technologies', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('créer puis modifier une technologie', async ({ client, assert }) => {
    const user = await admin()

    const store = await client
      .post('/admin/technologies')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'react', name: 'React', category: 'framework', descriptionFr: 'Lib UI' })
    store.assertStatus(302)

    const technology = await Technology.query()
      .where('slug', 'react')
      .preload('translations')
      .firstOrFail()
    assert.equal(technology.description('fr'), 'Lib UI')

    const update = await client
      .put(`/admin/technologies/${technology.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ slug: 'react', name: 'React 19', category: 'framework' })
    update.assertStatus(302)

    await technology.refresh()
    assert.equal(technology.name, 'React 19')

    await technology.load('translations')
    assert.isUndefined(
      technology.translations.find((translation) => translation.locale === 'en'),
      'vider descriptionEn doit supprimer la traduction anglaise'
    )
  })
})

/**
 * The timeline is the only place where the English fields fall back
 * to their French counterpart one by one, on top of the shared
 * "empty English removes the translation" rule.
 */
test.group('Admin parcours', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const entry = {
    periodFr: '2024-aujourd’hui',
    titleFr: 'Consultant',
    placeFr: 'Toulouse',
  }

  test('un anglais partiel est complété par le français', async ({ client, assert }) => {
    const user = await admin()

    const response = await client
      .post('/admin/home/timeline')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ ...entry, titleEn: 'Consultant' })
    response.assertStatus(302)

    // The timeline table is seeded by its migration: the entry just
    // created is the last one in position order.
    const created = await TimelineEntry.query()
      .preload('translations')
      .orderBy('position', 'desc')
      .firstOrFail()
    const en = created.translations.find((item) => item.locale === 'en')
    assert.isDefined(en)
    assert.equal(en!.title, 'Consultant')
    assert.equal(en!.period, entry.periodFr, 'un champ EN vide reprend la valeur française')
    assert.equal(en!.place, entry.placeFr)
  })

  test('vider tous les champs anglais supprime la traduction', async ({ client, assert }) => {
    const user = await admin()
    const created = await TimelineEntry.create({ position: 1 })
    await created.related('translations').createMany([
      { locale: 'fr', ...{ period: entry.periodFr, title: entry.titleFr, place: entry.placeFr } },
      { locale: 'en', period: '2024-now', title: 'Consultant', place: 'Toulouse' },
    ])

    const response = await client
      .put(`/admin/home/timeline/${created.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form(entry)
    response.assertStatus(302)

    await created.load('translations')
    assert.isUndefined(created.translations.find((item) => item.locale === 'en'))
  })

  test('la mention est enregistrée, sans mention par défaut', async ({ client, assert }) => {
    const user = await admin()

    const store = await client
      .post('/admin/home/timeline')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form(entry)
    store.assertStatus(302)

    const created = await TimelineEntry.query().orderBy('position', 'desc').firstOrFail()
    assert.equal(created.honours, 'none')

    const update = await client
      .put(`/admin/home/timeline/${created.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ ...entry, honours: 'very_good' })
    update.assertStatus(302)

    await created.refresh()
    assert.equal(created.honours, 'very_good')
  })
})

test.group('Admin CRUD articles et projets (HTTP)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('créer un article via le formulaire', async ({ client, assert }) => {
    const user = await admin()

    const response = await client
      .post('/admin/articles')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'premier-article',
        status: 'draft',
        fr: { title: 'Premier article', summary: '', contentMarkdown: '# Bonjour' },
      })

    response.assertStatus(302)
    const article = await Article.query()
      .where('slug', 'premier-article')
      .preload('translations')
      .firstOrFail()
    assert.include(article.translation('fr')!.contentHtml, '<h1 id="bonjour">Bonjour</h1>')
  })

  test('un slug d’article dupliqué est rejeté avec un flash', async ({ client, assert }) => {
    const user = await admin()
    await Article.create({ slug: 'pris', status: 'draft' })

    const response = await client
      .post('/admin/articles')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'pris',
        status: 'draft',
        fr: { title: 'Doublon', summary: '', contentMarkdown: 'Contenu' },
      })

    response.assertStatus(302)
    const total = await Article.query().count('* as total').firstOrFail()
    assert.equal(Number(total.$extras.total), 1)
  })

  test('le slug d’un article déjà en ligne ne peut plus être modifié', async ({
    client,
    assert,
  }) => {
    const user = await admin()
    const article = await Article.create({
      slug: 'en-ligne',
      status: 'published',
      publishedAt: DateTime.now().minus({ days: 1 }),
    })

    const response = await client
      .put(`/admin/articles/${article.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'autre-slug',
        status: 'published',
        fr: { title: 'Titre', summary: '', contentMarkdown: 'Contenu' },
      })

    response.assertStatus(302)
    await article.refresh()
    assert.equal(article.slug, 'en-ligne')
  })

  test('le slug d’un article planifié reste modifiable', async ({ client, assert }) => {
    const user = await admin()
    const article = await Article.create({
      slug: 'a-venir',
      status: 'published',
      publishedAt: DateTime.now().plus({ days: 7 }),
    })

    const response = await client
      .put(`/admin/articles/${article.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'titre-definitif',
        status: 'published',
        publishedAt: article.publishedAt!.toISO({ includeOffset: false })!.slice(0, 16),
        fr: { title: 'Titre', summary: '', contentMarkdown: 'Contenu' },
      })

    response.assertStatus(302)
    await article.refresh()
    assert.equal(article.slug, 'titre-definitif')
  })

  test('une catégorie inexistante est rejetée en 422', async ({ client }) => {
    const user = await admin()

    const response = await client
      .post('/admin/articles')
      .loginAs(user)
      .header('referrer', '/admin/articles/create')
      .withCsrfToken()
      .withInertia()
      .json({
        slug: 'avec-categorie',
        status: 'draft',
        categoryId: 9999,
        fr: { title: 'Titre', summary: '', contentMarkdown: 'Contenu' },
      })

    response.assertStatus(200)
    response.assertInertiaComponent('admin/articles/form')
  })

  test('créer un projet avec liens et technologie', async ({ client, assert }) => {
    const user = await admin()
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const response = await client
      .post('/admin/projects')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({
        slug: 'mon-projet',
        status: 'published',
        technologyIds: [technology.id],
        links: [{ label: 'GitHub', url: 'https://github.com/Drosscend/test', type: 'github' }],
        fr: { title: 'Mon projet', summary: '', contentMarkdown: '# Projet' },
      })

    response.assertStatus(302)
    const project = await Project.query()
      .where('slug', 'mon-projet')
      .preload('links')
      .preload('technologies')
      .firstOrFail()
    assert.lengthOf(project.links, 1)
    assert.lengthOf(project.technologies, 1)
    assert.isNotNull(project.publishedAt)
  })
})

test.group('Admin tableau de bord', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('le dashboard compte les contenus et tolère Umami absent', async ({ client, assert }) => {
    const user = await admin()
    await Article.create({ slug: 'publie', status: 'published' })
    await Article.create({ slug: 'brouillon', status: 'draft' })

    const response = await client.get('/admin').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('admin/dashboard')
    assert.equal(response.inertiaProps.stats.articlesPublished, 1)
    assert.equal(response.inertiaProps.stats.articlesDraft, 1)
    assert.isNull(
      response.inertiaProps.umami,
      'sans les variables UMAMI_API_*, la carte stats est masquée'
    )
  })
})

/**
 * The admin screens project their preloads down to the columns they
 * render; these tests pin the resulting props so a missing column can
 * never silently empty a field (an empty editor would overwrite the
 * stored content on the next save).
 */
test.group('Admin écrans de contenu', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('le formulaire article expose le contenu et ses relations', async ({ client, assert }) => {
    const user = await admin()
    const category = await Category.create({ slug: 'dev' })
    await category.related('translations').create({ locale: 'fr', name: 'Développement' })
    const tag = await Tag.create({ slug: 'adonisjs' })
    await tag.related('translations').create({ locale: 'fr', name: 'AdonisJS' })

    const article = await Article.create({
      slug: 'sujet',
      status: 'draft',
      categoryId: category.id,
    })
    await article.related('translations').create({
      locale: 'fr',
      title: 'Sujet',
      summary: 'Un résumé',
      contentMarkdown: '# Contenu source',
      contentHtml: '<h1>Contenu source</h1>',
    })
    await article.related('tags').sync([tag.id])

    const response = await client
      .get(`/admin/articles/${article.id}/edit`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('admin/articles/form')
    const props = response.inertiaProps
    assert.equal(props.article.fr.title, 'Sujet')
    assert.equal(props.article.fr.summary, 'Un résumé')
    assert.equal(props.article.fr.contentMarkdown, '# Contenu source')
    assert.deepEqual(props.article.tagIds, [tag.id])
    assert.deepEqual(props.options.categories, [{ id: category.id, name: 'Développement' }])
  })

  test('le formulaire projet expose le contenu et ses relations', async ({ client, assert }) => {
    const user = await admin()
    const technology = await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const project = await Project.create({ slug: 'mon-projet', status: 'draft' })
    await project.related('translations').create({
      locale: 'fr',
      title: 'Mon projet',
      summary: 'Un résumé',
      contentMarkdown: '# Contenu source',
      contentHtml: '<h1>Contenu source</h1>',
    })
    await project.related('technologies').sync([technology.id])

    const response = await client
      .get(`/admin/projects/${project.id}/edit`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    const props = response.inertiaProps
    assert.equal(props.project.fr.contentMarkdown, '# Contenu source')
    assert.equal(props.project.fr.summary, 'Un résumé')
    assert.deepEqual(props.project.technologyIds, [technology.id])
    assert.deepEqual(props.options.technologies, [{ id: technology.id, name: 'AdonisJS' }])
  })

  test('la liste des articles affiche titre et catégorie', async ({ client, assert }) => {
    const user = await admin()
    const category = await Category.create({ slug: 'dev' })
    await category.related('translations').create({ locale: 'fr', name: 'Développement' })

    const article = await Article.create({
      slug: 'sujet',
      status: 'draft',
      categoryId: category.id,
    })
    await article.related('translations').create({
      locale: 'fr',
      title: 'Sujet',
      summary: '',
      contentMarkdown: 'x',
      contentHtml: '<p>x</p>',
    })

    const response = await client.get('/admin/articles').loginAs(user).withInertia()

    response.assertStatus(200)
    const [row] = response.inertiaProps.articles
    assert.equal(row.title, 'Sujet')
    assert.equal(row.category, 'Développement')
    assert.isFalse(row.hasEnglish)
  })
})

test.group('Admin éditeur de pages', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('enregistrer le CV rend le HTML et vider efface', async ({ client, assert }) => {
    const user = await admin()

    const save = await client
      .put('/admin/pages')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ cvFr: '## Parcours', cvEn: '', legalFr: '', legalEn: '' })
    save.assertStatus(302)

    assert.include(await SettingsService.get('cv_html_fr'), '<h2 id="parcours">Parcours</h2>')

    const clear = await client
      .put('/admin/pages')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .form({ cvFr: '', cvEn: '', legalFr: '', legalEn: '' })
    clear.assertStatus(302)
    assert.equal(await SettingsService.get('cv_html_fr'), '')
  })
})
