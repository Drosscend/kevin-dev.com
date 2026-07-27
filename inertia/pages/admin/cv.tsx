import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { FileInput } from '~/components/ui/file_input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import MarkdownPageEditor from '~/components/admin/markdown_page_editor'

type CvProps = {
  fr: string
  en: string
  pdf: { size: number } | null
}

export default function Cv({ fr, en, pdf }: CvProps) {
  return (
    <MarkdownPageEditor
      scope="cv"
      title="CV"
      description="Contenu Markdown de la page /cv."
      fr={fr}
      en={en}
      route="admin.cv.update"
    >
      <Card>
        <CardHeader>
          <CardTitle>PDF téléchargeable</CardTitle>
          <CardDescription>
            {pdf
              ? `PDF en ligne · ${Math.round(pdf.size / 1024)} Ko`
              : 'Aucun PDF en ligne pour l’instant.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.cv.pdf.store" className="flex items-end gap-3">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pdf">Nouveau PDF (remplace l’actuel)</Label>
                  <FileInput name="pdf" id="pdf" accept="application/pdf" />
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
    </MarkdownPageEditor>
  )
}
