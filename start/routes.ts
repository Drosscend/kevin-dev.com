/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { loginThrottle } from '#start/limiter'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')
router.on('/en').renderInertia('home', {}).as('en.home')

router.get('/health', [controllers.HealthChecks, 'handle']).as('health')

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
router.get('/projets', [controllers.Projects, 'index']).as('projects.index')
router.get('/projets/:slug', [controllers.Projects, 'show']).as('projects.show')
router.get('/en/projets', [controllers.Projects, 'index']).as('en.projects.index')
router.get('/en/projets/:slug', [controllers.Projects, 'show']).as('en.projects.show')

router.get('/technologies', [controllers.Technologies, 'index']).as('technologies.index')
router.get('/technologies/:slug', [controllers.Technologies, 'show']).as('technologies.show')
router.get('/en/technologies', [controllers.Technologies, 'index']).as('en.technologies.index')
router.get('/en/technologies/:slug', [controllers.Technologies, 'show']).as('en.technologies.show')

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

    router.get('security', [controllers.admin.Security, 'show']).as('admin.security')
    router.post('security', [controllers.admin.Security, 'store']).as('admin.security.store')
    router.delete('security', [controllers.admin.Security, 'destroy']).as('admin.security.destroy')

    router.get('media', [controllers.admin.Media, 'index']).as('admin.media.index')
    router.post('media', [controllers.admin.Media, 'store']).as('admin.media.store')
    router.delete('media/:id', [controllers.admin.Media, 'destroy']).as('admin.media.destroy')

    router.get('categories', [controllers.admin.Categories, 'index']).as('admin.categories.index')
    router.post('categories', [controllers.admin.Categories, 'store']).as('admin.categories.store')
    router
      .put('categories/:id', [controllers.admin.Categories, 'update'])
      .as('admin.categories.update')
    router
      .delete('categories/:id', [controllers.admin.Categories, 'destroy'])
      .as('admin.categories.destroy')

    router.get('tags', [controllers.admin.Tags, 'index']).as('admin.tags.index')
    router.post('tags', [controllers.admin.Tags, 'store']).as('admin.tags.store')
    router.put('tags/:id', [controllers.admin.Tags, 'update']).as('admin.tags.update')
    router.delete('tags/:id', [controllers.admin.Tags, 'destroy']).as('admin.tags.destroy')

    router.get('articles', [controllers.admin.Articles, 'index']).as('admin.articles.index')
    router
      .get('articles/create', [controllers.admin.Articles, 'create'])
      .as('admin.articles.create')
    router.post('articles', [controllers.admin.Articles, 'store']).as('admin.articles.store')
    router
      .post('articles/preview', [controllers.admin.Articles, 'preview'])
      .as('admin.articles.preview')
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
  })
  .prefix('/admin')
  .use(middleware.auth())
