import { test } from '@japa/runner'
import env from '#start/env'
import testUtils from '@adonisjs/core/services/test_utils'
import Technology from '#models/technology'
import { makeArticle } from '#tests/helpers/content'

test.group('SEO', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('le sitemap liste les contenus publiés dans les deux langues', async ({
    client,
    assert,
  }) => {
    await makeArticle('publie-fr', 'published')
    await makeArticle('publie-bilingue', 'published', { english: true })
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

  test('le sitemap liste les technologies sans leurs fiches', async ({ client, assert }) => {
    await Technology.create({ slug: 'adonisjs', name: 'AdonisJS' })

    const response = await client.get('/sitemap.xml')

    const xml = response.text()
    assert.include(xml, '/technologies</loc>')
    assert.notInclude(xml, '/technologies/adonisjs</loc>')
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

  test("le flux RSS est explorable mais hors de l'index", async ({ client }) => {
    const response = await client.get('/blog/rss.xml')

    response.assertStatus(200)
    response.assertHeader('x-robots-tag', 'noindex, follow')
  })

  test('le sous-domaine www redirige vers le domaine canonique', async ({ client, assert }) => {
    const canonical = new URL(env.get('APP_URL'))

    const response = await client
      .get('/blog?page=2')
      .header('host', `www.${canonical.hostname}`)
      .redirects(0)

    response.assertStatus(301)
    assert.equal(response.header('location'), `${canonical.origin}/blog?page=2`)
  })

  test('le flux RSS EN ne contient que les articles traduits', async ({ client, assert }) => {
    await makeArticle('fr-seul', 'published')
    await makeArticle('bilingue', 'published', { english: true })

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
    await makeArticle('article-meta', 'published', { english: true })

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

  test('le head SSR porte les alternates hreflang et reste bien formé', async ({
    client,
    assert,
  }) => {
    await makeArticle('bilingue-head', 'published', { english: true })

    const response = await client.get('/blog/bilingue-head')

    response.assertStatus(200)
    const head = response.text().split('</head>')[0]
    assert.include(head, '<link rel="alternate" hreflang="fr" href="')
    assert.include(head, '<link rel="alternate" hreflang="en" href="')
    assert.include(head, '<link rel="alternate" hreflang="x-default" href="')
    assert.include(head, '<meta property="og:title"')
    // Inertia serialises Head children itself: a fragment or a component
    // there leaks as an invalid tag that closes the head early.
    assert.notMatch(head, /<Symbol\(|<function/)
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
