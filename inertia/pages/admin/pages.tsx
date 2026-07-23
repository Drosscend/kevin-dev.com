import { type FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import AdminPage from '~/components/admin/admin_page'

type PagesProps = {
  cvFr: string
  cvEn: string
  legalFr: string
  legalEn: string
  pdf: { size: number } | null
}

function MarkdownField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        className="min-h-60 font-mono"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default function Pages({ cvFr, cvEn, legalFr, legalEn, pdf }: PagesProps) {
  const form = useForm({ cvFr, cvEn, legalFr, legalEn })

  function submit(event: FormEvent) {
    event.preventDefault()
    form.put(client.urlFor('admin.pages.update'), { preserveScroll: true })
  }

  return (
    <AdminPage title="Pages (CV & mentions légales)">
      <Card>
        <CardHeader>
          <CardTitle>CV PDF</CardTitle>
          <CardDescription>
            {pdf
              ? `PDF en ligne — ${Math.round(pdf.size / 1024)} Ko`
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
        <Card>
          <CardHeader>
            <CardTitle>Page CV</CardTitle>
            <CardDescription>
              Contenu Markdown de la page /cv. La version EN est optionnelle (message d’absence
              affiché sinon).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MarkdownField
              id="cvFr"
              label="CV (FR)"
              value={form.data.cvFr}
              onChange={(value) => form.setData('cvFr', value)}
            />
            <MarkdownField
              id="cvEn"
              label="CV (EN, optionnel)"
              value={form.data.cvEn}
              onChange={(value) => form.setData('cvEn', value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentions légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MarkdownField
              id="legalFr"
              label="Mentions légales (FR)"
              value={form.data.legalFr}
              onChange={(value) => form.setData('legalFr', value)}
            />
            <MarkdownField
              id="legalEn"
              label="Mentions légales (EN, optionnel)"
              value={form.data.legalEn}
              onChange={(value) => form.setData('legalEn', value)}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.processing}>
          Enregistrer les pages
        </Button>
      </form>
    </AdminPage>
  )
}
