import { type FormEvent, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'
import { Pencil, Trash2, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'

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

function TechnologyForm({
  item,
  mediaOptions,
  onDone,
}: {
  item: TechnologyItem | null
  mediaOptions: MediaOption[]
  onDone?: () => void
}) {
  const { errors } = usePage().props
  const router = useRouter()
  const empty = {
    slug: '',
    name: '',
    category: 'outil',
    logoMediaId: null as number | null,
    descriptionFr: '',
    descriptionEn: '',
  }
  const [values, setValues] = useState(
    item
      ? {
          slug: item.slug,
          name: item.name,
          category: item.category,
          logoMediaId: item.logoMediaId,
          descriptionFr: item.descriptionFr,
          descriptionEn: item.descriptionEn,
        }
      : empty
  )

  function submit(event: FormEvent) {
    event.preventDefault()
    const options = { preserveScroll: true, data: values, onSuccess: onDone }

    if (item) {
      router.visit({ route: 'admin.technologies.update', routeParams: { id: item.id } }, options)
      return
    }

    router.visit(
      { route: 'admin.technologies.store' },
      { ...options, onSuccess: () => setValues(empty) }
    )
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
        <FieldError errors={errors} field="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`slug-${key}`}>Slug</Label>
        <Input
          id={`slug-${key}`}
          value={values.slug}
          onChange={(event) => setValues({ ...values, slug: event.target.value })}
        />
        <FieldError errors={errors} field="slug" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`category-${key}`}>Catégorie</Label>
        <Select
          id={`category-${key}`}
          value={values.category}
          onChange={(event) => setValues({ ...values, category: event.target.value })}
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`logo-${key}`}>Logo (bibliothèque média)</Label>
        <Select
          id={`logo-${key}`}
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
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`descFr-${key}`}>Description (FR)</Label>
        <Textarea
          id={`descFr-${key}`}
          value={values.descriptionFr}
          onChange={(event) => setValues({ ...values, descriptionFr: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`descEn-${key}`}>Description (EN, optionnelle)</Label>
        <Textarea
          id={`descEn-${key}`}
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
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <AdminPage title="Technologies" className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter</CardTitle>
        </CardHeader>
        <CardContent>
          <TechnologyForm item={null} mediaOptions={mediaOptions} />
        </CardContent>
      </Card>

      {technologies.length === 0 && <EmptyState>Rien pour l’instant.</EmptyState>}

      <div className="space-y-2">
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
                      {item.slug} · {item.projectsCount} projet(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={
                      editingId === item.id ? 'Annuler la modification' : `Modifier ${item.name}`
                    }
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  >
                    {editingId === item.id ? (
                      <X className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </Button>
                  <ConfirmButton
                    description={`Supprimer « ${item.name} » ?`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.technologies.destroy', routeParams: { id: item.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
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
    </AdminPage>
  )
}
