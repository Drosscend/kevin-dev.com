import { ArticleTranslationSchema } from '#database/schema'
import type { Locale } from '#types/i18n'

export default class ArticleTranslation extends ArticleTranslationSchema {
  declare locale: Locale
}
