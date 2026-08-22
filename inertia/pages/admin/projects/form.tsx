import { useForm, usePage } from '@inertiajs/react'
import { type FormEvent, useRef } from 'react'
import { PROJECT_LINK_TYPES, type ProjectLinkType, type PublicationStatus } from '#types/content'
import { client } from '~/client'
import AdminPage, { AdminBackLink } from '~/components/admin/admin_page'
import DraftBanner from '~/components/admin/draft_banner'
import ExternalLinksCard, { withoutEmptyLinks } from '~/components/admin/external_links_card'
import { useAdminLocale } from '~/components/admin/locale_tabs'
import { MediaPicker, type MediaPickerItem } from '~/components/admin/media_picker'
import PreviewLink from '~/components/admin/preview_link'
import PublicationActions from '~/components/admin/publication_actions'
import SlugField from '~/components/admin/slug_field'
import ToggleList, { SwitchField } from '~/components/admin/toggle_list'
import TranslationCard from '~/components/admin/translation_card'
import FieldError from '~/components/field_error'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DatePicker } from '~/components/ui/date_picker'
import { DateTimePicker } from '~/components/ui/date_time_picker'
import { Label } from '~/components/ui/label'
import { EMPTY_TRANSLATION, slugify, type TranslationValues } from '~/lib/admin'
import { formatFrDateTime } from '~/lib/dates'
import { useDraftAutosave } from '~/lib/use_draft_autosave'
import type { Data } from '@generated/data'

type Option = { id: number; name: string }
type ArticleOption = { id: number; title: string }

type ProjectFormProps = {
  project: Data.Portfolio.ProjectForm | null
  options: { technologies: Option[]; articles: ArticleOption[]; media: MediaPickerItem[] }
}

const LINK_TYPE_LABELS: Record<ProjectLinkType, string> = {
  github: 'GitHub',
  demo: 'Démo',
  release: 'Release',
  store: 'Store',
  paper: 'Mémoire / rapport',
  other: 'Autre',
}

const LINK_TYPES = PROJECT_LINK_TYPES.map((value) => ({ value, label: LINK_TYPE_LABELS[value] }))

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

  function save(status: PublicationStatus) {
    form.transform((data) => ({ ...data, status, links: withoutEmptyLinks(data.links) }))
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
    <AdminPage
      title={project ? 'Modifier le projet' : 'Nouveau projet'}
      className="max-w-5xl"
      action={
        <div className="flex items-center gap-4">
          {project && (
            <PreviewLink kind="projects" slug={project.slug} title={project.fr.title} showLabel />
          )}
          <AdminBackLink route="admin.projects.index">Tous les projets</AdminBackLink>
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
                locked={Boolean(project?.hasBeenOnline)}
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
                <Label htmlFor="startedAt">Début du projet</Label>
                <DatePicker
                  id="startedAt"
                  value={form.data.startedAt}
                  onChange={(next) => form.setData('startedAt', next)}
                />
                <FieldError errors={errors} field="startedAt" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endedAt">Fin du projet (vide si en cours)</Label>
                <DatePicker
                  id="endedAt"
                  value={form.data.endedAt}
                  onChange={(next) => form.setData('endedAt', next)}
                />
                <FieldError errors={errors} field="endedAt" />
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
                <FieldError errors={errors} field="publishedAt" />
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
              <FieldError errors={errors} field="technologyIds" />
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
              <FieldError errors={errors} field="articleIds" />
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
        <FieldError errors={errors} field="status" />
      </form>
    </AdminPage>
  )
}
