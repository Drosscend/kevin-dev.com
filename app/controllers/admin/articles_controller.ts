import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import Category from '#models/category'
import Tag from '#models/tag'
import Media from '#models/media'
import ArticleService from '#services/article_service'
import MarkdownService from '#services/markdown_service'
import { articleValidator, previewValidator } from '#validators/blog'

async function formOptions() {
  const [categories, tags, media] = await Promise.all([
    Category.query().preload('translations').orderBy('slug'),
    Tag.query().preload('translations').orderBy('slug'),
    Media.query().orderBy('created_at', 'desc'),
  ])

  return {
    categories: categories.map((category) => ({ id: category.id, name: category.name('fr') })),
    tags: tags.map((tag) => ({ id: tag.id, name: tag.name('fr') })),
    media: media.map((item) => ({ id: item.id, alt: item.alt })),
  }
}

export default class ArticlesController {
  async index({ inertia }: HttpContext) {
    const articles = await Article.query()
      .preload('translations')
      .preload('category', (query) => query.preload('translations'))
      .orderBy('created_at', 'desc')

    return inertia.render('admin/articles/index', {
      articles: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.translation('fr')?.title ?? article.slug,
        hasEnglish: article.translation('en') !== undefined,
        status: article.status,
        publishedAt: article.publishedAt?.toISODate() ?? null,
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
    const payload = await request.validateUsing(articleValidator)

    const existing = await Article.findBy('slug', payload.slug)
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    const article = await ArticleService.save(new Article(), {
      slug: payload.slug,
      status: payload.status,
      categoryId: payload.categoryId ?? null,
      coverMediaId: payload.coverMediaId ?? null,
      tagIds: payload.tagIds ?? [],
      fr: { summary: '', ...payload.fr },
      en: payload.en ? { summary: '', ...payload.en } : null,
    })

    session.flash('success', 'Article enregistré')
    response.redirect().toRoute('admin.articles.edit', { id: article.id })
  }

  async edit({ params, inertia }: HttpContext) {
    const article = await Article.query()
      .where('id', params.id)
      .preload('translations')
      .preload('tags')
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
        tagIds: article.tags.map((tag) => tag.id),
        publishedAt: article.publishedAt?.toISODate() ?? null,
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
    const payload = await request.validateUsing(articleValidator)

    const existing = await Article.query()
      .where('slug', payload.slug)
      .whereNot('id', article.id)
      .first()
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    await ArticleService.save(article, {
      slug: payload.slug,
      status: payload.status,
      categoryId: payload.categoryId ?? null,
      coverMediaId: payload.coverMediaId ?? null,
      tagIds: payload.tagIds ?? [],
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

  /**
   * Renders Markdown through the same pipeline as the public site,
   * so the editor preview matches the final output.
   */
  async preview({ request, response }: HttpContext) {
    const { markdown } = await request.validateUsing(previewValidator)
    return response.json({ html: await MarkdownService.render(markdown) })
  }
}
