import { useRouter } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, Trash2Icon, XIcon } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { TIMELINE_HONOURS, type TimelineHonours } from '#types/content'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import LocaleTabsList, { translationStatus, useAdminLocale } from '~/components/admin/locale_tabs'
import FieldError from '~/components/field_error'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Tabs } from '~/components/ui/tabs'
import { type InertiaProps } from '~/types'
import type { Locale } from '#types/i18n'
import type { Data } from '@generated/data'

const HONOURS_LABELS = {
  none: 'Sans mention',
  fair: 'Assez bien',
  good: 'Bien',
  very_good: 'Très bien',
} satisfies Record<TimelineHonours, string>

const HONOURS = TIMELINE_HONOURS.map((value) => ({ value, label: HONOURS_LABELS[value] }))

const honoursLabel = (value: string) => HONOURS.find((option) => option.value === value)?.label

type TimelineProps = InertiaProps<{
  timeline: Data.Pages.TimelineRow[]
}>

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
  item: Data.Pages.TimelineRow | null
  locale: Locale
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
      router.visit({ route: 'admin.timeline.update', routeParams: { id: item.id } }, options)
      return
    }

    router.visit(
      { route: 'admin.timeline.store' },
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

export default function Timeline({ timeline }: TimelineProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)
  const { locale, setLocale, focusErrors } = useAdminLocale('timeline')

  const englishValues = timeline.flatMap((item) => [item.periodEn, item.titleEn, item.placeEn])

  function move(item: Data.Pages.TimelineRow, direction: 'up' | 'down') {
    router.visit(
      { route: 'admin.timeline.move', routeParams: { id: item.id } },
      { preserveScroll: true, data: { direction } }
    )
  }

  return (
    <Tabs value={locale} onValueChange={setLocale} className="contents">
      <AdminPage
        title="Parcours"
        action={<LocaleTabsList status={translationStatus(englishValues)} />}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ajouter une étape</CardTitle>
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
                      <ArrowUpIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === timeline.length - 1}
                      aria-label={`Descendre ${item.titleFr}`}
                      onClick={() => move(item, 'down')}
                    >
                      <ArrowDownIcon className="size-4" />
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
                        <XIcon className="size-4" />
                      ) : (
                        <PencilIcon className="size-4" />
                      )}
                    </Button>
                    <ConfirmButton
                      description={`Supprimer « ${item.titleFr} » du parcours ?`}
                      onConfirm={() =>
                        router.visit(
                          { route: 'admin.timeline.destroy', routeParams: { id: item.id } },
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
                          <Trash2Icon className="size-4" />
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
