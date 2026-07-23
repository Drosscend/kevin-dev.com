import { type FormEvent, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import DraftBanner from '~/components/admin/draft_banner'
import TranslationFields from '~/components/admin/translation_fields'
import { EMPTY_TRANSLATION, SLUG_LOCKED_HINT, slugify, type TranslationValues } from '~/lib/admin'
import { useDraftAutosave } from '~/lib/use_draft_autosave'

type ArticleData = {
  id: number
  slug: string
  status: 'draft' | 'published'
  categoryId: number | null
  coverMediaId: number | null
  tagIds: number[]
  publishedAt: string | null
  slugLocked: boolean
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }
type MediaOption = { id: number; alt: string }

type ArticleFormProps = {
  article: ArticleData | null
  options: { categories: Option[]; tags: Option[]; media: MediaOption[] }
}

export default function ArticleForm({ article, options }: ArticleFormProps) {
  const { errors } = usePage().props

  const form = useForm({
    slug: article?.slug ?? '',
    status: article?.status ?? ('draft' as 'draft' | 'published'),
    categoryId: article?.categoryId ?? null,
    coverMediaId: article?.coverMediaId ?? null,
    tagIds: article?.tagIds ?? [],
    publishedAt: article?.publishedAt ?? null,
    fr: article?.fr ?? { ...EMPTY_TRANSLATION },
    en: article?.en,
  })

  const slugTouched = useRef(article !== null)
  const [withEnglish, setWithEnglish] = useState(Boolean(article?.en))

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

  function toggleTag(id: number) {
    form.setData(
      'tagIds',
      form.data.tagIds.includes(id)
        ? form.data.tagIds.filter((tagId) => tagId !== id)
        : [...form.data.tagIds, id]
    )
  }

  function submit(status: 'draft' | 'published') {
    return (event: FormEvent) => {
      event.preventDefault()
      form.transform((data) => ({
        ...data,
        status,
        en: withEnglish ? (data.en ?? { ...EMPTY_TRANSLATION }) : undefined,
      }))
      const visitOptions = { preserveScroll: true, onSuccess: () => draft.clearDraft() }
      if (article) {
        form.put(client.urlFor('admin.articles.update', { id: article.id }), visitOptions)
      } else {
        form.post(client.urlFor('admin.articles.store'), visitOptions)
      }
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {article ? 'Modifier l’article' : 'Nouvel article'}
        </h1>
        <Link
          route="admin.articles.index"
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          ← Tous les articles
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
                  disabled={article?.slugLocked}
                  onChange={(event) => {
                    slugTouched.current = true
                    form.setData('slug', event.target.value)
                  }}
                />
                {article?.slugLocked && (
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
                <Label htmlFor="publishedAt">Date de publication (optionnel)</Label>
                <Input
                  type="datetime-local"
                  id="publishedAt"
                  value={form.data.publishedAt ?? ''}
                  onChange={(event) => form.setData('publishedAt', event.target.value || null)}
                />
                <p className="text-muted-foreground text-xs">
                  Une date future programme la publication : l’article restera invisible du public
                  jusque-là.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {options.tags.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucun tag défini.</p>
                )}
                {options.tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.data.tagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
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
          {article?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {article.publishedAt}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
