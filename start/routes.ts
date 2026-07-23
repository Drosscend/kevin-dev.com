/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { contactThrottle, loginThrottle } from '#start/limiter'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'handle']).as('home')
router.get('/en', [controllers.Home, 'handle']).as('en.home')

router.get('/health', [controllers.HealthChecks, 'handle']).as('health')

/**
 * Crawling endpoints: sitemap with hreflang alternates, per-locale
 * RSS feeds and robots.txt.
 */
router.get('/sitemap.xml', [controllers.Seo, 'sitemap']).as('seo.sitemap')
router.get('/robots.txt', [controllers.Seo, 'robots']).as('seo.robots')
router.get('/.well-known/security.txt', [controllers.Seo, 'securityTxt']).as('seo.security')
router.get('/blog/rss.xml', [controllers.Seo, 'rss']).as('seo.rss')
router.get('/en/blog/rss.xml', [controllers.Seo, 'rss']).as('en.seo.rss')

/**
 * Markdown endpoints for LLM consumers. Content pages get their .md
 * variant through the regular blog/portfolio controllers (a ".md"
 * slug suffix switches the response to the stored Markdown).
 */
router.get('/llms.txt', [controllers.Llms, 'index']).as('llms.index')
router.get('/cv.md', [controllers.Llms, 'cv']).as('llms.cv')
router.get('/en/cv.md', [controllers.Llms, 'cv']).as('en.llms.cv')
router.get('/legal.md', [controllers.Llms, 'legal']).as('llms.legal')
router.get('/en/legal.md', [controllers.Llms, 'legal']).as('en.llms.legal')

/**
 * Public blog. French lives at the root, English under /en,
 * both served by the same controller (locale comes from the URL
 * prefix through the detect-user-locale middleware).
 */
router.get('/blog', [controllers.Blog, 'index']).as('blog.index')
router.get('/blog/:slug', [controllers.Blog, 'show']).as('blog.show')
router.get('/en/blog', [controllers.Blog, 'index']).as('en.blog.index')
router.get('/en/blog/:slug', [controllers.Blog, 'show']).as('en.blog.show')

/**
 * Public portfolio and technologies, same locale scheme as the blog.
 */
router.get('/projects', [controllers.Projects, 'index']).as('projects.index')
router.get('/projects/:slug', [controllers.Projects, 'show']).as('projects.show')
router.get('/en/projects', [controllers.Projects, 'index']).as('en.projects.index')
router.get('/en/projects/:slug', [controllers.Projects, 'show']).as('en.projects.show')

router.get('/talks', [controllers.Talks, 'index']).as('talks.index')
router.get('/talks/:slug', [controllers.Talks, 'show']).as('talks.show')
router.get('/en/talks', [controllers.Talks, 'index']).as('en.talks.index')
router.get('/en/talks/:slug', [controllers.Talks, 'show']).as('en.talks.show')

router.get('/technologies', [controllers.Technologies, 'index']).as('technologies.index')
router.get('/technologies/:slug', [controllers.Technologies, 'show']).as('technologies.show')
router.get('/en/technologies', [controllers.Technologies, 'index']).as('en.technologies.index')
router.get('/en/technologies/:slug', [controllers.Technologies, 'show']).as('en.technologies.show')

/**
 * CV (settings-backed page + downloadable PDF), legal notice and
 * contact form, same locale scheme as the blog.
 */
router.get('/cv', [controllers.Cv, 'show']).as('cv.show')
router.get('/en/cv', [controllers.Cv, 'show']).as('en.cv.show')
router.get('/cv.pdf', [controllers.Cv, 'pdf']).as('cv.pdf')

router.get('/legal', [controllers.Legal, 'show']).as('legal.show')
router.get('/en/legal', [controllers.Legal, 'show']).as('en.legal.show')

router.get('/contact', [controllers.Contact, 'show']).as('contact.show')
router.post('/contact', [controllers.Contact, 'store']).as('contact.store').use(contactThrottle)
router.get('/en/contact', [controllers.Contact, 'show']).as('en.contact.show')
router
  .post('/en/contact', [controllers.Contact, 'store'])
  .as('en.contact.store')
  .use(contactThrottle)

/**
 * Media library files (generated names, immutable).
 */
router.get('/uploads/:key/:file', [controllers.Uploads, 'show']).as('uploads.show')

/**
 * Two-step admin login (password then TOTP).
 */
router
  .group(() => {
    router.get('login', [controllers.admin.Session, 'create']).as('admin.login')
    router
      .post('login', [controllers.admin.Session, 'store'])
      .as('admin.login.store')
      .use(loginThrottle)

    router.get('login/verify', [controllers.admin.Session, 'totpCreate']).as('admin.totp')
    router
      .post('login/verify', [controllers.admin.Session, 'totpStore'])
      .as('admin.totp.store')
      .use(loginThrottle)
  })
  .prefix('/admin')
  .use(middleware.guest())

/**
 * Administration (authenticated session required).
 */
router
  .group(() => {
    router.get('/', [controllers.admin.Dashboard, 'handle']).as('admin.dashboard')
    router.post('logout', [controllers.admin.Session, 'destroy']).as('admin.logout')

    router.get('home', [controllers.admin.Home, 'show']).as('admin.home.index')
    router.put('home', [controllers.admin.Home, 'update']).as('admin.home.update')
    router
      .post('home/timeline', [controllers.admin.Home, 'timelineStore'])
      .as('admin.home.timeline.store')
    router
      .put('home/timeline/:id', [controllers.admin.Home, 'timelineUpdate'])
      .as('admin.home.timeline.update')
    router
      .put('home/timeline/:id/move', [controllers.admin.Home, 'timelineMove'])
      .as('admin.home.timeline.move')
    router
      .delete('home/timeline/:id', [controllers.admin.Home, 'timelineDestroy'])
      .as('admin.home.timeline.destroy')

    router.get('security', [controllers.admin.Security, 'show']).as('admin.security')
    router.post('security', [controllers.admin.Security, 'store']).as('admin.security.store')
    router.delete('security', [controllers.admin.Security, 'destroy']).as('admin.security.destroy')
    router
      .post('security/recovery', [controllers.admin.Security, 'regenerateRecovery'])
      .as('admin.security.recovery.store')

    router.get('media', [controllers.admin.Media, 'index']).as('admin.media.index')
    router.post('media', [controllers.admin.Media, 'store']).as('admin.media.store')
    router.post('media/upload', [controllers.admin.Media, 'upload']).as('admin.media.upload')
    router.delete('media/:id', [controllers.admin.Media, 'destroy']).as('admin.media.destroy')

    router.get('categories', [controllers.admin.Categories, 'index']).as('admin.categories.index')
    router.post('categories', [controllers.admin.Categories, 'store']).as('admin.categories.store')
    router
      .put('categories/:id', [controllers.admin.Categories, 'update'])
      .as('admin.categories.update')
    router
      .delete('categories/:id', [controllers.admin.Categories, 'destroy'])
      .as('admin.categories.destroy')

    router.get('articles', [controllers.admin.Articles, 'index']).as('admin.articles.index')
    router
      .get('articles/create', [controllers.admin.Articles, 'create'])
      .as('admin.articles.create')
    router.post('articles', [controllers.admin.Articles, 'store']).as('admin.articles.store')
    router.get('articles/:id/edit', [controllers.admin.Articles, 'edit']).as('admin.articles.edit')
    router.put('articles/:id', [controllers.admin.Articles, 'update']).as('admin.articles.update')
    router
      .delete('articles/:id', [controllers.admin.Articles, 'destroy'])
      .as('admin.articles.destroy')

    router
      .get('technologies', [controllers.admin.Technologies, 'index'])
      .as('admin.technologies.index')
    router
      .post('technologies', [controllers.admin.Technologies, 'store'])
      .as('admin.technologies.store')
    router
      .put('technologies/:id', [controllers.admin.Technologies, 'update'])
      .as('admin.technologies.update')
    router
      .delete('technologies/:id', [controllers.admin.Technologies, 'destroy'])
      .as('admin.technologies.destroy')

    router.get('projects', [controllers.admin.Projects, 'index']).as('admin.projects.index')
    router
      .get('projects/create', [controllers.admin.Projects, 'create'])
      .as('admin.projects.create')
    router.post('projects', [controllers.admin.Projects, 'store']).as('admin.projects.store')
    router.get('projects/:id/edit', [controllers.admin.Projects, 'edit']).as('admin.projects.edit')
    router.put('projects/:id', [controllers.admin.Projects, 'update']).as('admin.projects.update')
    router
      .delete('projects/:id', [controllers.admin.Projects, 'destroy'])
      .as('admin.projects.destroy')

    router.get('talks', [controllers.admin.Talks, 'index']).as('admin.talks.index')
    router.get('talks/create', [controllers.admin.Talks, 'create']).as('admin.talks.create')
    router.post('talks', [controllers.admin.Talks, 'store']).as('admin.talks.store')
    router.get('talks/:id/edit', [controllers.admin.Talks, 'edit']).as('admin.talks.edit')
    router.put('talks/:id', [controllers.admin.Talks, 'update']).as('admin.talks.update')
    router.delete('talks/:id', [controllers.admin.Talks, 'destroy']).as('admin.talks.destroy')

    router.get('pages', [controllers.admin.Pages, 'show']).as('admin.pages.index')
    router.put('pages', [controllers.admin.Pages, 'update']).as('admin.pages.update')
    router.post('pages/cv-pdf', [controllers.admin.Pages, 'uploadPdf']).as('admin.pages.pdf.store')

    router.get('messages', [controllers.admin.Messages, 'index']).as('admin.messages.index')
    router
      .put('messages/:id/read', [controllers.admin.Messages, 'toggleRead'])
      .as('admin.messages.read')
    router
      .delete('messages/:id', [controllers.admin.Messages, 'destroy'])
      .as('admin.messages.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
