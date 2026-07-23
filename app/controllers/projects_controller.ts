import { type DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import Project from '#models/project'
import MediaService from '#services/media_service'
import SeoService from '#services/seo_service'
import LlmsService, { MARKDOWN_CONTENT_TYPE } from '#services/llms_service'
import { localePath, type Locale } from '#types/i18n'

function formatDate(date: DateTime | null, locale: Locale) {
  return date?.setLocale(locale).toLocaleString({ month: 'long', year: 'numeric' }) ?? null
}

/**
 * Timespan shown on the listing: an open-ended project keeps only its
 * start, an undated one has no metadata line at all.
 */
function formatPeriod(project: Project, locale: Locale) {
  const startedAt = formatDate(project.startedAt, locale)
  const endedAt = formatDate(project.endedAt, locale)

  if (startedAt && endedAt) {
    return `${startedAt} - ${endedAt}`
  }
  return startedAt ?? endedAt
}

export default class ProjectsController {
  async index({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    const projects = await Project.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary')
      )
      .preload('cover')
      .preload('technologies')
      .orderBy('featured', 'desc')
      .orderBy('published_at', 'desc')

    return inertia.render('portfolio/index', {
      projects: projects.map((project) => {
        const translation = project.translation(locale)!
        return {
          slug: project.slug,
          title: translation.title,
          summary: translation.summary,
          coverUrl: MediaService.url(project.cover),
          period: formatPeriod(project, locale),
          technologies: project.technologies.map((technology) => ({
            slug: technology.slug,
            name: technology.name,
          })),
        }
      }),
      labels: {
        title: i18n.t('messages.portfolio.title'),
        empty: i18n.t('messages.portfolio.empty'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.portfolio.title'),
        description: i18n.t('messages.portfolio.metaDescription'),
        locale,
        path: localePath(locale, '/projects'),
        alternates: { fr: '/projects', en: '/en/projects' },
      }),
    })
  }

  async show({ params, inertia, auth, i18n, response }: HttpContext) {
    const locale = i18n.locale as Locale

    if (params.slug.endsWith('.md')) {
      const markdown = await LlmsService.projectMarkdown(params.slug.slice(0, -3), locale)
      if (!markdown) {
        return response.notFound('Not found')
      }
      response.header('content-type', MARKDOWN_CONTENT_TYPE)
      return markdown
    }

    const project = await Project.query()
      .where('slug', params.slug)
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .preload('articles', (articles) => {
        articles
          .withScopes((scopes) => scopes.published())
          .preload('translations', (translations) =>
            translations.select('id', 'article_id', 'locale', 'title')
          )
      })
      .firstOrFail()

    const translation = project.translation(locale)
    if (!translation) {
      throw new Exception('Not found', { status: 404 })
    }

    const isDraftPreview = !project.isPublished
    if (isDraftPreview && !auth.user) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('portfolio/show', {
      isDraftPreview,
      project: {
        slug: project.slug,
        title: translation.title,
        summary: translation.summary,
        contentHtml: translation.contentHtml,
        coverUrl: MediaService.url(project.cover),
        startedAt: formatDate(project.startedAt, locale),
        endedAt: formatDate(project.endedAt, locale),
        links: project.links.map((link) => ({
          label: link.label,
          url: link.url,
          type: link.type,
        })),
        technologies: project.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
        articles: project.articles
          .filter((article) => article.translation(locale) !== undefined)
          .map((article) => ({
            slug: article.slug,
            title: article.translation(locale)!.title,
          })),
      },
      hasOtherLocale: project.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      labels: {
        backToList: i18n.t('messages.portfolio.backToList'),
        draft: i18n.t('messages.blog.draft'),
        technologies: i18n.t('messages.portfolio.technologies'),
        relatedArticles: i18n.t('messages.portfolio.relatedArticles'),
        contents: i18n.t('messages.toc.title'),
      },
      meta: SeoService.build({
        title: translation.title,
        description: translation.summary || i18n.t('messages.portfolio.metaDescription'),
        locale,
        path: localePath(locale, `/projects/${project.slug}`),
        alternates:
          project.translation('en') !== undefined
            ? { fr: `/projects/${project.slug}`, en: `/en/projects/${project.slug}` }
            : null,
        ogType: 'article',
        ogImage: SeoService.mediaUrl(project.cover),
        jsonLd: [
          SeoService.breadcrumbs([
            {
              name: i18n.t('messages.portfolio.title'),
              path: localePath(locale, '/projects'),
            },
            {
              name: translation.title,
              path: localePath(locale, `/projects/${project.slug}`),
            },
          ]),
        ],
      }),
    })
  }
}
