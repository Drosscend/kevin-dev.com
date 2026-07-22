import { type FormEvent, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Trash2 } from 'lucide-react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import DraftBanner from '~/components/admin/draft_banner'
import TranslationFields from '~/components/admin/translation_fields'
import { EMPTY_TRANSLATION, slugify, type TranslationValues } from '~/lib/admin'
import { useDraftAutosave } from '~/lib/use_draft_autosave'

type LinkValues = {
  label: string
  url: string
  type: string
}

type TalkData = {
  id: number
  slug: string
  status: 'draft' | 'published'
  coverMediaId: number | null
  eventDate: string | null
  eventName: string
  city: string
  technologyIds: number[]
  links: LinkValues[]
  publishedAt: string | null
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }
type MediaOption = { id: number; alt: string }

type TalkFormProps = {
  talk: TalkData | null
  options: { technologies: Option[]; media: MediaOption[] }
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
    status: talk?.status ?? ('draft' as 'draft' | 'published'),
    coverMediaId: talk?.coverMediaId ?? null,
    eventDate: talk?.eventDate ?? '',
    eventName: talk?.eventName ?? '',
    city: talk?.city ?? '',
    technologyIds: talk?.technologyIds ?? [],
    links: talk?.links ?? [],
    publishedAt: talk?.publishedAt ?? null,
    fr: talk?.fr ?? { ...EMPTY_TRANSLATION },
    en: talk?.en,
  })

  const slugTouched = useRef(talk !== null)
  const [withEnglish, setWithEnglish] = useState(Boolean(talk?.en))

  const draft = useDraftAutosave({
    storageKey: `talk:${talk?.id ?? 'new'}`,
    data: form.data,
    restore: (data) => {
      form.setData(data)
      setWithEnglish(Boolean(data.en))
    },
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

  function submit(status: 'draft' | 'published') {
    return (event: FormEvent) => {
      event.preventDefault()
      form.transform((data) => ({
        ...data,
        status,
        links: data.links.filter((link) => link.label.trim() !== '' || link.url.trim() !== ''),
        en: withEnglish ? (data.en ?? { ...EMPTY_TRANSLATION }) : undefined,
      }))
      const visitOptions = { preserveScroll: true, onSuccess: () => draft.clearDraft() }
      if (talk) {
        form.put(client.urlFor('admin.talks.update', { id: talk.id }), visitOptions)
      } else {
        form.post(client.urlFor('admin.talks.store'), visitOptions)
      }
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {talk ? 'Modifier l’intervention' : 'Nouvelle intervention'}
        </h1>
        <Link
          route="admin.talks.index"
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          ← Toutes les interventions
        </Link>
      </div>

      <form onSubmit={submit(form.data.status)} className="space-y-6">
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
                  onChange={(event) => {
                    slugTouched.current = true
                    form.setData('slug', event.target.value)
                  }}
                />
                <FieldError errors={errors} field="slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture</Label>
                <Select
                  id="cover"
                  value={form.data.coverMediaId ?? ''}
                  onChange={(event) =>
                    form.setData(
                      'coverMediaId',
                      event.target.value === '' ? null : Number(event.target.value)
                    )
                  }
                >
                  <option value="">Aucune</option>
                  {options.media.map((media) => (
                    <option key={media.id} value={media.id}>
                      {media.alt}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date de l’intervention</Label>
                <Input
                  type="date"
                  id="eventDate"
                  value={form.data.eventDate}
                  onChange={(event) => form.setData('eventDate', event.target.value)}
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
                <Input
                  type="datetime-local"
                  id="publishedAt"
                  value={form.data.publishedAt ?? ''}
                  onChange={(event) => form.setData('publishedAt', event.target.value || null)}
                />
                <p className="text-muted-foreground text-xs">
                  Une date future programme la publication : l’intervention restera invisible du
                  public jusque-là.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies abordées</Label>
              <div className="flex flex-wrap gap-2">
                {options.technologies.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucune technologie définie.</p>
                )}
                {options.technologies.map((technology) => (
                  <label
                    key={technology.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.data.technologyIds.includes(technology.id)}
                      onChange={() => toggleTechnology(technology.id)}
                    />
                    {technology.name}
                  </label>
                ))}
              </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Français</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TranslationFields
              prefix="fr"
              values={form.data.fr}
              onChange={setFrench}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>English (optionnel)</CardTitle>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={withEnglish}
                onChange={(event) => {
                  setWithEnglish(event.target.checked)
                  if (event.target.checked && !form.data.en) {
                    form.setData('en', { ...EMPTY_TRANSLATION })
                  }
                }}
              />
              Traduction anglaise
            </label>
          </CardHeader>
          {withEnglish && (
            <CardContent className="space-y-4">
              <TranslationFields
                prefix="en"
                values={form.data.en ?? EMPTY_TRANSLATION}
                onChange={(values) => form.setData('en', values)}
                errors={errors}
              />
            </CardContent>
          )}
        </Card>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={form.processing}
            onClick={submit('draft')}
          >
            Enregistrer en brouillon
          </Button>
          <Button type="button" disabled={form.processing} onClick={submit('published')}>
            Publier
          </Button>
          {talk?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {talk.publishedAt}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
