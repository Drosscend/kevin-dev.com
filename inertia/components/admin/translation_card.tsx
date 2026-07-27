import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import type { FieldErrors } from '~/components/field_error'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import LocaleTabsList, { entryTranslationStatus } from '~/components/admin/locale_tabs'
import TranslationFields from '~/components/admin/translation_fields'
import { EMPTY_TRANSLATION, type TranslationValues } from '~/lib/admin'

/**
 * Content card of an entry translated in one or two locales: the
 * same fields behind a single Français / English switch. The English
 * tab either edits the translation or offers to create it, and
 * dropping it sends the editor back to French, where there is always
 * something to show. An absent translation is `undefined`, which the
 * form leaves out of the payload.
 *
 * The two sentences naming the entry come from the page: they carry
 * the gender and the elision of a noun this component has no reason
 * to know.
 */
export default function TranslationCard({
  locale,
  onLocaleChange,
  fr,
  en,
  errors,
  onFrChange,
  onEnChange,
  untranslatedLabel,
  removalDescription,
}: {
  locale: string
  onLocaleChange: (value: string) => void
  fr: TranslationValues
  en: TranslationValues | undefined
  errors: FieldErrors
  onFrChange: (values: TranslationValues) => void
  onEnChange: (values: TranslationValues | undefined) => void
  untranslatedLabel: string
  removalDescription: string
}) {
  function removeEnglish() {
    onEnChange(undefined)
    onLocaleChange('fr')
  }

  return (
    <Tabs value={locale} onValueChange={onLocaleChange}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contenu</CardTitle>
          <LocaleTabsList status={entryTranslationStatus(fr, en)} />
        </CardHeader>
        <CardContent>
          <TabsContent value="fr">
            <TranslationFields prefix="fr" values={fr} onChange={onFrChange} errors={errors} />
          </TabsContent>
          <TabsContent value="en" className="space-y-4">
            {en ? (
              <>
                <TranslationFields prefix="en" values={en} onChange={onEnChange} errors={errors} />
                <ConfirmButton
                  title="Retirer la traduction"
                  description={removalDescription}
                  confirmLabel="Retirer"
                  onConfirm={removeEnglish}
                  trigger={
                    <Button type="button" variant="ghost" size="sm" className="text-destructive">
                      Retirer la traduction anglaise
                    </Button>
                  }
                />
              </>
            ) : (
              <div className="space-y-3">
                <EmptyState>{untranslatedLabel}</EmptyState>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEnChange({ ...EMPTY_TRANSLATION })}
                >
                  Ajouter la traduction anglaise
                </Button>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
