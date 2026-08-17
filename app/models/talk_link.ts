import { TalkLinkSchema } from '#database/schema'
import type { TalkLinkType } from '#types/content'

export default class TalkLink extends TalkLinkSchema {
  declare type: TalkLinkType
}
