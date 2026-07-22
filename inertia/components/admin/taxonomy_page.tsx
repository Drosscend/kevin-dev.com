import { type FormEvent, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'
import { Pencil, Trash2, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import FieldError from '~/components/field_error'

export type TaxonomyItem = {
  id: number
  slug: string
  nameFr: string
  nameEn: string
  articlesCount: number
}

/**
 * Categories and tags expose the same four routes under their own
 * prefix, so a single prefix identifies the whole CRUD.
 */
type TaxonomyRoute = 'admin.categories' | 'admin.tags'

type TaxonomyPageProps = {
  title: string
  route: TaxonomyRoute
  items: TaxonomyItem[]
}

function TaxonomyForm({
  route,
  item,
  onDone,
}: {
  route: TaxonomyRoute
  item: TaxonomyItem | null
  onDone?: () => void
}) {
  const { errors } = usePage().props
  const router = useRouter()
  const [values, setValues] = useState({
    slug: item?.slug ?? '',
    nameFr: item?.nameFr ?? '',
    nameEn: item?.nameEn ?? '',
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    const options = { preserveScroll: true, data: values, onSuccess: onDone }

    if (item) {
      router.visit({ route: `${route}.update`, routeParams: { id: item.id } }, options)
      return
    }

    router.visit(
      { route: `${route}.store` },
      { ...options, onSuccess: () => setValues({ slug: '', nameFr: '', nameEn: '' }) }
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor={`slug-${item?.id ?? 'new'}`}>Slug</Label>
        <Input
          id={`slug-${item?.id ?? 'new'}`}
          value={values.slug}
          onChange={(event) => setValues({ ...values, slug: event.target.value })}
        />
        <FieldError errors={errors} field="slug" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`nameFr-${item?.id ?? 'new'}`}>Nom (FR)</Label>
        <Input
          id={`nameFr-${item?.id ?? 'new'}`}
          value={values.nameFr}
          onChange={(event) => setValues({ ...values, nameFr: event.target.value })}
        />
        <FieldError errors={errors} field="nameFr" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`nameEn-${item?.id ?? 'new'}`}>Nom (EN, optionnel)</Label>
        <Input
          id={`nameEn-${item?.id ?? 'new'}`}
          value={values.nameEn}
          onChange={(event) => setValues({ ...values, nameEn: event.target.value })}
        />
      </div>
      <div className="sm:col-span-3">
        <Button type="submit" size="sm">
          {item ? 'Enregistrer' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

export default function TaxonomyPage({ title, route, items }: TaxonomyPageProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <AdminPage title={title} className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter</CardTitle>
        </CardHeader>
        <CardContent>
          <TaxonomyForm route={route} item={null} />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState>Rien pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {items.map((item) => (
            <li key={item.id} className="space-y-3 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">{item.nameFr}</span>
                  {item.nameEn && (
                    <span className="text-muted-foreground text-sm"> · {item.nameEn}</span>
                  )}
                  <span className="text-muted-foreground block font-mono text-xs">
                    {item.slug} — {item.articlesCount} article(s)
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={
                      editingId === item.id ? 'Annuler la modification' : `Modifier ${item.nameFr}`
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
                    description={`Supprimer « ${item.nameFr} » ?`}
                    onConfirm={() =>
                      router.visit(
                        { route: `${route}.destroy`, routeParams: { id: item.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${item.nameFr}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
              {editingId === item.id && (
                <TaxonomyForm route={route} item={item} onDone={() => setEditingId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
