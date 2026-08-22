/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import '#app/seo/routes'
import '#app/blog/routes'
import '#app/contact/routes'
import '#app/media/routes'
import '#app/portfolio/routes'
import '#app/talks/routes'
import '#app/technologies/routes'
import '#app/identity/routes'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', [controllers.Home, 'handle']).as('home')
router.get('/en', [controllers.Home, 'handle']).as('en.home')

router.get('/health', [controllers.HealthChecks, 'handle']).as('health')

/**
 * Markdown endpoints for LLM consumers. Content pages get their .md
 * variant through the regular blog/portfolio controllers (a ".md"
 * slug suffix switches the response to the stored Markdown).
 */

/**
 * Public blog. French lives at the root, English under /en,
 * both served by the same controller (locale comes from the URL
 * prefix through the detect-user-locale middleware).
 */

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
