import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Article from '#models/article'
import User from '#models/user'
import ArticleService from '#services/article_service'

function makeArticle(
  slug: string,
  status: 'draft' | 'published',
  options: { english?: boolean } = {}
) {
  return ArticleService.save(new Article(), {
    slug,
    status,
    categoryId: null,
    coverMediaId: null,
    tagIds: [],
    fr: {
      title: `Titre ${slug}`,
      summary: 'Résumé de test',
      contentMarkdown: '# Bonjour\n\nContenu **français**.',
    },
    en: options.english
      ? { title: `Title ${slug}`, summary: 'Test summary', contentMarkdown: '# Hello' }
      : null,
  })
}

test.group('Blog public', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('la liste FR montre les articles publiés', async ({ client, assert }) => {
    await makeArticle('article-publie', 'published')
    await makeArticle('article-brouillon', 'draft')

    const response = await client.get('/blog').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('blog/index')
    const articles = response.inertiaProps.articles as { slug: string }[]
    const slugs = articles.map((article) => article.slug)
    assert.include(slugs, 'article-publie')
    assert.notInclude(slugs, 'article-brouillon')
  })

  test('la liste EN ne montre que les articles traduits', async ({ client, assert }) => {
    await makeArticle('fr-seulement', 'published')
    await makeArticle('fr-et-en', 'published', { english: true })

    const response = await client.get('/en/blog').withInertia()

    response.assertStatus(200)
    const articles = response.inertiaProps.articles as { slug: string; title: string }[]
    assert.deepEqual(
      articles.map((article) => article.slug),
      ['fr-et-en']
    )
    assert.equal(articles[0].title, 'Title fr-et-en')
  })

  test('la page article rend le HTML pré-rendu', async ({ client, assert }) => {
    await makeArticle('mon-article', 'published')

    const response = await client.get('/blog/mon-article').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('blog/show')
    const article = response.inertiaProps.article as { contentHtml: string }
    assert.include(article.contentHtml, '<h1 id="bonjour">Bonjour</h1>')
  })

  test('un brouillon est introuvable pour un visiteur', async ({ client }) => {
    await makeArticle('brouillon-secret', 'draft')

    const response = await client.get('/blog/brouillon-secret')
    response.assertStatus(404)
  })

  test('un brouillon est prévisualisable connecté', async ({ client }) => {
    const user = await User.create({ email: 'admin@example.com', password: 'motdepasse' })
    await makeArticle('brouillon-secret', 'draft')

    const response = await client.get('/blog/brouillon-secret').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('blog/show')
    response.assertInertiaPropsContains({ isDraftPreview: true })
  })

  test('publishedAt est figé à la première publication', async ({ assert }) => {
    const article = await makeArticle('mon-article', 'published')
    const firstPublishedAt = article.publishedAt!.toISO()

    await ArticleService.save(article, {
      slug: 'mon-article',
      status: 'draft',
      categoryId: null,
      coverMediaId: null,
      tagIds: [],
      fr: { title: 'Titre', summary: '', contentMarkdown: 'Contenu' },
      en: null,
    })
    await ArticleService.save(article, {
      slug: 'mon-article',
      status: 'published',
      categoryId: null,
      coverMediaId: null,
      tagIds: [],
      fr: { title: 'Titre', summary: '', contentMarkdown: 'Contenu' },
      en: null,
    })

    assert.equal(article.publishedAt!.toISO(), firstPublishedAt)
  })
})
