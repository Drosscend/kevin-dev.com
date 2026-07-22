import type { Locale } from '#types/i18n'

/**
 * Minimal shape of a Lucid "translations" relation client, kept
 * structural so every translatable model can be passed regardless of
 * the columns its translation table carries.
 */
interface TranslationsRelation<Fields extends Record<string, string>> {
  updateOrCreate(search: { locale: Locale }, payload: { locale: Locale } & Fields): Promise<unknown>
  query(): { where(column: 'locale', value: Locale): { delete(): Promise<unknown> } }
}

/**
 * Upserts the FR translation of a record and, when an EN payload is
 * given, the EN one. A null EN payload removes the stored English
 * translation: French is the only locale a record always has.
 */
export async function upsertTranslations<Fields extends Record<string, string>>(
  translations: TranslationsRelation<Fields>,
  payload: { fr: Fields; en: Fields | null }
) {
  await translations.updateOrCreate({ locale: 'fr' }, { locale: 'fr', ...payload.fr })

  if (payload.en) {
    await translations.updateOrCreate({ locale: 'en' }, { locale: 'en', ...payload.en })
    return
  }

  await translations.query().where('locale', 'en').delete()
}
