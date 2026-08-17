import { Trash2 } from 'lucide-react'
import FieldError, { type FieldErrors } from '~/components/field_error'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select } from '~/components/ui/select'

export type LinkValues = { label: string; url: string; type: string }

/** Rows the author started but left blank are not worth sending. */
export function withoutEmptyLinks(links: LinkValues[]) {
  return links.filter((link) => link.label.trim() !== '' || link.url.trim() !== '')
}

/**
 * Editable list of the external links of a project or a talk: label,
 * URL and a type picked from the list the caller provides.
 */
export default function ExternalLinksCard({
  links,
  types,
  onChange,
  errors,
}: {
  links: LinkValues[]
  types: readonly { value: string; label: string }[]
  onChange: (links: LinkValues[]) => void
  errors: FieldErrors | undefined
}) {
  function setLink(index: number, link: LinkValues) {
    onChange(links.map((current, i) => (i === index ? link : current)))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liens externes</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...links, { label: '', url: '', type: types[0].value }])}
        >
          Ajouter un lien
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.length === 0 && <p className="text-muted-foreground text-sm">Aucun lien.</p>}
        {links.map((link, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto_auto]">
            <Input
              placeholder="Libellé"
              value={link.label}
              onChange={(event) => setLink(index, { ...link, label: event.target.value })}
            />
            <Input
              placeholder="https://…"
              value={link.url}
              onChange={(event) => setLink(index, { ...link, url: event.target.value })}
            />
            <Select
              className="w-auto"
              value={link.type}
              onChange={(event) => setLink(index, { ...link, type: event.target.value })}
            >
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              aria-label={`Retirer le lien ${index + 1}`}
              onClick={() => onChange(links.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <FieldError errors={errors} field="links" />
      </CardContent>
    </Card>
  )
}
