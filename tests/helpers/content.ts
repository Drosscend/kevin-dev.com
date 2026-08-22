import app from '@adonisjs/core/services/app'
import { SaveArticle } from '#blog/actions/save_article'
import { SaveProject } from '#portfolio/actions/save_project'
import { SaveTalk } from '#talks/actions/save_talk'
import type { ArticlePayload } from '#blog/repositories/article_repository'
import type { ProjectPayload } from '#portfolio/repositories/project_repository'
import type { ContentTranslationPayload } from '#shared/content/content_fields'
import type { TalkPayload } from '#talks/repositories/talk_repository'
import type { PublicationStatus } from '#types/content'

type Translation = Partial<ContentTranslationPayload>

/**
 * Options shared by the three factories. `english` accepts `true` for
 * the default English translation or an object overriding parts of it;
 * `fr` overrides parts of the French one.
 */
type ContentOptions = {
  english?: boolean | Translation
  fr?: Translation
  technologyIds?: number[]
  links?: boolean
}

function english(option: boolean | Translation | undefined, defaults: ContentTranslationPayload) {
  if (!option) return null
  return option === true ? defaults : { ...defaults, ...option }
}

async function saveArticle(payload: ArticlePayload) {
  const action = await app.container.make(SaveArticle)
  const result = await action.execute({ payload })

  if (!result.ok) {
    throw new Error('Unable to save the article fixture')
  }

  return result.value
}

export function makeArticle(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions = {}
) {
  return saveArticle({
    slug,
    status,
    categoryId: null,
    coverMediaId: null,
    technologyIds: options.technologyIds ?? [],
    fr: {
      title: `Titre ${slug}`,
      summary: 'Résumé de test',
      contentMarkdown: '# Bonjour\n\nContenu **français**.',
      ...options.fr,
    },
    en: english(options.english, {
      title: `Title ${slug}`,
      summary: 'Test summary',
      contentMarkdown: '# Hello',
    }),
  })
}

async function saveProject(payload: ProjectPayload) {
  const action = await app.container.make(SaveProject)
  const result = await action.execute({ payload })

  if (!result.ok) {
    throw new Error('Unable to save the project fixture')
  }

  return result.value
}

export function makeProject(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions = {}
) {
  return saveProject({
    slug,
    status,
    coverMediaId: null,
    startedAt: '2024-01-01',
    endedAt: null,
    featured: false,
    technologyIds: options.technologyIds ?? [],
    articleIds: [],
    links: options.links
      ? [{ label: 'GitHub', url: 'https://github.com/Drosscend/test', type: 'github' }]
      : [],
    fr: {
      title: `Projet ${slug}`,
      summary: 'Résumé du projet',
      contentMarkdown: '# Présentation\n\nContenu **français**.',
      ...options.fr,
    },
    en: english(options.english, {
      title: `Project ${slug}`,
      summary: 'Summary',
      contentMarkdown: '# About',
    }),
  })
}

async function saveTalk(payload: TalkPayload) {
  const action = await app.container.make(SaveTalk)
  const result = await action.execute({ payload })

  if (!result.ok) {
    throw new Error('Unable to save the talk fixture')
  }

  return result.value
}

export function makeTalk(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions & { eventDate?: string } = {}
) {
  return saveTalk({
    slug,
    status,
    coverMediaId: null,
    eventDate: options.eventDate ?? '2025-06-01',
    eventName: 'DevFest Lyon',
    city: 'Lyon',
    technologyIds: options.technologyIds ?? [],
    links: options.links
      ? [{ label: 'Slides', url: 'https://slides.example.com/talk', type: 'slides' }]
      : [],
    fr: {
      title: `Intervention ${slug}`,
      summary: 'Résumé de l’intervention',
      contentMarkdown: '# Présentation\n\nContenu **français**.',
      ...options.fr,
    },
    en: english(options.english, {
      title: `Talk ${slug}`,
      summary: 'Summary',
      contentMarkdown: '# About',
    }),
  })
}
