import { type FormEvent, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'
import { ArrowDown, ArrowUp, Pencil, Trash2, X } from 'lucide-react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import FieldError from '~/components/field_error'

type TimelineItem = {
  id: number
  periodFr: string
  titleFr: string
  placeFr: string
  periodEn: string
  titleEn: string
  placeEn: string
}

type HomeAdminProps = {
  settings: {
    heroRolesFr: string
    heroRolesEn: string
    heroLocation: string
    nowFr: string
    nowEn: string
  }
  timeline: TimelineItem[]
}

function SettingsTextarea({
  id,
  label,
  value,
  onChange,
  rows = 2,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

/**
 * Inline create/edit form for a timeline entry. The EN fields are
 * optional: left empty, the FR entry is shown to both locales.
 */
function TimelineForm({ item, onDone }: { item: TimelineItem | null; onDone?: () => void }) {
  const { errors } = usePage().props
  const router = useRouter()
  const empty = {
    periodFr: '',
    titleFr: '',
    placeFr: '',
    periodEn: '',
    titleEn: '',
    placeEn: '',
  }
  const [values, setValues] = useState(
    item
      ? {
          periodFr: item.periodFr,
          titleFr: item.titleFr,
          placeFr: item.placeFr,
          periodEn: item.periodEn,
          titleEn: item.titleEn,
          placeEn: item.placeEn,
        }
      : empty
  )

  const set = (field: keyof typeof empty) => (event: { target: { value: string } }) =>
    setValues({ ...values, [field]: event.target.value })

  function submit(event: FormEvent) {
    event.preventDefault()
    const options = { preserveScroll: true, data: values, onSuccess: onDone }

    if (item) {
      router.visit({ route: 'admin.home.timeline.update', routeParams: { id: item.id } }, options)
      return
    }

    router.visit(
      { route: 'admin.home.timeline.store' },
      { ...options, onSuccess: () => setValues(empty) }
    )
  }

  const prefix = item?.id ?? 'new'

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`periodFr-${prefix}`}>Période (FR)</Label>
          <Input id={`periodFr-${prefix}`} value={values.periodFr} onChange={set('periodFr')} />
          <FieldError errors={errors} field="periodFr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`titleFr-${prefix}`}>Intitulé (FR)</Label>
          <Input id={`titleFr-${prefix}`} value={values.titleFr} onChange={set('titleFr')} />
          <FieldError errors={errors} field="titleFr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`placeFr-${prefix}`}>Lieu / statut (FR)</Label>
          <Input id={`placeFr-${prefix}`} value={values.placeFr} onChange={set('placeFr')} />
          <FieldError errors={errors} field="placeFr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`periodEn-${prefix}`}>Période (EN, optionnel)</Label>
          <Input id={`periodEn-${prefix}`} value={values.periodEn} onChange={set('periodEn')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`titleEn-${prefix}`}>Intitulé (EN, optionnel)</Label>
          <Input id={`titleEn-${prefix}`} value={values.titleEn} onChange={set('titleEn')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`placeEn-${prefix}`}>Lieu / statut (EN, optionnel)</Label>
          <Input id={`placeEn-${prefix}`} value={values.placeEn} onChange={set('placeEn')} />
        </div>
      </div>
      <Button type="submit" size="sm">
        {item ? 'Enregistrer' : 'Ajouter'}
      </Button>
    </form>
  )
}

export default function HomeAdmin({ settings, timeline }: HomeAdminProps) {
  const form = useForm(settings)
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)

  function submitSettings(event: FormEvent) {
    event.preventDefault()
    form.put(client.urlFor('admin.home.update'), { preserveScroll: true })
  }

  function move(item: TimelineItem, direction: 'up' | 'down') {
    router.visit(
      { route: 'admin.home.timeline.move', routeParams: { id: item.id } },
      { preserveScroll: true, data: { direction } }
    )
  }

  return (
    <AdminPage title="Accueil">
      <form onSubmit={submitSettings} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
            <CardDescription>
              Les métiers s’affichent sous ton nom, un par ligne. Laisser vide pour garder les
              valeurs par défaut du site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsTextarea
                id="heroRolesFr"
                label="Métiers (FR, un par ligne)"
                value={form.data.heroRolesFr}
                onChange={(value) => form.setData('heroRolesFr', value)}
              />
              <SettingsTextarea
                id="heroRolesEn"
                label="Métiers (EN, un par ligne, optionnel)"
                value={form.data.heroRolesEn}
                onChange={(value) => form.setData('heroRolesEn', value)}
              />
            </div>
            <div className="max-w-sm space-y-2">
              <Label htmlFor="heroLocation">Localisation</Label>
              <Input
                id="heroLocation"
                placeholder="Toulouse, France"
                value={form.data.heroLocation}
                onChange={(event) => form.setData('heroLocation', event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>En ce moment</CardTitle>
            <CardDescription>
              Texte brut affiché dans le bloc « En ce moment ». Laisser vide pour masquer la
              section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingsTextarea
              id="nowFr"
              label="En ce moment (FR)"
              value={form.data.nowFr}
              onChange={(value) => form.setData('nowFr', value)}
            />
            <SettingsTextarea
              id="nowEn"
              label="En ce moment (EN, optionnel)"
              value={form.data.nowEn}
              onChange={(value) => form.setData('nowEn', value)}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.processing}>
          Enregistrer le contenu
        </Button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Parcours</CardTitle>
          <CardDescription>
            La timeline affichée sur l’accueil, du plus récent au plus ancien.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineForm item={null} />
        </CardContent>
      </Card>

      {timeline.length === 0 ? (
        <EmptyState>Aucune étape pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {timeline.map((item, index) => (
            <li key={item.id} className="space-y-3 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{item.titleFr}</p>
                  <p className="text-muted-foreground truncate font-mono text-xs">
                    {item.periodFr} — {item.placeFr}
                    {item.titleEn ? ' — EN ✓' : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    aria-label={`Monter ${item.titleFr}`}
                    onClick={() => move(item, 'up')}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === timeline.length - 1}
                    aria-label={`Descendre ${item.titleFr}`}
                    onClick={() => move(item, 'down')}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={
                      editingId === item.id ? 'Annuler la modification' : `Modifier ${item.titleFr}`
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
                    description={`Supprimer « ${item.titleFr} » du parcours ?`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.home.timeline.destroy', routeParams: { id: item.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${item.titleFr}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
              {editingId === item.id && (
                <TimelineForm item={item} onDone={() => setEditingId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
