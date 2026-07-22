import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import MarkdownEditor from '~/components/admin/markdown_editor'
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
  errors: Record<string, string | string[]>
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
        {errors[`${prefix}.title`] && (
          <p className="text-destructive text-sm">{errors[`${prefix}.title`]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-summary`}>Résumé</Label>
        <textarea
          id={`${prefix}-summary`}
          className="border-input min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          value={values.summary}
          onChange={(event) => onChange({ ...values, summary: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <MarkdownEditor
          id={`${prefix}-content`}
          label="Contenu (Markdown)"
          value={values.contentMarkdown}
          rows={16}
          onChange={(contentMarkdown) => onChange({ ...values, contentMarkdown })}
        />
        {errors[`${prefix}.contentMarkdown`] && (
          <p className="text-destructive text-sm">{errors[`${prefix}.contentMarkdown`]}</p>
        )}
      </div>
    </div>
  )
}
