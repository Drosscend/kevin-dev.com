import app from '@adonisjs/core/services/app'
import { variantUrl } from '#app/shared/media_url'
import { MediaPickerQuery } from '#media/queries/media_picker_query'
import Article from '#models/article'
import Category from '#models/category'
import ArticleService from '#services/article_service'
import { longDate, pickerDateTime } from '#services/date_format'
import Technology from '#technologies/models/technology'
import { articleValidator } from '#validators/blog'
import type { HttpContext } from '@adonisjs/core/http'

async function formOptions() {
  const [categories, technologies, media] = await Promise.all([
    Category.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'category_id', 'locale', 'name')
      )
      .orderBy('slug'),
    Technology.query().select('id', 'name').orderBy('name'),
    app.container.make(MediaPickerQuery).then((query) => query.execute()),
  ])

  return {
    categories: categories.map((category) => ({ id: category.id, name: category.name('fr') })),
    technologies: technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
    })),
    media: media.map((item) => ({
      id: item.id,
      alt: item.alt,
      originalName: item.originalName,
      thumbnailUrl: variantUrl(item, 320),
    })),
  }
}

export default class ArticlesController {
  async index({ inertia }: HttpContext) {
    const articles = await Article.query()
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title')
      )
      .preload('category', (category) =>
        category
          .select('id', 'slug')
          .preload('translations', (translations) =>
            translations.select('id', 'category_id', 'locale', 'name')
          )
      )
      // Ordered by the date the list shows. Drafts carry none, so they
      // surface first, where the work waiting to be finished belongs.
      .orderByRaw('published_at desc nulls first')
      .orderBy('created_at', 'desc')

    return inertia.render('admin/articles/index', {
      articles: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.translation('fr')?.title ?? article.slug,
        hasEnglish: article.translation('en') !== undefined,
        status: article.status,
        publishedAt: longDate(article.publishedAt),
        scheduled: !article.isPublished && article.status === 'published',
        category: article.category?.name('fr') ?? null,
      })),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/articles/form', {
      article: null,
      options: await formOptions(),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(articleValidator, { meta: {} })

    const article = await ArticleService.save(new Article(), {
      slug: payload.slug,
      status: payload.status,
      categoryId: payload.categoryId ?? null,
      coverMediaId: payload.coverMediaId ?? null,
      technologyIds: payload.technologyIds ?? [],
      publishedAt: payload.publishedAt ?? null,
      fr: { summary: '', ...payload.fr },
      en: payload.en ? { summary: '', ...payload.en } : null,
    })

    session.flash('success', 'Article enregistré')
    response.redirect().toRoute('admin.articles.edit', { id: article.id })
  }

  async edit({ params, inertia }: HttpContext) {
    const article = await Article.query()
      .where('id', params.id)
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('technologies', (technologies) => technologies.select('id'))
      .firstOrFail()

    const fr = article.translation('fr')
    const en = article.translation('en')

    return inertia.render('admin/articles/form', {
      article: {
        id: article.id,
        slug: article.slug,
        status: article.status,
        categoryId: article.categoryId,
        coverMediaId: article.coverMediaId,
        technologyIds: article.technologies.map((technology) => technology.id),
        publishedAt: pickerDateTime(article.publishedAt),
        hasBeenOnline: article.hasBeenOnline,
        fr: {
          title: fr?.title ?? '',
          summary: fr?.summary ?? '',
          contentMarkdown: fr?.contentMarkdown ?? '',
        },
        en: en
          ? { title: en.title, summary: en.summary, contentMarkdown: en.contentMarkdown }
          : null,
      },
      options: await formOptions(),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    const payload = await request.validateUsing(articleValidator, {
      meta: { id: article.id, currentSlug: article.slug, wasOnline: article.hasBeenOnline },
    })

    await ArticleService.save(article, {
      slug: payload.slug,
      status: payload.status,
      categoryId: payload.categoryId ?? null,
      coverMediaId: payload.coverMediaId ?? null,
      technologyIds: payload.technologyIds ?? [],
      publishedAt: payload.publishedAt ?? null,
      fr: { summary: '', ...payload.fr },
      en: payload.en ? { summary: '', ...payload.en } : null,
    })

    session.flash('success', 'Article enregistré')
    response.redirect().toRoute('admin.articles.edit', { id: article.id })
  }

  async destroy({ params, response, session }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await article.delete()

    session.flash('success', 'Article supprimé')
    response.redirect().toRoute('admin.articles.index')
  }
}
