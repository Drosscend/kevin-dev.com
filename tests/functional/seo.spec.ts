import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Article from '#models/article'
import ArticleService from '#services/article_service'

function makeArticle(slug: string, status: 'draft' | 'published', english = false) {
  return ArticleService.save(new Article(), {
    slug,
    status,
    categoryId: null,
    coverMediaId: null,
    tagIds: [],
    fr: { title: `Titre ${slug}`, summary: 'Résumé', contentMarkdown: '# Contenu' },
    en: english ? { title: `Title ${slug}`, summary: 'Summary', contentMarkdown: '# Body' } : null,
  })
}

test.group('SEO', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('le sitemap liste les contenus publiés dans les deux langues', async ({
    client,
    assert,
  }) => {
    await makeArticle('publie-fr', 'published')
    await makeArticle('publie-bilingue', 'published', true)
    await makeArticle('cache-brouillon', 'draft')

    const response = await client.get('/sitemap.xml')

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/xml; charset=utf-8')
    const xml = response.text()
    assert.include(xml, '/blog/publie-fr</loc>')
    assert.include(xml, '/blog/publie-bilingue</loc>')
    assert.include(xml, '/en/blog/publie-bilingue</loc>')
    assert.notInclude(xml, '/en/blog/publie-fr</loc>')
    assert.notInclude(xml, 'cache-brouillon')
    assert.include(xml, 'hreflang="en"')
  })

  test('le flux RSS FR contient les articles et pas les brouillons', async ({ client, assert }) => {
    await makeArticle('article-rss', 'published')
    await makeArticle('brouillon-rss', 'draft')

    const response = await client.get('/blog/rss.xml')

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/rss+xml; charset=utf-8')
    const xml = response.text()
    assert.include(xml, '<title>Titre article-rss</title>')
    assert.notInclude(xml, 'brouillon-rss')
    assert.include(xml, '<language>fr</language>')
  })

  test('le flux RSS EN ne contient que les articles traduits', async ({ client, assert }) => {
    await makeArticle('fr-seul', 'published')
    await makeArticle('bilingue', 'published', true)

    const response = await client.get('/en/blog/rss.xml')

    response.assertStatus(200)
    const xml = response.text()
    assert.include(xml, '<title>Title bilingue</title>')
    assert.notInclude(xml, 'fr-seul')
    assert.include(xml, '<language>en</language>')
  })

  test('robots.txt pointe vers le sitemap et bloque /admin', async ({ client, assert }) => {
    const response = await client.get('/robots.txt')

    response.assertStatus(200)
    const text = response.text()
    assert.include(text, 'Disallow: /admin')
    assert.include(text, 'Sitemap: ')
    assert.include(text, '/sitemap.xml')
  })

  test('les pages publiques exposent leurs métadonnées', async ({ client, assert }) => {
    await makeArticle('article-meta', 'published', true)

    const page = await client.get('/blog/article-meta').withInertia()
    page.assertStatus(200)
    const meta = page.inertiaProps.meta as {
      title: string
      canonical: string
      alternates: { fr: string; en: string | null } | null
      ogType: string
      jsonLd: Record<string, unknown>[]
    }
    assert.equal(meta.title, 'Titre article-meta')
    assert.include(meta.canonical, '/blog/article-meta')
    assert.include(meta.alternates!.en!, '/en/blog/article-meta')
    assert.equal(meta.ogType, 'article')
    assert.equal(meta.jsonLd[0]['@type'], 'Article')
    assert.equal(meta.jsonLd[1]['@type'], 'BreadcrumbList')
  })

  test("l'accueil liste les derniers articles avec ses métadonnées", async ({ client, assert }) => {
    await makeArticle('accueil-article', 'published')

    const response = await client.get('/').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('home')
    const articles = response.inertiaProps.latestArticles as { slug: string }[]
    assert.include(
      articles.map((article) => article.slug),
      'accueil-article'
    )
    const meta = response.inertiaProps.meta as { jsonLd: Record<string, unknown>[] }
    assert.equal(meta.jsonLd[0]['@type'], 'Person')
  })
})
