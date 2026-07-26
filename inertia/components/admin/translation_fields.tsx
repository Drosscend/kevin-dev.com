import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import MarkdownEditor from '~/components/admin/markdown_editor'
import FieldError, { type FieldErrors } from '~/components/field_error'
import type { TranslationValues } from '~/lib/admin'

/**
 * Title / summary / markdown fields for one locale, shared by the
 * article and project admin forms.
 */
export default function TranslationFields({
  prefix,
  values,
  onChange,
  errors,
}: {
  prefix: 'fr' | 'en'
  values: TranslationValues
  onChange: (values: TranslationValues) => void
  errors: FieldErrors
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-title`}>Titre</Label>
        <Input
          id={`${prefix}-title`}
          value={values.title}
          onChange={(event) => onChange({ ...values, title: event.target.value })}
        />
        <FieldError errors={errors} field={`${prefix}.title`} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-summary`}>Résumé</Label>
        <Textarea
          id={`${prefix}-summary`}
          value={values.summary}
          onChange={(event) => onChange({ ...values, summary: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <MarkdownEditor
          id={`${prefix}-content`}
          label="Contenu"
          value={values.contentMarkdown}
          onChange={(contentMarkdown) => onChange({ ...values, contentMarkdown })}
        />
        <FieldError errors={errors} field={`${prefix}.contentMarkdown`} />
      </div>
    </div>
  )
}
