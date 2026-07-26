import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ProjectLinkSchema } from '#database/schema'
import Project from '#models/project'

export const PROJECT_LINK_TYPES = ['github', 'demo', 'release', 'store', 'paper', 'other'] as const
export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number]

export default class ProjectLink extends ProjectLinkSchema {
  declare type: ProjectLinkType

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
