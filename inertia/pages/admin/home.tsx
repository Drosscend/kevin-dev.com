import { type FormEvent, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'
import { ArrowDown, ArrowUp, Pencil, Trash2, X } from 'lucide-react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import FieldError from '~/components/field_error'
import LocaleTabsList, {
  type AdminLocale,
  translationStatus,
  useAdminLocale,
} from '~/components/admin/locale_tabs'

const HONOURS = [
  { value: 'none', label: 'Sans mention' },
  { value: 'fair', label: 'Assez bien' },
  { value: 'good', label: 'Bien' },
  { value: 'very_good', label: 'Très bien' },
] as const

const honoursLabel = (value: string) => HONOURS.find((option) => option.value === value)?.label

type TimelineItem = {
  id: number
  honours: string
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
 * The translated blocks of the homepage for one locale. Both tabs get
 * the same fields; the location stays out, it is shared.
 */
function HomeContents({
  locale,
  roles,
  now,
  onRolesChange,
  onNowChange,
}: {
  locale: AdminLocale
  roles: string
  now: string
  onRolesChange: (value: string) => void
  onNowChange: (value: string) => void
}) {
  const fallbackHint =
    locale === 'en' ? ' Laissé vide, le bloc français est servi aux deux langues.' : ''

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>
            Les métiers s’affichent sous ton nom, un par ligne. Laisser vide pour masquer la ligne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTextarea
            id={`heroRoles-${locale}`}
            label="Métiers (un par ligne)"
            value={roles}
            onChange={onRolesChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>En ce moment</CardTitle>
          <CardDescription>
            Texte brut affiché dans le bloc « En ce moment ». Laisser vide pour masquer la section.
            {fallbackHint}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTextarea
            id={`now-${locale}`}
            label="En ce moment"
            value={now}
            onChange={onNowChange}
          />
        </CardContent>
      </Card>
    </>
  )
}

/**
 * Inline create/edit form for a timeline entry. It shows the fields of
 * the locale selected on the page; the honours are locale independent,
 * so they stay visible in both tabs.
 */
function TimelineForm({
  item,
  locale,
  onErrors,
  onDone,
}: {
  item: TimelineItem | null
  locale: AdminLocale
  onErrors: (errors: Record<string, string>) => void
  onDone?: () => void
}) {
  const { errors } = usePage().props
  const router = useRouter()
  const empty = {
    honours: 'none',
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
          honours: item.honours,
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
    const options = { preserveScroll: true, data: values, onSuccess: onDone, onError: onErrors }

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
  const suffix = locale === 'fr' ? 'Fr' : 'En'

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`period-${prefix}`}>Période</Label>
          <Input
            id={`period-${prefix}`}
            value={values[`period${suffix}`]}
            onChange={set(`period${suffix}`)}
          />
          <FieldError errors={errors} field={`period${suffix}`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`title-${prefix}`}>Intitulé</Label>
          <Input
            id={`title-${prefix}`}
            value={values[`title${suffix}`]}
            onChange={set(`title${suffix}`)}
          />
          <FieldError errors={errors} field={`title${suffix}`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`place-${prefix}`}>Lieu / statut</Label>
          <Input
            id={`place-${prefix}`}
            value={values[`place${suffix}`]}
            onChange={set(`place${suffix}`)}
          />
          <FieldError errors={errors} field={`place${suffix}`} />
        </div>
      </div>
      <div className="max-w-xs space-y-2">
        <Label htmlFor={`honours-${prefix}`}>Mention (commune aux deux langues)</Label>
        <Select id={`honours-${prefix}`} value={values.honours} onChange={set('honours')}>
          {HONOURS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError errors={errors} field="honours" />
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
  const { locale, setLocale, focusErrors } = useAdminLocale()

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
    <Tabs value={locale} onValueChange={setLocale} className="contents">
      <AdminPage
        title="Accueil"
        action={
          <LocaleTabsList status={translationStatus([form.data.heroRolesEn, form.data.nowEn])} />
        }
      >
        <form onSubmit={submitSettings} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Général</CardTitle>
              <CardDescription>Affiché tel quel dans les deux langues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm space-y-2">
                <Label htmlFor="heroLocation">Localisation</Label>
                <Input
                  id="heroLocation"
                  value={form.data.heroLocation}
                  onChange={(event) => form.setData('heroLocation', event.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <TabsContent value="fr" className="space-y-6">
            <HomeContents
              locale="fr"
              roles={form.data.heroRolesFr}
              now={form.data.nowFr}
              onRolesChange={(value) => form.setData('heroRolesFr', value)}
              onNowChange={(value) => form.setData('nowFr', value)}
            />
          </TabsContent>
          <TabsContent value="en" className="space-y-6">
            <HomeContents
              locale="en"
              roles={form.data.heroRolesEn}
              now={form.data.nowEn}
              onRolesChange={(value) => form.setData('heroRolesEn', value)}
              onNowChange={(value) => form.setData('nowEn', value)}
            />
          </TabsContent>

          <Button type="submit" disabled={form.processing}>
            Enregistrer le contenu
          </Button>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Parcours</CardTitle>
            <CardDescription>
              La timeline affichée sur l’accueil, du plus récent au plus ancien. Les champs suivent
              l’onglet de langue ; sans traduction anglaise, l’étape française est servie aux deux.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimelineForm item={null} locale={locale} onErrors={focusErrors} />
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
                      {item.periodFr} · {item.placeFr}
                      {item.honours !== 'none' ? ` · ${honoursLabel(item.honours)}` : ''}
                      {item.titleEn ? ' · EN ✓' : ''}
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
                        editingId === item.id
                          ? 'Annuler la modification'
                          : `Modifier ${item.titleFr}`
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
                  <TimelineForm
                    item={item}
                    locale={locale}
                    onErrors={focusErrors}
                    onDone={() => setEditingId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminPage>
    </Tabs>
  )
}
