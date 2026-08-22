import { useState } from 'react'
import { TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { Locale } from '#types/i18n'
import type { TranslationValues } from '~/lib/admin'

type TranslationStatus = 'empty' | 'partial' | 'complete'

const STORAGE_PREFIX = 'admin:locale:'

/**
 * Active locale of an admin editor. Kept in sessionStorage because a
 * save re-mounts the page: without it, every save would throw the
 * editor back to French in the middle of a translation. The `scope`
 * gives each editor its own memory, so translating an article does
 * not open the homepage in English.
 *
 * `hasTranslation` is what the entry loaded with: an editor whose
 * entry has none opens on French, otherwise a remembered English tab
 * would greet it with an empty state instead of its content.
 */
export function useAdminLocale(scope: string, hasTranslation = true) {
  const storageKey = STORAGE_PREFIX + scope

  const [locale, setLocale] = useState<Locale>(() =>
    hasTranslation && window.sessionStorage.getItem(storageKey) === 'en' ? 'en' : 'fr'
  )

  function changeLocale(value: string) {
    const next: Locale = value === 'en' ? 'en' : 'fr'
    window.sessionStorage.setItem(storageKey, next)
    setLocale(next)
  }

  /**
   * Opens the tab holding a field the server rejected: an error on the
   * hidden locale would be invisible otherwise. French first, since it
   * is the locale that cannot be left incomplete. Both naming schemes
   * are covered: the `fr`/`en` objects of the entries and the `Fr`/`En`
   * suffixes of the homepage.
   */
  function focusErrors(fieldErrors: Record<string, string>) {
    const fields = Object.keys(fieldErrors)

    if (fields.some((field) => /^fr\.|Fr$/.test(field))) changeLocale('fr')
    else if (fields.some((field) => /^en\.|En$/.test(field))) changeLocale('en')
  }

  return { locale, setLocale: changeLocale, focusErrors }
}

/**
 * Badge state of the English tab, derived from its translated values:
 * nothing filled, some of them, or all of them.
 */
export function translationStatus(values: string[]): TranslationStatus {
  const filled = values.filter((value) => value.trim() !== '').length

  if (filled === 0) return 'empty'
  return filled === values.length ? 'complete' : 'partial'
}

/**
 * Same badge for an article, a project or a talk. The summary only
 * counts when the French entry has one, otherwise a translation with
 * nothing left to translate would stay amber forever.
 */
export function entryTranslationStatus(
  fr: TranslationValues,
  en: TranslationValues | null | undefined
): TranslationStatus {
  if (!en) return 'empty'

  const values = [en.title, en.contentMarkdown]

  if (fr.summary.trim() !== '') values.push(en.summary)

  return translationStatus(values)
}

const STATUS_LABEL = {
  empty: 'traduction anglaise absente',
  partial: 'traduction anglaise incomplète',
  complete: 'traduction anglaise complète',
} satisfies Record<TranslationStatus, string>

const STATUS_DOT = {
  empty: 'border-muted-foreground size-2 rounded-full border',
  partial: 'size-2 rounded-full bg-amber-500',
  complete: 'size-2 rounded-full bg-emerald-500',
} satisfies Record<TranslationStatus, string>

/**
 * The single language switch of an admin page. The dot on the English
 * tab tells how far the translation is without leaving the French one.
 */
export default function LocaleTabsList({ status }: { status: TranslationStatus }) {
  return (
    <TabsList>
      <TabsTrigger value="fr">Français</TabsTrigger>
      <TabsTrigger value="en">
        English
        <span aria-hidden className={STATUS_DOT[status]} />
        <span className="sr-only">({STATUS_LABEL[status]})</span>
      </TabsTrigger>
    </TabsList>
  )
}
