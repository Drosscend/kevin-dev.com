import FieldError, { type FieldErrors } from '~/components/field_error'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SLUG_LOCKED_HINT } from '~/lib/admin'

/**
 * Slug of a content entry, shared by both locales. Locked once the entry
 * has been public, since its URL may already be shared.
 */
export default function SlugField({
  value,
  locked,
  onChange,
  errors,
}: {
  value: string
  locked: boolean
  onChange: (value: string) => void
  errors: FieldErrors | undefined
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Slug (partagé FR/EN)</Label>
      <Input
        id="slug"
        value={value}
        disabled={locked}
        onChange={(event) => onChange(event.target.value)}
      />
      {locked && <p className="text-muted-foreground text-xs">{SLUG_LOCKED_HINT}</p>}
      <FieldError errors={errors} field="slug" />
    </div>
  )
}
