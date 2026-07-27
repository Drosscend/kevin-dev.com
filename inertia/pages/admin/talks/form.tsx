import { type FormEvent, useRef } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Trash2 } from 'lucide-react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { DateTimePicker } from '~/components/ui/date_time_picker'
import { DatePicker } from '~/components/ui/date_picker'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import DraftBanner from '~/components/admin/draft_banner'
import { useAdminLocale } from '~/components/admin/locale_tabs'
import PreviewLink from '~/components/admin/preview_link'
import PublicationActions, { type PublicationStatus } from '~/components/admin/publication_actions'
import ToggleList from '~/components/admin/toggle_list'
import TranslationCard from '~/components/admin/translation_card'
import { MediaPicker, type MediaPickerItem } from '~/components/admin/media_picker'
import { EMPTY_TRANSLATION, SLUG_LOCKED_HINT, slugify, type TranslationValues } from '~/lib/admin'
import { useDraftAutosave } from '~/lib/use_draft_autosave'
import { formatFrDateTime } from '~/lib/dates'

type LinkValues = {
  label: string
  url: string
  type: string
}

type TalkData = {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  eventDate: string | null
  eventName: string
  city: string
  technologyIds: number[]
  links: LinkValues[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }

type TalkFormProps = {
  talk: TalkData | null
  options: { technologies: Option[]; media: MediaPickerItem[] }
}

const EMPTY_LINK: LinkValues = { label: '', url: '', type: 'slides' }

const LINK_TYPES = [
  { value: 'slides', label: 'Slides' },
  { value: 'video', label: 'Vidéo' },
  { value: 'event', label: 'Événement' },
  { value: 'code', label: 'Code' },
  { value: 'other', label: 'Autre' },
] as const

export default function TalkForm({ talk, options }: TalkFormProps) {
  const { errors } = usePage().props

  const form = useForm({
    slug: talk?.slug ?? '',
    status: talk?.status ?? ('draft' as PublicationStatus),
    coverMediaId: talk?.coverMediaId ?? null,
    eventDate: talk?.eventDate ?? '',
    eventName: talk?.eventName ?? '',
    city: talk?.city ?? '',
    technologyIds: talk?.technologyIds ?? [],
    links: talk?.links ?? [],
    publishedAt: talk?.publishedAt ?? null,
    fr: talk?.fr ?? { ...EMPTY_TRANSLATION },
    en: talk?.en ?? undefined,
  })

  const slugTouched = useRef(talk !== null)
  const { locale, setLocale, focusErrors } = useAdminLocale('talks', Boolean(talk?.en))

  const draft = useDraftAutosave({
    storageKey: `talk:${talk?.id ?? 'new'}`,
    data: form.data,
    restore: (data) => form.setData(data),
  })

  function setFrench(values: TranslationValues) {
    form.setData((data) => ({
      ...data,
      fr: values,
      slug: slugTouched.current ? data.slug : slugify(values.title),
    }))
  }

  function toggleTechnology(id: number) {
    const current = form.data.technologyIds
    form.setData(
      'technologyIds',
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  function setLink(index: number, link: LinkValues) {
    form.setData(
      'links',
      form.data.links.map((current, i) => (i === index ? link : current))
    )
  }

  function save(status: PublicationStatus) {
    form.transform((data) => ({
      ...data,
      status,
      links: data.links.filter((link) => link.label.trim() !== '' || link.url.trim() !== ''),
    }))
    const visitOptions = {
      preserveScroll: true,
      onSuccess: () => draft.clearDraft(),
      onError: focusErrors,
    }
    if (talk) {
      form.put(client.urlFor('admin.talks.update', { id: talk.id }), visitOptions)
    } else {
      form.post(client.urlFor('admin.talks.store'), visitOptions)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    save(form.data.status)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {talk ? 'Modifier l’intervention' : 'Nouvelle intervention'}
        </h1>
        <div className="flex items-center gap-4">
          {talk && <PreviewLink kind="talks" slug={talk.slug} title={talk.fr.title} showLabel />}
          <Link
            route="admin.talks.index"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            ← Toutes les interventions
          </Link>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {draft.hasDraft && (
          <DraftBanner
            savedAt={draft.draftSavedAt}
            onRestore={draft.restoreDraft}
            onDiscard={draft.discardDraft}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (partagé FR/EN)</Label>
                <Input
                  id="slug"
                  value={form.data.slug}
                  disabled={talk?.hasBeenOnline}
                  onChange={(event) => {
                    slugTouched.current = true
                    form.setData('slug', event.target.value)
                  }}
                />
                {talk?.hasBeenOnline && (
                  <p className="text-muted-foreground text-xs">{SLUG_LOCKED_HINT}</p>
                )}
                <FieldError errors={errors} field="slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture</Label>
                <MediaPicker
                  id="cover"
                  media={options.media}
                  value={form.data.coverMediaId}
                  onChange={(mediaId) => form.setData('coverMediaId', mediaId)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date de l’intervention</Label>
                <DatePicker
                  id="eventDate"
                  clearable={false}
                  value={form.data.eventDate}
                  onChange={(next) => form.setData('eventDate', next ?? '')}
                />
                <FieldError errors={errors} field="eventDate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventName">Événement</Label>
                <Input
                  id="eventName"
                  placeholder="Meetup Lyon JS, DevFest…"
                  value={form.data.eventName}
                  onChange={(event) => form.setData('eventName', event.target.value)}
                />
                <FieldError errors={errors} field="eventName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville (optionnel)</Label>
                <Input
                  id="city"
                  value={form.data.city}
                  onChange={(event) => form.setData('city', event.target.value)}
                />
                <FieldError errors={errors} field="city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Date de publication (optionnel)</Label>
                <DateTimePicker
                  id="publishedAt"
                  value={form.data.publishedAt}
                  onChange={(next) => form.setData('publishedAt', next)}
                />
                <p className="text-muted-foreground text-xs">
                  Une date future programme la publication : l’intervention restera invisible du
                  public jusque-là.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies abordées</Label>
              <ToggleList
                options={options.technologies.map((technology) => ({
                  id: technology.id,
                  label: technology.name,
                }))}
                selected={form.data.technologyIds}
                onToggle={toggleTechnology}
                empty="Aucune technologie définie."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Liens externes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setData('links', [...form.data.links, { ...EMPTY_LINK }])}
            >
              Ajouter un lien
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.data.links.length === 0 && (
              <p className="text-muted-foreground text-sm">Aucun lien.</p>
            )}
            {form.data.links.map((link, index) => (
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
                  {LINK_TYPES.map((type) => (
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
                  onClick={() =>
                    form.setData(
                      'links',
                      form.data.links.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <FieldError errors={errors} field="links" />
          </CardContent>
        </Card>

        <TranslationCard
          locale={locale}
          onLocaleChange={setLocale}
          fr={form.data.fr}
          en={form.data.en}
          errors={errors}
          onFrChange={setFrench}
          onEnChange={(values) => form.setData('en', values)}
          untranslatedLabel="Cette intervention n’existe qu’en français."
          removalDescription="Supprimer la version anglaise de cette intervention ? Elle disparaîtra du site au prochain enregistrement."
        />

        <div className="flex items-center gap-3">
          <PublicationActions
            status={form.data.status}
            hasBeenOnline={Boolean(talk?.hasBeenOnline)}
            processing={form.processing}
            onSave={save}
          />
          {talk?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {formatFrDateTime(talk.publishedAt)}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
