import { ProjectLinkSchema } from '#database/schema'

export const PROJECT_LINK_TYPES = ['github', 'demo', 'release', 'store', 'paper', 'other'] as const
export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number]

export default class ProjectLink extends ProjectLinkSchema {
  declare type: ProjectLinkType
}
