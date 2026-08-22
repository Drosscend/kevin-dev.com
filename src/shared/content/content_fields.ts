import { DateTime } from 'luxon'
import Markdown from '#shared/content/markdown'
import type { PublicationStatus } from '#types/content'

export interface ContentTranslationPayload {
  title: string
  summary: string
  contentMarkdown: string
}

/** What articles, projects and talks share, as the form sends it. */
export interface ContentPayload {
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  publishedAt?: string | null
  fr: ContentTranslationPayload
  en: ContentTranslationPayload | null
}

interface ContentEntry {
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  readingTime: number
  publishedAt: DateTime | null
}

interface LinksRelation<Link> {
  query(): { delete(): Promise<unknown> }
  createMany(rows: (Link & { position: number })[]): Promise<unknown>
}

/**
 * Renders both locales up front, so no markdown work happens inside
 * the transaction that saves the entry.
 */
export async function renderTranslations(payload: ContentPayload) {
  return {
    fr: { ...payload.fr, contentHtml: await Markdown.render(payload.fr.contentMarkdown) },
    en: payload.en
      ? { ...payload.en, contentHtml: await Markdown.render(payload.en.contentMarkdown) }
      : null,
  }
}

/**
 * Applies the shared fields of a content entry. Reading time comes
 * from the French markdown. An explicit publication date wins (future
 * = scheduled); otherwise the date is stamped on the first publication.
 */
export function applyContentFields(entry: ContentEntry, payload: ContentPayload) {
  entry.slug = payload.slug
  entry.coverMediaId = payload.coverMediaId
  entry.readingTime = Markdown.readingTime(payload.fr.contentMarkdown)

  if (payload.publishedAt) {
    entry.publishedAt = DateTime.fromISO(payload.publishedAt)
  } else if (payload.status === 'published' && !entry.publishedAt) {
    entry.publishedAt = DateTime.now()
  }
  entry.status = payload.status
}

/** External links are replaced wholesale, in the order the form sent them. */
export async function replaceLinks<Link>(relation: LinksRelation<Link>, links: Link[]) {
  await relation.query().delete()
  if (links.length > 0) {
    await relation.createMany(links.map((link, index) => ({ ...link, position: index })))
  }
}
