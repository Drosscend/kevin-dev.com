import { useForm, usePage } from '@inertiajs/react'
import { type FormEvent, useRef } from 'react'
import { TALK_LINK_TYPES, type TalkLinkType, type PublicationStatus } from '#types/content'
import { client } from '~/client'
import AdminPage, { AdminBackLink } from '~/components/admin/admin_page'
import DraftBanner from '~/components/admin/draft_banner'
import ExternalLinksCard, { withoutEmptyLinks } from '~/components/admin/external_links_card'
import { useAdminLocale } from '~/components/admin/locale_tabs'
import { MediaPicker, type MediaPickerItem } from '~/components/admin/media_picker'
import PreviewLink from '~/components/admin/preview_link'
import PublicationActions from '~/components/admin/publication_actions'
import SlugField from '~/components/admin/slug_field'
import ToggleList from '~/components/admin/toggle_list'
import TranslationCard from '~/components/admin/translation_card'
import FieldError from '~/components/field_error'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date_picker'
import { DateTimePicker } from '~/components/ui/date_time_picker'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { EMPTY_TRANSLATION, slugify, type TranslationValues } from '~/lib/admin'
import { formatFrDateTime } from '~/lib/dates'
import { useDraftAutosave } from '~/lib/use_draft_autosave'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type Option = { id: number; name: string }

type TalkFormProps = InertiaProps<{
  talk: Data.Talks.TalkForm | null
  options: { technologies: Option[]; media: MediaPickerItem[] }
}>

const LINK_TYPE_LABELS = {
  slides: 'Slides',
  video: 'Vidéo',
  event: 'Événement',
  code: 'Code',
  other: 'Autre',
} satisfies Record<TalkLinkType, string>

const LINK_TYPES = TALK_LINK_TYPES.map((value) => ({ value, label: LINK_TYPE_LABELS[value] }))

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

  function save(status: PublicationStatus) {
    form.transform((data) => ({ ...data, status, links: withoutEmptyLinks(data.links) }))
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
    <AdminPage
      title={talk ? 'Modifier l’intervention' : 'Nouvelle intervention'}
      className="max-w-5xl"
      action={
        <div className="flex items-center gap-4">
          {talk && <PreviewLink kind="talks" slug={talk.slug} title={talk.fr.title} showLabel />}
          <AdminBackLink route="admin.talks.index">Toutes les interventions</AdminBackLink>
        </div>
      }
    >
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
              <SlugField
                value={form.data.slug}
                locked={Boolean(talk?.hasBeenOnline)}
                onChange={(value) => {
                  slugTouched.current = true
                  form.setData('slug', value)
                }}
                errors={errors}
              />
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture</Label>
                <MediaPicker
                  id="cover"
                  media={options.media}
                  value={form.data.coverMediaId}
                  onChange={(mediaId) => form.setData('coverMediaId', mediaId)}
                />
                <FieldError errors={errors} field="coverMediaId" />
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
                <FieldError errors={errors} field="publishedAt" />
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
              <FieldError errors={errors} field="technologyIds" />
            </div>
          </CardContent>
        </Card>

        <ExternalLinksCard
          links={form.data.links}
          types={LINK_TYPES}
          onChange={(links) => form.setData('links', links)}
          errors={errors}
        />

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
        <FieldError errors={errors} field="status" />
      </form>
    </AdminPage>
  )
}
