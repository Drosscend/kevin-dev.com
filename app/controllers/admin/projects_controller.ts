import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Technology from '#models/technology'
import Article from '#models/article'
import Media from '#models/media'
import ProjectService from '#services/project_service'
import { projectValidator } from '#validators/portfolio'

async function formOptions() {
  const [technologies, articles, media] = await Promise.all([
    Technology.query().select('id', 'name').orderBy('name'),
    Article.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title')
      )
      .orderBy('created_at', 'desc'),
    Media.query()
      .withScopes((scopes) => scopes.images())
      .select('id', 'alt')
      .orderBy('created_at', 'desc'),
  ])

  return {
    technologies: technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
    })),
    articles: articles.map((article) => ({
      id: article.id,
      title: article.translation('fr')?.title ?? article.slug,
    })),
    media: media.map((item) => ({ id: item.id, alt: item.alt })),
  }
}

function payloadFromRequest(payload: Awaited<ReturnType<typeof projectValidator.validate>>) {
  return {
    slug: payload.slug,
    status: payload.status,
    coverMediaId: payload.coverMediaId ?? null,
    startedAt: payload.startedAt ?? null,
    endedAt: payload.endedAt ?? null,
    featured: payload.featured ?? false,
    technologyIds: payload.technologyIds ?? [],
    articleIds: payload.articleIds ?? [],
    links: payload.links ?? [],
    publishedAt: payload.publishedAt ?? null,
    fr: { summary: '', ...payload.fr },
    en: payload.en ? { summary: '', ...payload.en } : null,
  }
}

export default class ProjectsController {
  async index({ inertia }: HttpContext) {
    const projects = await Project.query()
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title')
      )
      .withCount('technologies')
      .orderBy('created_at', 'desc')

    return inertia.render('admin/projects/index', {
      projects: projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.translation('fr')?.title ?? project.slug,
        hasEnglish: project.translation('en') !== undefined,
        status: project.status,
        featured: project.featured,
        publishedAt: project.publishedAt?.toISODate() ?? null,
        scheduled: !project.isPublished && project.status === 'published',
        technologiesCount: Number(project.$extras.technologies_count ?? 0),
      })),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/projects/form', {
      project: null,
      options: await formOptions(),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(projectValidator, { meta: {} })

    const project = await ProjectService.save(new Project(), payloadFromRequest(payload))

    session.flash('success', 'Projet enregistré')
    response.redirect().toRoute('admin.projects.edit', { id: project.id })
  }

  async edit({ params, inertia }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies', (technologies) => technologies.select('id'))
      .preload('articles', (articles) => articles.select('id'))
      .firstOrFail()

    const fr = project.translation('fr')
    const en = project.translation('en')

    return inertia.render('admin/projects/form', {
      project: {
        id: project.id,
        slug: project.slug,
        status: project.status,
        coverMediaId: project.coverMediaId,
        startedAt: project.startedAt?.toISODate() ?? null,
        endedAt: project.endedAt?.toISODate() ?? null,
        featured: project.featured,
        technologyIds: project.technologies.map((technology) => technology.id),
        articleIds: project.articles.map((article) => article.id),
        links: project.links.map((link) => ({
          label: link.label,
          url: link.url,
          type: link.type,
        })),
        publishedAt: project.publishedAt?.toISO({ includeOffset: false })?.slice(0, 16) ?? null,
        slugLocked: project.slugLocked,
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
    const project = await Project.findOrFail(params.id)
    const payload = await request.validateUsing(projectValidator, {
      meta: { id: project.id, lockedSlug: project.slugLocked ? project.slug : undefined },
    })

    await ProjectService.save(project, payloadFromRequest(payload))

    session.flash('success', 'Projet enregistré')
    response.redirect().toRoute('admin.projects.edit', { id: project.id })
  }

  async destroy({ params, response, session }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()

    session.flash('success', 'Projet supprimé')
    response.redirect().toRoute('admin.projects.index')
  }
}
