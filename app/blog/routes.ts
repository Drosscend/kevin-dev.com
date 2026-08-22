import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/blog', [controllers.blog.ArticleList, 'render']).as('blog.index')
router.get('/blog/:slug', [controllers.blog.Article, 'render']).as('blog.show')
router.get('/en/blog', [controllers.blog.ArticleList, 'render']).as('en.blog.index')
router.get('/en/blog/:slug', [controllers.blog.Article, 'render']).as('en.blog.show')

router
  .group(() => {
    router.get('articles', [controllers.blog.ManageArticles, 'render']).as('admin.articles.index')
    router
      .get('articles/create', [controllers.blog.ArticleForm, 'render'])
      .as('admin.articles.create')
    router.post('articles', [controllers.blog.ArticleForm, 'execute']).as('admin.articles.store')
    router
      .get('articles/:id/edit', [controllers.blog.ArticleForm, 'render'])
      .as('admin.articles.edit')
    router
      .put('articles/:id', [controllers.blog.ArticleForm, 'execute'])
      .as('admin.articles.update')
    router
      .delete('articles/:id', [controllers.blog.DeleteArticle, 'execute'])
      .as('admin.articles.destroy')

    router
      .get('categories', [controllers.blog.ManageCategories, 'render'])
      .as('admin.categories.index')
    router
      .post('categories', [controllers.blog.SaveCategory, 'execute'])
      .as('admin.categories.store')
    router
      .put('categories/:id', [controllers.blog.SaveCategory, 'execute'])
      .as('admin.categories.update')
    router
      .delete('categories/:id', [controllers.blog.DeleteCategory, 'execute'])
      .as('admin.categories.destroy')
  })
  .prefix('/admin')
  .use(middleware.auth())
