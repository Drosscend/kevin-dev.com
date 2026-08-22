import { useForm, usePage } from '@inertiajs/react'
import { type FormEvent, useRef } from 'react'
import { client } from '~/client'
import AdminPage, { AdminBackLink } from '~/components/admin/admin_page'
import DraftBanner from '~/components/admin/draft_banner'
import { useAdminLocale } from '~/components/admin/locale_tabs'
import { MediaPicker, type MediaPickerItem } from '~/components/admin/media_picker'
import PreviewLink from '~/components/admin/preview_link'
import PublicationActions from '~/components/admin/publication_actions'
import SlugField from '~/components/admin/slug_field'
import ToggleList from '~/components/admin/toggle_list'
import TranslationCard from '~/components/admin/translation_card'
import FieldError from '~/components/field_error'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { DateTimePicker } from '~/components/ui/date_time_picker'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { EMPTY_TRANSLATION, slugify, type TranslationValues } from '~/lib/admin'
import { formatFrDateTime } from '~/lib/dates'
import { useDraftAutosave } from '~/lib/use_draft_autosave'
import { type InertiaProps } from '~/types'
import type { PublicationStatus } from '#types/content'
import type { Data } from '@generated/data'

type Option = { id: number; name: string }

type ArticleFormProps = InertiaProps<{
  article: Data.Blog.ArticleForm | null
  options: { categories: Option[]; technologies: Option[]; media: MediaPickerItem[] }
}>

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
    en: article?.en ?? undefined,
  })

  const slugTouched = useRef(article !== null)
  const { locale, setLocale, focusErrors } = useAdminLocale('articles', Boolean(article?.en))

  const draft = useDraftAutosave({
    storageKey: `article:${article?.id ?? 'new'}`,
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
    form.transform((data) => ({ ...data, status }))
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
    <AdminPage
      title={article ? 'Modifier l’article' : 'Nouvel article'}
      className="max-w-5xl"
      action={
        <div className="flex items-center gap-4">
          {article && (
            <PreviewLink kind="articles" slug={article.slug} title={article.fr.title} showLabel />
          )}
          <AdminBackLink route="admin.articles.index">Tous les articles</AdminBackLink>
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
                locked={Boolean(article?.hasBeenOnline)}
                onChange={(value) => {
                  slugTouched.current = true
                  form.setData('slug', value)
                }}
                errors={errors}
              />
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
                <FieldError errors={errors} field="categoryId" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture (Open Graph)</Label>
                <MediaPicker
                  id="cover"
                  media={options.media}
                  value={form.data.coverMediaId}
                  onChange={(mediaId) => form.setData('coverMediaId', mediaId)}
                />
                <FieldError errors={errors} field="coverMediaId" />
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

        <TranslationCard
          locale={locale}
          onLocaleChange={setLocale}
          fr={form.data.fr}
          en={form.data.en}
          errors={errors}
          onFrChange={setFrench}
          onEnChange={(values) => form.setData('en', values)}
          untranslatedLabel="Cet article n’existe qu’en français."
          removalDescription="Supprimer la version anglaise de cet article ? Elle disparaîtra du site au prochain enregistrement."
        />

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
        <FieldError errors={errors} field="status" />
      </form>
    </AdminPage>
  )
}
