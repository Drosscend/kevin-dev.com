import { type FormEvent, useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import ArticleContent from '~/components/article_content'

type PagesProps = {
  cvFr: string
  cvEn: string
  legalFr: string
  legalEn: string
  pdf: { size: number; updatedAt: string } | null
}

function xsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
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
      <textarea
        id={id}
        className="border-input min-h-60 w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default function Pages({ cvFr, cvEn, legalFr, legalEn, pdf }: PagesProps) {
  const form = useForm({ cvFr, cvEn, legalFr, legalEn })
  const [preview, setPreview] = useState<{ label: string; html: string } | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    form.put('/admin/pages', { preserveScroll: true })
  }

  async function loadPreview(label: string, markdown: string) {
    if (!markdown) {
      return
    }
    const response = await fetch('/admin/articles/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken() },
      body: JSON.stringify({ markdown }),
    })
    if (response.ok) {
      const { html } = await response.json()
      setPreview({ label, html })
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Pages (CV &amp; mentions légales)</h1>

      <Card>
        <CardHeader>
          <CardTitle>CV PDF</CardTitle>
          <CardDescription>
            {pdf
              ? `PDF en ligne — ${Math.round(pdf.size / 1024)} Ko, remplacé le ${new Date(pdf.updatedAt).toLocaleString('fr-FR')}`
              : 'Aucun PDF en ligne pour l’instant.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.pages.pdf" className="flex items-end gap-3">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pdf">Nouveau PDF (remplace l’actuel)</Label>
                  <Input type="file" name="pdf" id="pdf" accept="application/pdf" />
                  {errors.pdf && <p className="text-destructive text-sm">{errors.pdf}</p>}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreview('CV FR', form.data.cvFr)}
            >
              Aperçu FR
            </Button>
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

        {preview && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Aperçu — {preview.label}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(null)}>
                Fermer
              </Button>
            </CardHeader>
            <CardContent>
              <ArticleContent html={preview.html} />
            </CardContent>
          </Card>
        )}

        <Button type="submit" disabled={form.processing}>
          Enregistrer les pages
        </Button>
      </form>
    </div>
  )
}
