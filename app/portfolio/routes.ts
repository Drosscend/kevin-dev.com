import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/projects', [controllers.portfolio.ProjectList, 'render']).as('projects.index')
router.get('/projects/:slug', [controllers.portfolio.Project, 'render']).as('projects.show')
router.get('/en/projects', [controllers.portfolio.ProjectList, 'render']).as('en.projects.index')
router.get('/en/projects/:slug', [controllers.portfolio.Project, 'render']).as('en.projects.show')

router
  .group(() => {
    router
      .get('projects', [controllers.portfolio.ManageProjects, 'render'])
      .as('admin.projects.index')
    router
      .get('projects/create', [controllers.portfolio.ProjectForm, 'render'])
      .as('admin.projects.create')
    router
      .post('projects', [controllers.portfolio.ProjectForm, 'execute'])
      .as('admin.projects.store')
    router
      .get('projects/:id/edit', [controllers.portfolio.ProjectForm, 'render'])
      .as('admin.projects.edit')
    router
      .put('projects/:id', [controllers.portfolio.ProjectForm, 'execute'])
      .as('admin.projects.update')
    router
      .delete('projects/:id', [controllers.portfolio.DeleteProject, 'execute'])
      .as('admin.projects.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
