/**
 * Value lists shared by the models, the validators and the admin
 * screens. They carry no runtime dependency so the client can import
 * them through the `#types` alias and stay in sync with the server.
 */

export const PUBLICATION_STATUSES = ['draft', 'published', 'archived'] as const
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number]

/** How a signed-in visitor sees an entry the public cannot: as a draft, or as an archive. */
export type PreviewMode = 'draft' | 'archived' | null

export const TECHNOLOGY_CATEGORIES = ['langage', 'framework', 'outil', 'infra'] as const
export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number]

export const PROJECT_LINK_TYPES = ['github', 'demo', 'release', 'store', 'paper', 'other'] as const
export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number]

export const TALK_LINK_TYPES = ['slides', 'video', 'event', 'code', 'other'] as const
export type TalkLinkType = (typeof TALK_LINK_TYPES)[number]

export const TIMELINE_HONOURS = ['none', 'fair', 'good', 'very_good'] as const
export type TimelineHonours = (typeof TIMELINE_HONOURS)[number]
