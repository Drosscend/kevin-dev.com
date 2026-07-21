import { type FormEvent, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Pencil, Trash2, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const CATEGORIES = [
  { value: 'langage', label: 'Langage' },
  { value: 'framework', label: 'Framework' },
  { value: 'outil', label: 'Outil' },
  { value: 'infra', label: 'Infra' },
] as const

type TechnologyItem = {
  id: number
  slug: string
  name: string
  category: string
  logoMediaId: number | null
  logoUrl: string | null
  descriptionFr: string
  descriptionEn: string
  projectsCount: number
}

type MediaOption = { id: number; alt: string }

type TechnologiesProps = {
  technologies: TechnologyItem[]
  mediaOptions: MediaOption[]
}

type Errors = Record<string, string | string[]>

function TechnologyForm({
  item,
  mediaOptions,
  onDone,
}: {
  item: TechnologyItem | null
  mediaOptions: MediaOption[]
  onDone?: () => void
}) {
  const { errors } = usePage().props as { errors?: Errors }
  const [values, setValues] = useState({
    slug: item?.slug ?? '',
    name: item?.name ?? '',
    category: item?.category ?? 'outil',
    logoMediaId: item?.logoMediaId ?? null,
    descriptionFr: item?.descriptionFr ?? '',
    descriptionEn: item?.descriptionEn ?? '',
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    const options = { preserveScroll: true, onSuccess: onDone }
    if (item) {
      router.put(`/admin/technologies/${item.id}`, values, options)
    } else {
      router.post('/admin/technologies', values, {
        ...options,
        onSuccess: () =>
          setValues({
            slug: '',
            name: '',
            category: 'outil',
            logoMediaId: null,
            descriptionFr: '',
            descriptionEn: '',
          }),
      })
    }
  }

  const key = item?.id ?? 'new'

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`name-${key}`}>Nom</Label>
        <Input
          id={`name-${key}`}
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
        {errors?.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`slug-${key}`}>Slug</Label>
        <Input
          id={`slug-${key}`}
          value={values.slug}
          onChange={(event) => setValues({ ...values, slug: event.target.value })}
        />
        {errors?.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`category-${key}`}>Catégorie</Label>
        <select
          id={`category-${key}`}
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          value={values.category}
          onChange={(event) => setValues({ ...values, category: event.target.value })}
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`logo-${key}`}>Logo (bibliothèque média)</Label>
        <select
          id={`logo-${key}`}
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          value={values.logoMediaId ?? ''}
          onChange={(event) =>
            setValues({
              ...values,
              logoMediaId: event.target.value === '' ? null : Number(event.target.value),
            })
          }
        >
          <option value="">Aucun</option>
          {mediaOptions.map((media) => (
            <option key={media.id} value={media.id}>
              {media.alt}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`descFr-${key}`}>Description (FR)</Label>
        <textarea
          id={`descFr-${key}`}
          className="border-input min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          value={values.descriptionFr}
          onChange={(event) => setValues({ ...values, descriptionFr: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`descEn-${key}`}>Description (EN, optionnelle)</Label>
        <textarea
          id={`descEn-${key}`}
          className="border-input min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          value={values.descriptionEn}
          onChange={(event) => setValues({ ...values, descriptionEn: event.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="sm">
          {item ? 'Enregistrer' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

export default function Technologies({ technologies, mediaOptions }: TechnologiesProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  function remove(item: TechnologyItem) {
    if (confirm(`Supprimer « ${item.name} » ?`)) {
      router.delete(`/admin/technologies/${item.id}`, { preserveScroll: true })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Technologies</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter</CardTitle>
        </CardHeader>
        <CardContent>
          <TechnologyForm item={null} mediaOptions={mediaOptions} />
        </CardContent>
      </Card>

      <div className="space-y-2">
        {technologies.length === 0 && (
          <p className="text-muted-foreground text-sm">Rien pour l’instant.</p>
        )}
        {technologies.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.logoUrl && (
                    <img src={item.logoUrl} alt="" className="size-8 rounded object-contain" />
                  )}
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground text-sm"> · {item.category}</span>
                    <span className="text-muted-foreground block text-xs">
                      {item.slug} — {item.projectsCount} projet(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  >
                    {editingId === item.id ? (
                      <X className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => remove(item)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {editingId === item.id && (
                <TechnologyForm
                  item={item}
                  mediaOptions={mediaOptions}
                  onDone={() => setEditingId(null)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
