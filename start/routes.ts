/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import '#app/contact/routes'
import '#app/media/routes'
import '#app/identity/routes'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', [controllers.Home, 'handle']).as('home')
router.get('/en', [controllers.Home, 'handle']).as('en.home')

router.get('/health', [controllers.HealthChecks, 'handle']).as('health')

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

router.get('/cv', [controllers.Cv, 'show']).as('cv.show')
router.get('/en/cv', [controllers.Cv, 'show']).as('en.cv.show')
router.get('/cv.pdf', [controllers.Cv, 'pdf']).as('cv.pdf')

router.get('/legal', [controllers.Legal, 'show']).as('legal.show')
router.get('/en/legal', [controllers.Legal, 'show']).as('en.legal.show')

/**
 * Media library files (generated names, immutable).
 */

router
  .group(() => {
    router.get('/', [controllers.admin.Dashboard, 'handle']).as('admin.dashboard')

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

    /**
     * The site pages that are edited as a whole rather than as
     * entries: the homepage blocks, its career timeline, and the two
     * markdown pages.
     */
    router.get('home', [controllers.admin.Home, 'show']).as('admin.home.index')
    router.put('home', [controllers.admin.Home, 'update']).as('admin.home.update')

    router.get('timeline', [controllers.admin.Timeline, 'index']).as('admin.timeline.index')
    router.post('timeline', [controllers.admin.Timeline, 'store']).as('admin.timeline.store')
    router.put('timeline/:id', [controllers.admin.Timeline, 'update']).as('admin.timeline.update')
    router.put('timeline/:id/move', [controllers.admin.Timeline, 'move']).as('admin.timeline.move')
    router
      .delete('timeline/:id', [controllers.admin.Timeline, 'destroy'])
      .as('admin.timeline.destroy')

    router.get('cv', [controllers.admin.Cv, 'show']).as('admin.cv.index')
    router.put('cv', [controllers.admin.Cv, 'update']).as('admin.cv.update')
    router.post('cv/pdf', [controllers.admin.Cv, 'uploadPdf']).as('admin.cv.pdf.store')

    router.get('legal', [controllers.admin.Legal, 'show']).as('admin.legal.index')
    router.put('legal', [controllers.admin.Legal, 'update']).as('admin.legal.update')
  })
  .prefix('/admin')
  .use(middleware.auth())

/**
 * URLs of earlier versions of the site that search engines still rank.
 * Each line is meant to be deleted once its URL has dropped out of the
 * indexes, checked in the Search Console. Added on 2026-08-18.
 */
router.on('/assets/pdf/Véronési_Kévin_CV.pdf').redirectToPath('/cv.pdf', { status: 301 })
router.on('/pages_supp/mentions_légales/').redirectToPath('/legal', { status: 301 })
