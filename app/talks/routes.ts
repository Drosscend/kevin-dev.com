import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/talks', [controllers.talks.TalkList, 'render']).as('talks.index')
router.get('/talks/:slug', [controllers.talks.Talk, 'render']).as('talks.show')
router.get('/en/talks', [controllers.talks.TalkList, 'render']).as('en.talks.index')
router.get('/en/talks/:slug', [controllers.talks.Talk, 'render']).as('en.talks.show')

router
  .group(() => {
    router.get('talks', [controllers.talks.ManageTalks, 'render']).as('admin.talks.index')
    router.get('talks/create', [controllers.talks.TalkForm, 'render']).as('admin.talks.create')
    router.post('talks', [controllers.talks.TalkForm, 'execute']).as('admin.talks.store')
    router.get('talks/:id/edit', [controllers.talks.TalkForm, 'render']).as('admin.talks.edit')
    router.put('talks/:id', [controllers.talks.TalkForm, 'execute']).as('admin.talks.update')
    router.delete('talks/:id', [controllers.talks.DeleteTalk, 'execute']).as('admin.talks.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
