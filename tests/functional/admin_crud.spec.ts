import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Category from '#models/category'
import Tag from '#models/tag'
import Technology from '#models/technology'
import Article from '#models/article'
import Project from '#models/project'
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
