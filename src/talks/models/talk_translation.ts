import { TalkTranslationSchema } from '#database/schema'
import type { Locale } from '#types/i18n'

export default class TalkTranslation extends TalkTranslationSchema {
  declare locale: Locale
}
