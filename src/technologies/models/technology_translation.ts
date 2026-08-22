import { TechnologyTranslationSchema } from '#database/schema'
import type { Locale } from '#types/i18n'

export default class TechnologyTranslation extends TechnologyTranslationSchema {
  declare locale: Locale
}
