import { type FormEvent, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { DateTimePicker } from '~/components/ui/date_time_picker'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import FieldError from '~/components/field_error'
import { formatFrDateTime } from '~/lib/dates'
import ConfirmButton from '~/components/admin/confirm_button'
import DraftBanner from '~/components/admin/draft_banner'
import EmptyState from '~/components/admin/empty_state'
import LocaleTabsList, {
  entryTranslationStatus,
  useAdminLocale,
} from '~/components/admin/locale_tabs'
import PreviewLink from '~/components/admin/preview_link'
import PublicationActions, { type PublicationStatus } from '~/components/admin/publication_actions'
import TranslationFields from '~/components/admin/translation_fields'
import { MediaPicker, type MediaPickerItem } from '~/components/admin/media_picker'
import { EMPTY_TRANSLATION, SLUG_LOCKED_HINT, slugify, type TranslationValues } from '~/lib/admin'
import { useDraftAutosave } from '~/lib/use_draft_autosave'

type ArticleData = {
  id: number
  slug: string
  status: PublicationStatus
  categoryId: number | null
  coverMediaId: number | null
  technologyIds: number[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }

type ArticleFormProps = {
  article: ArticleData | null
  options: { categories: Option[]; technologies: Option[]; media: MediaPickerItem[] }
}

export default function ArticleForm({ article, options }: ArticleFormProps) {
  const { errors } = usePage().props

  const form = useForm({
    slug: article?.slug ?? '',
    status: article?.status ?? ('draft' as PublicationStatus),
    categoryId: article?.categoryId ?? null,
    coverMediaId: article?.coverMediaId ?? null,
    technologyIds: article?.technologyIds ?? [],
    publishedAt: article?.publishedAt ?? null,
    fr: article?.fr ?? { ...EMPTY_TRANSLATION },
    en: article?.en,
  })

  const slugTouched = useRef(article !== null)
  const [withEnglish, setWithEnglish] = useState(Boolean(article?.en))
  const { locale, setLocale, focusErrors } = useAdminLocale()

  const draft = useDraftAutosave({
    storageKey: `article:${article?.id ?? 'new'}`,
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

  function addEnglish() {
    setWithEnglish(true)
    form.setData('en', { ...EMPTY_TRANSLATION })
  }

  function removeEnglish() {
    setWithEnglish(false)
    form.setData('en', undefined)
    setLocale('fr')
  }

  function save(status: PublicationStatus) {
    form.transform((data) => ({
      ...data,
      status,
      en: withEnglish ? (data.en ?? { ...EMPTY_TRANSLATION }) : undefined,
    }))
    const visitOptions = {
      preserveScroll: true,
      onSuccess: () => draft.clearDraft(),
      onError: focusErrors,
    }
    if (article) {
      form.put(client.urlFor('admin.articles.update', { id: article.id }), visitOptions)
    } else {
      form.post(client.urlFor('admin.articles.store'), visitOptions)
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
          {article ? 'Modifier l’article' : 'Nouvel article'}
        </h1>
        <div className="flex items-center gap-4">
          {article && (
            <PreviewLink kind="articles" slug={article.slug} title={article.fr.title} showLabel />
          )}
          <Link
            route="admin.articles.index"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            ← Tous les articles
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
                  disabled={article?.hasBeenOnline}
                  onChange={(event) => {
                    slugTouched.current = true
                    form.setData('slug', event.target.value)
                  }}
                />
                {article?.hasBeenOnline && (
                  <p className="text-muted-foreground text-xs">{SLUG_LOCKED_HINT}</p>
                )}
                <FieldError errors={errors} field="slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  id="category"
                  value={form.data.categoryId ?? ''}
                  onChange={(event) =>
                    form.setData(
                      'categoryId',
                      event.target.value === '' ? null : Number(event.target.value)
                    )
                  }
                >
                  <option value="">Aucune</option>
                  {options.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture (Open Graph)</Label>
                <MediaPicker
                  id="cover"
                  media={options.media}
                  value={form.data.coverMediaId}
                  onChange={(mediaId) => form.setData('coverMediaId', mediaId)}
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
                  Une date future programme la publication : l’article restera invisible du public
                  jusque-là.
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

        <Tabs value={locale} onValueChange={setLocale}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contenu</CardTitle>
              <LocaleTabsList
                status={entryTranslationStatus(form.data.fr, withEnglish ? form.data.en : null)}
              />
            </CardHeader>
            <CardContent>
              <TabsContent value="fr">
                <TranslationFields
                  prefix="fr"
                  values={form.data.fr}
                  onChange={setFrench}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en" className="space-y-4">
                {withEnglish ? (
                  <>
                    <TranslationFields
                      prefix="en"
                      values={form.data.en ?? EMPTY_TRANSLATION}
                      onChange={(values) => form.setData('en', values)}
                      errors={errors}
                    />
                    <ConfirmButton
                      title="Retirer la traduction"
                      description="Supprimer la version anglaise de cet article ? Elle disparaîtra du site au prochain enregistrement."
                      confirmLabel="Retirer"
                      onConfirm={removeEnglish}
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          Retirer la traduction anglaise
                        </Button>
                      }
                    />
                  </>
                ) : (
                  <div className="space-y-3">
                    <EmptyState>Cet article n’existe qu’en français.</EmptyState>
                    <Button type="button" variant="outline" size="sm" onClick={addEnglish}>
                      Ajouter la traduction anglaise
                    </Button>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="flex items-center gap-3">
          <PublicationActions
            status={form.data.status}
            hasBeenOnline={Boolean(article?.hasBeenOnline)}
            processing={form.processing}
            onSave={save}
          />
          {article?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {formatFrDateTime(article.publishedAt)}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
