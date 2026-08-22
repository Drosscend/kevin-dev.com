import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/uploads/:key/:file', [controllers.media.ServeMedia, 'execute']).as('uploads.show')

router
  .group(() => {
    router.get('media', [controllers.media.Media, 'render']).as('admin.media.index')
    router.post('media', [controllers.media.StoreMedia, 'execute']).as('admin.media.store')
    router.post('media/upload', [controllers.media.UploadImage, 'execute']).as('admin.media.upload')
    router.delete('media/:id', [controllers.media.DeleteMedia, 'execute']).as('admin.media.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
