import { type FormEvent, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import ArticleContent from '~/components/article_content'

type TranslationValues = {
  title: string
  summary: string
  contentMarkdown: string
}

type ArticleData = {
  id: number
  slug: string
  status: 'draft' | 'published'
  categoryId: number | null
  coverMediaId: number | null
  tagIds: number[]
  publishedAt: string | null
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }
type MediaOption = { id: number; alt: string }

type ArticleFormProps = {
  article: ArticleData | null
  options: { categories: Option[]; tags: Option[]; media: MediaOption[] }
}

const EMPTY_TRANSLATION: TranslationValues = { title: '', summary: '', contentMarkdown: '' }

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function xsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function TranslationFields({
  prefix,
  values,
  onChange,
  errors,
}: {
  prefix: 'fr' | 'en'
  values: TranslationValues
  onChange: (values: TranslationValues) => void
  errors: Record<string, string | string[]>
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-title`}>Titre</Label>
        <Input
          id={`${prefix}-title`}
          value={values.title}
          onChange={(event) => onChange({ ...values, title: event.target.value })}
        />
        {errors[`${prefix}.title`] && (
          <p className="text-destructive text-sm">{errors[`${prefix}.title`]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-summary`}>Résumé</Label>
        <textarea
          id={`${prefix}-summary`}
          className="border-input min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          value={values.summary}
          onChange={(event) => onChange({ ...values, summary: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-content`}>Contenu (Markdown)</Label>
        <textarea
          id={`${prefix}-content`}
          className="border-input min-h-80 w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm"
          value={values.contentMarkdown}
          onChange={(event) => onChange({ ...values, contentMarkdown: event.target.value })}
        />
        {errors[`${prefix}.contentMarkdown`] && (
          <p className="text-destructive text-sm">{errors[`${prefix}.contentMarkdown`]}</p>
        )}
      </div>
    </div>
  )
}

export default function ArticleForm({ article, options }: ArticleFormProps) {
  const { errors } = usePage().props as unknown as {
    errors: Record<string, string | string[]>
  }

  const form = useForm({
    slug: article?.slug ?? '',
    status: article?.status ?? ('draft' as 'draft' | 'published'),
    categoryId: article?.categoryId ?? null,
    coverMediaId: article?.coverMediaId ?? null,
    tagIds: article?.tagIds ?? [],
    fr: article?.fr ?? { ...EMPTY_TRANSLATION },
    en: article?.en,
  })

  const slugTouched = useRef(article !== null)
  const [withEnglish, setWithEnglish] = useState(Boolean(article?.en))
  const [preview, setPreview] = useState<{ locale: 'fr' | 'en'; html: string } | null>(null)

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

  async function loadPreview(locale: 'fr' | 'en') {
    const markdown = locale === 'fr' ? form.data.fr.contentMarkdown : form.data.en?.contentMarkdown
    if (!markdown) {
      return
    }
    const response = await fetch('/admin/articles/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken(),
      },
      body: JSON.stringify({ markdown }),
    })
    if (response.ok) {
      const { html } = await response.json()
      setPreview({ locale, html })
    }
  }

  function submit(status: 'draft' | 'published') {
    return (event: FormEvent) => {
      event.preventDefault()
      form.transform((data) => ({
        ...data,
        status,
        en: withEnglish ? (data.en ?? { ...EMPTY_TRANSLATION }) : undefined,
      }))
      if (article) {
        form.put(`/admin/articles/${article.id}`, { preserveScroll: true })
      } else {
        form.post('/admin/articles', { preserveScroll: true })
      }
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {article ? 'Modifier l’article' : 'Nouvel article'}
        </h1>
        <Link href="/admin/articles" className="text-muted-foreground text-sm hover:underline">
          ← Tous les articles
        </Link>
      </div>

      <form onSubmit={submit(form.data.status)} className="space-y-6">
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
                {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
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
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Image de couverture (Open Graph)</Label>
                <select
                  id="cover"
                  className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
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
                </select>
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
            <Button type="button" variant="outline" size="sm" onClick={() => loadPreview('fr')}>
              Aperçu FR
            </Button>
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
              <Button type="button" variant="outline" size="sm" onClick={() => loadPreview('en')}>
                Aperçu EN
              </Button>
            </CardContent>
          )}
        </Card>

        {preview && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Aperçu ({preview.locale.toUpperCase()})</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(null)}>
                Fermer
              </Button>
            </CardHeader>
            <CardContent>
              <ArticleContent html={preview.html} />
            </CardContent>
          </Card>
        )}

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
