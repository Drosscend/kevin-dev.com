import { type FormEvent, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import ArticleContent from '~/components/article_content'
import TranslationFields from '~/components/admin/translation_fields'
import {
  EMPTY_TRANSLATION,
  fetchMarkdownPreview,
  slugify,
  type TranslationValues,
} from '~/lib/admin'

type LinkValues = {
  label: string
  url: string
  type: string
}

type ProjectData = {
  id: number
  slug: string
  status: 'draft' | 'published'
  coverMediaId: number | null
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  links: LinkValues[]
  publishedAt: string | null
  fr: TranslationValues
  en: TranslationValues | null
}

type Option = { id: number; name: string }
type ArticleOption = { id: number; title: string }
type MediaOption = { id: number; alt: string }

type ProjectFormProps = {
  project: ProjectData | null
  options: { technologies: Option[]; articles: ArticleOption[]; media: MediaOption[] }
}

const EMPTY_LINK: LinkValues = { label: '', url: '', type: 'github' }

const LINK_TYPES = [
  { value: 'github', label: 'GitHub' },
  { value: 'demo', label: 'Démo' },
  { value: 'release', label: 'Release' },
  { value: 'store', label: 'Store' },
  { value: 'other', label: 'Autre' },
] as const

export default function ProjectForm({ project, options }: ProjectFormProps) {
  const { errors } = usePage().props as unknown as {
    errors: Record<string, string | string[]>
  }

  const form = useForm({
    slug: project?.slug ?? '',
    status: project?.status ?? ('draft' as 'draft' | 'published'),
    coverMediaId: project?.coverMediaId ?? null,
    startedAt: project?.startedAt ?? null,
    endedAt: project?.endedAt ?? null,
    featured: project?.featured ?? false,
    technologyIds: project?.technologyIds ?? [],
    articleIds: project?.articleIds ?? [],
    links: project?.links ?? [],
    fr: project?.fr ?? { ...EMPTY_TRANSLATION },
    en: project?.en,
  })

  const slugTouched = useRef(project !== null)
  const [withEnglish, setWithEnglish] = useState(Boolean(project?.en))
  const [preview, setPreview] = useState<{ locale: 'fr' | 'en'; html: string } | null>(null)

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

  async function loadPreview(locale: 'fr' | 'en') {
    const markdown = locale === 'fr' ? form.data.fr.contentMarkdown : form.data.en?.contentMarkdown
    if (!markdown) {
      return
    }
    const html = await fetchMarkdownPreview(markdown)
    if (html) {
      setPreview({ locale, html })
    }
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
      if (project) {
        form.put(`/admin/projects/${project.id}`, { preserveScroll: true })
      } else {
        form.post('/admin/projects', { preserveScroll: true })
      }
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {project ? 'Modifier le projet' : 'Nouveau projet'}
        </h1>
        <Link
          href="/admin/projects"
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          ← Tous les projets
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
                <Label htmlFor="cover">Image de couverture</Label>
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
              <div className="space-y-2">
                <Label htmlFor="startedAt">Début du projet</Label>
                <Input
                  type="date"
                  id="startedAt"
                  value={form.data.startedAt ?? ''}
                  onChange={(event) => form.setData('startedAt', event.target.value || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endedAt">Fin du projet (vide si en cours)</Label>
                <Input
                  type="date"
                  id="endedAt"
                  value={form.data.endedAt ?? ''}
                  onChange={(event) => form.setData('endedAt', event.target.value || null)}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.data.featured}
                onChange={(event) => form.setData('featured', event.target.checked)}
              />
              Mis en avant sur l’accueil
            </label>

            <div className="space-y-2">
              <Label>Technologies</Label>
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
                      onChange={() => toggleId('technologyIds', technology.id)}
                    />
                    {technology.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Articles liés</Label>
              <div className="flex flex-wrap gap-2">
                {options.articles.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucun article.</p>
                )}
                {options.articles.map((article) => (
                  <label
                    key={article.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.data.articleIds.includes(article.id)}
                      onChange={() => toggleId('articleIds', article.id)}
                    />
                    {article.title}
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
                <select
                  className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
                  value={link.type}
                  onChange={(event) => setLink(index, { ...link, type: event.target.value })}
                >
                  {LINK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
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
            {errors['links'] && <p className="text-destructive text-sm">{errors['links']}</p>}
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
          {project?.publishedAt && (
            <span className="text-muted-foreground text-sm">
              Première publication : {project.publishedAt}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
