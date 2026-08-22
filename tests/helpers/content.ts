import Article from '#models/article'
import Project from '#models/project'
import Talk from '#models/talk'
import ArticleService from '#services/article_service'
import ProjectService from '#services/project_service'
import TalkService from '#services/talk_service'
import type { ContentTranslationPayload } from '#shared/content/content_fields'
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

export function makeTalk(
  slug: string,
  status: PublicationStatus = 'published',
  options: ContentOptions & { eventDate?: string } = {}
) {
  return TalkService.save(new Talk(), {
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
