import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import Category from '#models/category'
import Tag from '#models/tag'
import Media from '#models/media'
import ArticleService from '#services/article_service'
import { articleValidator } from '#validators/blog'

async function formOptions() {
  const [categories, tags, media] = await Promise.all([
    Category.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'category_id', 'locale', 'name')
      )
      .orderBy('slug'),
    Tag.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'tag_id', 'locale', 'name')
      )
      .orderBy('slug'),
    Media.query()
      .withScopes((scopes) => scopes.images())
      .select('id', 'alt')
      .orderBy('created_at', 'desc'),
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
      .orderBy('created_at', 'desc')

    return inertia.render('admin/articles/index', {
      articles: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.translation('fr')?.title ?? article.slug,
        hasEnglish: article.translation('en') !== undefined,
        status: article.status,
        publishedAt: article.publishedAt?.toISODate() ?? null,
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
      tagIds: payload.tagIds ?? [],
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
      .preload('tags', (tags) => tags.select('id'))
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
        publishedAt: article.publishedAt?.toISO({ includeOffset: false })?.slice(0, 16) ?? null,
        slugLocked: article.slugLocked,
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
      meta: { id: article.id, lockedSlug: article.slugLocked ? article.slug : undefined },
    })

    await ArticleService.save(article, {
      slug: payload.slug,
      status: payload.status,
      categoryId: payload.categoryId ?? null,
      coverMediaId: payload.coverMediaId ?? null,
      tagIds: payload.tagIds ?? [],
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
