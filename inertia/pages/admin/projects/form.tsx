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
import ToggleList, { SwitchField } from '~/components/admin/toggle_list'
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

type ProjectData = {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  links: LinkValues[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }
type ArticleOption = { id: number; title: string }

type ProjectFormProps = {
  project: ProjectData | null
  options: { technologies: Option[]; articles: ArticleOption[]; media: MediaPickerItem[] }
}

const EMPTY_LINK: LinkValues = { label: '', url: '', type: 'github' }

const LINK_TYPES = [
  { value: 'github', label: 'GitHub' },
  { value: 'demo', label: 'Démo' },
  { value: 'release', label: 'Release' },
  { value: 'store', label: 'Store' },
  { value: 'paper', label: 'Mémoire / rapport' },
  { value: 'other', label: 'Autre' },
] as const

export default function ProjectForm({ project, options }: ProjectFormProps) {
  const { errors } = usePage().props

  const form = useForm({
    slug: project?.slug ?? '',
    status: project?.status ?? ('draft' as PublicationStatus),
    coverMediaId: project?.coverMediaId ?? null,
    startedAt: project?.startedAt ?? null,
    endedAt: project?.endedAt ?? null,
    featured: project?.featured ?? false,
    technologyIds: project?.technologyIds ?? [],
    articleIds: project?.articleIds ?? [],
    links: project?.links ?? [],
    publishedAt: project?.publishedAt ?? null,
    fr: project?.fr ?? { ...EMPTY_TRANSLATION },
    en: project?.en ?? undefined,
  })

  const slugTouched = useRef(project !== null)
  const { locale, setLocale, focusErrors } = useAdminLocale('projects', Boolean(project?.en))

  const draft = useDraftAutosave({
    storageKey: `project:${project?.id ?? 'new'}`,
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

  function toggleId(field: 'technologyIds' | 'articleIds', id: number) {
    const current = form.data[field]
    form.setData(field, current.includes(id) ? current.filter((v) => v !== id) : [...current, id])
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
    if (project) {
      form.put(client.urlFor('admin.projects.update', { id: project.id }), visitOptions)
    } else {
      form.post(client.urlFor('admin.projects.store'), visitOptions)
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
          {project ? 'Modifier le projet' : 'Nouveau projet'}
        </h1>
        <div className="flex items-center gap-4">
          {project && (
            <PreviewLink kind="projects" slug={project.slug} title={project.fr.title} showLabel />
          )}
          <Link
            route="admin.projects.index"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            ← Tous les projets
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
                  disabled={project?.hasBeenOnline}
                  onChange={(event) => {
                    slugTouched.current = true
                    form.setData('slug', event.target.value)
                  }}
                />
                {project?.hasBeenOnline && (
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
                <Label htmlFor="startedAt">Début du projet</Label>
                <DatePicker
                  id="startedAt"
                  value={form.data.startedAt}
                  onChange={(next) => form.setData('startedAt', next)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endedAt">Fin du projet (vide si en cours)</Label>
                <DatePicker
                  id="endedAt"
                  value={form.data.endedAt}
                  onChange={(next) => form.setData('endedAt', next)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Date de publication (optionnel)</Label>
                <DateTimePicker
                  id="publishedAt"
                  value={form.data.publishedAt}
                  onChange={(next) => form.setData('publishedAt', next)}
                />
                <p className="text-muted-foreground text-xs">
                  Une date future programme la publication : le projet restera invisible du public
                  jusque-là.
                </p>
              </div>
            </div>

            <SwitchField
              label="Mis en avant sur l’accueil"
              checked={form.data.featured}
              onCheckedChange={(checked) => form.setData('featured', checked)}
            />

            <div className="space-y-2">
              <Label>Technologies</Label>
              <ToggleList
                options={options.technologies.map((technology) => ({
                  id: technology.id,
                  label: technology.name,
                }))}
                selected={form.data.technologyIds}
                onToggle={(id) => toggleId('technologyIds', id)}
                empty="Aucune technologie définie."
              />
            </div>

            <div className="space-y-2">
              <Label>Articles liés</Label>
              <ToggleList
                options={options.articles.map((article) => ({
                  id: article.id,
                  label: article.title,
                }))}
                selected={form.data.articleIds}
                onToggle={(id) => toggleId('articleIds', id)}
                empty="Aucun article."
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
          untranslatedLabel="Ce projet n’existe qu’en français."
          removalDescription="Supprimer la version anglaise de ce projet ? Elle disparaîtra du site au prochain enregistrement."
        />

        <div className="flex items-center gap-3">
          <PublicationActions
            status={form.data.status}
            hasBeenOnline={Boolean(project?.hasBeenOnline)}
            processing={form.processing}
            onSave={save}
          />
          {project?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {formatFrDateTime(project.publishedAt)}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
