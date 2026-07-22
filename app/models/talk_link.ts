import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TalkLinkSchema } from '#database/schema'
import Talk from '#models/talk'

export const TALK_LINK_TYPES = ['slides', 'video', 'event', 'code', 'other'] as const
export type TalkLinkType = (typeof TALK_LINK_TYPES)[number]

export default class TalkLink extends TalkLinkSchema {
  declare type: TalkLinkType

  @belongsTo(() => Talk)
  declare talk: BelongsTo<typeof Talk>
}
