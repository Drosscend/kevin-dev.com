import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', [controllers.pages.Home, 'render']).as('home')
router.get('/en', [controllers.pages.Home, 'render']).as('en.home')

router.get('/cv', [controllers.pages.Cv, 'render']).as('cv.show')
router.get('/en/cv', [controllers.pages.Cv, 'render']).as('en.cv.show')
router.get('/cv.pdf', [controllers.pages.CvPdf, 'execute']).as('cv.pdf')

router.get('/legal', [controllers.pages.Legal, 'render']).as('legal.show')
router.get('/en/legal', [controllers.pages.Legal, 'render']).as('en.legal.show')

router
  .group(() => {
    router.get('home', [controllers.pages.ManageHome, 'render']).as('admin.home.index')
    router.put('home', [controllers.pages.ManageHome, 'execute']).as('admin.home.update')

    router.get('timeline', [controllers.pages.ManageTimeline, 'render']).as('admin.timeline.index')
    router
      .post('timeline', [controllers.pages.ManageTimeline, 'execute'])
      .as('admin.timeline.store')
    router
      .put('timeline/:id', [controllers.pages.ManageTimeline, 'execute'])
      .as('admin.timeline.update')
    router
      .put('timeline/:id/move', [controllers.pages.MoveTimelineEntry, 'execute'])
      .as('admin.timeline.move')
    router
      .delete('timeline/:id', [controllers.pages.DeleteTimelineEntry, 'execute'])
      .as('admin.timeline.destroy')

    router.get('cv', [controllers.pages.ManageCv, 'render']).as('admin.cv.index')
    router.put('cv', [controllers.pages.ManageCv, 'execute']).as('admin.cv.update')
    router.post('cv/pdf', [controllers.pages.UploadCvPdf, 'execute']).as('admin.cv.pdf.store')

    router.get('legal', [controllers.pages.ManageLegal, 'render']).as('admin.legal.index')
    router.put('legal', [controllers.pages.ManageLegal, 'execute']).as('admin.legal.update')
  })
  .prefix('/admin')
  .use(middleware.auth())
