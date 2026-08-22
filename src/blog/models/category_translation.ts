import { CategoryTranslationSchema } from '#database/schema'
import type { Locale } from '#types/i18n'

export default class CategoryTranslation extends CategoryTranslationSchema {
  declare locale: Locale
}
