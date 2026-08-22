import app from '@adonisjs/core/services/app'
import Article from '#models/article'
import Project from '#models/project'
import ArticleService from '#services/article_service'
import ProjectService from '#services/project_service'
import { SaveTalk } from '#talks/actions/save_talk'
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

export function makeArticle(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions = {}
) {
  return ArticleService.save(new Article(), {
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

export function makeProject(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions = {}
) {
  return ProjectService.save(new Project(), {
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
