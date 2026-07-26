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

type Category = {
  id: number
  slug: string
  nameFr: string
  nameEn: string
  articlesCount: number
}

type CategoriesProps = {
  categories: Category[]
}

/**
 * Creation form when `category` is null, inline edition otherwise. Both
 * cases post the same three fields, so the shape is shared.
 */
function CategoryForm({ category, onDone }: { category: Category | null; onDone?: () => void }) {
  const { errors } = usePage().props
  const router = useRouter()
  const [values, setValues] = useState({
    slug: category?.slug ?? '',
    nameFr: category?.nameFr ?? '',
    nameEn: category?.nameEn ?? '',
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    const options = { preserveScroll: true, data: values, onSuccess: onDone }

    if (category) {
      router.visit({ route: 'admin.categories.update', routeParams: { id: category.id } }, options)
      return
    }

    router.visit(
      { route: 'admin.categories.store' },
      { ...options, onSuccess: () => setValues({ slug: '', nameFr: '', nameEn: '' }) }
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor={`slug-${category?.id ?? 'new'}`}>Slug</Label>
        <Input
          id={`slug-${category?.id ?? 'new'}`}
          value={values.slug}
          onChange={(event) => setValues({ ...values, slug: event.target.value })}
        />
        <FieldError errors={errors} field="slug" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`nameFr-${category?.id ?? 'new'}`}>Nom (FR)</Label>
        <Input
          id={`nameFr-${category?.id ?? 'new'}`}
          value={values.nameFr}
          onChange={(event) => setValues({ ...values, nameFr: event.target.value })}
        />
        <FieldError errors={errors} field="nameFr" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`nameEn-${category?.id ?? 'new'}`}>Nom (EN, optionnel)</Label>
        <Input
          id={`nameEn-${category?.id ?? 'new'}`}
          value={values.nameEn}
          onChange={(event) => setValues({ ...values, nameEn: event.target.value })}
        />
      </div>
      <div className="sm:col-span-3">
        <Button type="submit" size="sm">
          {category ? 'Enregistrer' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

export default function Categories({ categories }: CategoriesProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <AdminPage title="Catégories" className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm category={null} />
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <EmptyState>Aucune catégorie pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {categories.map((category) => (
            <li key={category.id} className="space-y-3 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">{category.nameFr}</span>
                  {category.nameEn && (
                    <span className="text-muted-foreground text-sm"> · {category.nameEn}</span>
                  )}
                  <span className="text-muted-foreground block font-mono text-xs">
                    {category.slug} · {category.articlesCount} article(s)
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={
                      editingId === category.id
                        ? 'Annuler la modification'
                        : `Modifier ${category.nameFr}`
                    }
                    onClick={() => setEditingId(editingId === category.id ? null : category.id)}
                  >
                    {editingId === category.id ? (
                      <X className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </Button>
                  <ConfirmButton
                    description={`Supprimer « ${category.nameFr} » ?`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.categories.destroy', routeParams: { id: category.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${category.nameFr}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
              {editingId === category.id && (
                <CategoryForm category={category} onDone={() => setEditingId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
