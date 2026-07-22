import type Category from '#models/category'
import type Tag from '#models/tag'

/**
 * Upserts the FR/EN name translations of a taxonomy term. The
 * English name is optional: an empty value removes the existing
 * English translation.
 */
export async function upsertNameTranslations(
  taxonomy: Category | Tag,
  nameFr: string,
  nameEn?: string
) {
  const translations = taxonomy.related('translations')

  await translations.updateOrCreate({ locale: 'fr' }, { locale: 'fr', name: nameFr })

  if (nameEn) {
    await translations.updateOrCreate({ locale: 'en' }, { locale: 'en', name: nameEn })
  } else {
    await translations.query().where('locale', 'en').delete()
  }
}
