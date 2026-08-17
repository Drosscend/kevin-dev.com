import { TalkLinkSchema } from '#database/schema'

export const TALK_LINK_TYPES = ['slides', 'video', 'event', 'code', 'other'] as const
export type TalkLinkType = (typeof TALK_LINK_TYPES)[number]

export default class TalkLink extends TalkLinkSchema {
  declare type: TalkLinkType
}
