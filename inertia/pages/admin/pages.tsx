import { type FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import FieldError from '~/components/field_error'
import AdminPage from '~/components/admin/admin_page'
import LocaleTabsList, {
  type AdminLocale,
  translationStatus,
  useAdminLocale,
} from '~/components/admin/locale_tabs'
import MarkdownEditor from '~/components/admin/markdown_editor'

type PagesProps = {
  cvFr: string
  cvEn: string
  legalFr: string
  legalEn: string
  pdf: { size: number } | null
}

/**
 * The two editable pages of one locale. Both tabs get the very same
 * fields; only the English one warns about the fallback.
 */
function PageContents({
  locale,
  cv,
  legal,
  onCvChange,
  onLegalChange,
}: {
  locale: AdminLocale
  cv: string
  legal: string
  onCvChange: (value: string) => void
  onLegalChange: (value: string) => void
}) {
  const fallbackHint =
    locale === 'en' ? ' Laissée vide, la page affiche un message d’absence de traduction.' : ''

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Page CV</CardTitle>
          <CardDescription>Contenu Markdown de la page /cv.{fallbackHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor id={`cv-${locale}`} label="CV" value={cv} onChange={onCvChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentions légales</CardTitle>
          <CardDescription>
            Contenu Markdown de la page /mentions-legales.{fallbackHint}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor
            id={`legal-${locale}`}
            label="Mentions légales"
            value={legal}
            onChange={onLegalChange}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default function Pages({ cvFr, cvEn, legalFr, legalEn, pdf }: PagesProps) {
  const form = useForm({ cvFr, cvEn, legalFr, legalEn })
  const { locale, setLocale } = useAdminLocale('pages')

  function submit(event: FormEvent) {
    event.preventDefault()
    form.put(client.urlFor('admin.pages.update'), { preserveScroll: true })
  }

  return (
    <Tabs value={locale} onValueChange={setLocale} className="contents">
      <AdminPage
        title="Pages (CV & mentions légales)"
        action={<LocaleTabsList status={translationStatus([form.data.cvEn, form.data.legalEn])} />}
      >
        <Card>
          <CardHeader>
            <CardTitle>CV PDF</CardTitle>
            <CardDescription>
              {pdf
                ? `PDF en ligne · ${Math.round(pdf.size / 1024)} Ko`
                : 'Aucun PDF en ligne pour l’instant.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form route="admin.pages.pdf.store" className="flex items-end gap-3">
              {({ errors, processing }) => (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pdf">Nouveau PDF (remplace l’actuel)</Label>
                    <Input type="file" name="pdf" id="pdf" accept="application/pdf" />
                    <FieldError errors={errors} field="pdf" />
                  </div>
                  <Button type="submit" disabled={processing}>
                    Uploader
                  </Button>
                </>
              )}
            </Form>
          </CardContent>
        </Card>

        <form onSubmit={submit} className="space-y-6">
          <TabsContent value="fr" className="space-y-6">
            <PageContents
              locale="fr"
              cv={form.data.cvFr}
              legal={form.data.legalFr}
              onCvChange={(value) => form.setData('cvFr', value)}
              onLegalChange={(value) => form.setData('legalFr', value)}
            />
          </TabsContent>
          <TabsContent value="en" className="space-y-6">
            <PageContents
              locale="en"
              cv={form.data.cvEn}
              legal={form.data.legalEn}
              onCvChange={(value) => form.setData('cvEn', value)}
              onLegalChange={(value) => form.setData('legalEn', value)}
            />
          </TabsContent>

          <Button type="submit" disabled={form.processing}>
            Enregistrer les pages
          </Button>
        </form>
      </AdminPage>
    </Tabs>
  )
}
