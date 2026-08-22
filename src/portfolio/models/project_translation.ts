import { ProjectTranslationSchema } from '#database/schema'
import type { Locale } from '#types/i18n'

export default class ProjectTranslation extends ProjectTranslationSchema {
  declare locale: Locale
}
