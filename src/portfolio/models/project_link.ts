import { ProjectLinkSchema } from '#database/schema'
import type { ProjectLinkType } from '#types/content'

export default class ProjectLink extends ProjectLinkSchema {
  declare type: ProjectLinkType
}
