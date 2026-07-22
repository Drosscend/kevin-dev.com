import Article from '#models/article'
import Project from '#models/project'
import Talk from '#models/talk'
import SettingsService from '#services/settings_service'
import SeoService from '#services/seo_service'
import { localePath, type Locale } from '#types/i18n'

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8'

/**
 * Builds the Markdown representations served to LLM consumers:
 * the /llms.txt index and the .md variant of every content page
 * (raw stored Markdown with a small metadata header).
 */
export default class LlmsService {
  static async index() {
    const [articles, projects, talks, settings] = await Promise.all([
      Article.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) =>
          query.select('id', 'article_id', 'locale', 'title', 'summary')
        )
        .orderBy('published_at', 'desc'),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) =>
          query.select('id', 'project_id', 'locale', 'title', 'summary')
        )
        .orderBy('published_at', 'desc'),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) =>
          query.select('id', 'talk_id', 'locale', 'title', 'summary')
        )
        .orderBy('event_date', 'desc'),
      SettingsService.getMany(['cv_markdown_fr', 'legal_markdown_fr']),
    ])

    const lines: string[] = [
      '# kevin-dev.com',
      '',
      '> Site personnel de Kévin Véronési : blog technique (AdonisJS, React, auto-hébergement), portfolio de projets et CV. Contenu principal en français, certaines pages traduites en anglais sous /en.',
      '',
      'Chaque page de contenu existe en variante Markdown : ajoutez `.md` au chemin.',
      '',
      '## Blog',
      '',
    ]

    for (const article of articles) {
      const fr = article.translations.find((translation) => translation.locale === 'fr')
      if (!fr) {
        continue
      }
      const summary = fr.summary ? `: ${fr.summary}` : ''
      lines.push(`- [${fr.title}](${SeoService.absolute(`/blog/${article.slug}.md`)})${summary}`)
      const en = article.translations.find((translation) => translation.locale === 'en')
      if (en) {
        lines.push(`- [${en.title} (EN)](${SeoService.absolute(`/en/blog/${article.slug}.md`)})`)
      }
    }

    lines.push('', '## Projets', '')
    for (const project of projects) {
      const fr = project.translations.find((translation) => translation.locale === 'fr')
      if (!fr) {
        continue
      }
      const summary = fr.summary ? `: ${fr.summary}` : ''
      lines.push(
        `- [${fr.title}](${SeoService.absolute(`/projects/${project.slug}.md`)})${summary}`
      )
    }

    lines.push('', '## Interventions', '')
    for (const talk of talks) {
      const fr = talk.translations.find((translation) => translation.locale === 'fr')
      if (!fr) {
        continue
      }
      const context = `${talk.eventName}, ${talk.eventDate.toISODate()}`
      lines.push(`- [${fr.title}](${SeoService.absolute(`/talks/${talk.slug}.md`)}) — ${context}`)
    }

    lines.push('', '## Pages', '')
    if (settings.cv_markdown_fr) {
      lines.push(`- [CV](${SeoService.absolute('/cv.md')})`)
    }
    if (settings.legal_markdown_fr) {
      lines.push(`- [Mentions légales](${SeoService.absolute('/legal.md')})`)
    }
    lines.push(`- [Flux RSS du blog](${SeoService.absolute('/blog/rss.xml')})`)

    return lines.join('\n') + '\n'
  }

  static async articleMarkdown(slug: string, locale: Locale) {
    const article = await Article.query()
      .where('slug', slug)
      .withScopes((scopes) => scopes.published())
      .preload('translations')
      .preload('category', (category) => category.preload('translations'))
      .preload('tags', (tags) => tags.preload('translations'))
      .first()

    const translation = article?.translation(locale)
    if (!article || !translation) {
      return null
    }

    const header = [
      `# ${translation.title}`,
      '',
      ...(translation.summary ? [`> ${translation.summary}`, ''] : []),
      `- URL : ${SeoService.absolute(localePath(locale, `/blog/${article.slug}`))}`,
      ...(article.publishedAt ? [`- Publié : ${article.publishedAt.toISODate()}`] : []),
      ...(article.category ? [`- Catégorie : ${article.category.name(locale)}`] : []),
      ...(article.tags.length > 0
        ? [`- Tags : ${article.tags.map((tag) => tag.name(locale)).join(', ')}`]
        : []),
      '',
      '---',
      '',
    ]

    return header.join('\n') + translation.contentMarkdown + '\n'
  }

  static async projectMarkdown(slug: string, locale: Locale) {
    const project = await Project.query()
      .where('slug', slug)
      .withScopes((scopes) => scopes.published())
      .preload('translations')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .first()

    const translation = project?.translation(locale)
    if (!project || !translation) {
      return null
    }

    const header = [
      `# ${translation.title}`,
      '',
      ...(translation.summary ? [`> ${translation.summary}`, ''] : []),
      `- URL : ${SeoService.absolute(localePath(locale, `/projects/${project.slug}`))}`,
      ...(project.technologies.length > 0
        ? [`- Technologies : ${project.technologies.map((item) => item.name).join(', ')}`]
        : []),
      ...project.links.map((link) => `- ${link.label} : ${link.url}`),
      '',
      '---',
      '',
    ]

    return header.join('\n') + translation.contentMarkdown + '\n'
  }

  static async talkMarkdown(slug: string, locale: Locale) {
    const talk = await Talk.query()
      .where('slug', slug)
      .withScopes((scopes) => scopes.published())
      .preload('translations')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .first()

    const translation = talk?.translation(locale)
    if (!talk || !translation) {
      return null
    }

    const header = [
      `# ${translation.title}`,
      '',
      ...(translation.summary ? [`> ${translation.summary}`, ''] : []),
      `- URL : ${SeoService.absolute(localePath(locale, `/talks/${talk.slug}`))}`,
      `- Événement : ${talk.eventName}${talk.city ? ` (${talk.city})` : ''}`,
      `- Date : ${talk.eventDate.toISODate()}`,
      ...(talk.technologies.length > 0
        ? [`- Technologies : ${talk.technologies.map((item) => item.name).join(', ')}`]
        : []),
      ...talk.links.map((link) => `- ${link.label} : ${link.url}`),
      '',
      '---',
      '',
    ]

    return header.join('\n') + translation.contentMarkdown + '\n'
  }

  static async settingsMarkdown(prefix: 'cv' | 'legal', locale: Locale) {
    const settings = await SettingsService.getMany([
      `${prefix}_markdown_fr`,
      `${prefix}_markdown_en`,
    ])
    const markdown =
      locale === 'en' ? settings[`${prefix}_markdown_en`] : settings[`${prefix}_markdown_fr`]
    return markdown ? markdown + '\n' : null
  }
}
