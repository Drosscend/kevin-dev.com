import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router
  .get('/technologies', [controllers.technologies.TechnologyList, 'render'])
  .as('technologies.index')
router
  .get('/technologies/:slug', [controllers.technologies.Technology, 'render'])
  .as('technologies.show')
router
  .get('/en/technologies', [controllers.technologies.TechnologyList, 'render'])
  .as('en.technologies.index')
router
  .get('/en/technologies/:slug', [controllers.technologies.Technology, 'render'])
  .as('en.technologies.show')

router
  .group(() => {
    router
      .get('technologies', [controllers.technologies.ManageTechnologies, 'render'])
      .as('admin.technologies.index')
    router
      .post('technologies', [controllers.technologies.SaveTechnology, 'execute'])
      .as('admin.technologies.store')
    router
      .put('technologies/:id', [controllers.technologies.SaveTechnology, 'execute'])
      .as('admin.technologies.update')
    router
      .delete('technologies/:id', [controllers.technologies.DeleteTechnology, 'execute'])
      .as('admin.technologies.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
