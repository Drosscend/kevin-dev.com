import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

type ArticleRow = {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: 'draft' | 'published'
  publishedAt: string | null
  category: string | null
}

type ArticlesIndexProps = {
  articles: ArticleRow[]
}

export default function ArticlesIndex({ articles }: ArticlesIndexProps) {
  function remove(article: ArticleRow) {
    if (confirm(`Supprimer « ${article.title} » ? Cette action est définitive.`)) {
      router.delete(`/admin/articles/${article.id}`, { preserveScroll: true })
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/create">
            <Plus className="size-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun article pour l’instant.</p>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {article.title}
                  </Link>
                  <p className="text-muted-foreground truncate text-xs">
                    {article.slug}
                    {article.category ? ` — ${article.category}` : ''}
                    {article.hasEnglish ? ' — FR + EN' : ' — FR'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {article.status === 'published' ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Publié{article.publishedAt ? ` le ${article.publishedAt}` : ''}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Brouillon</span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => remove(article)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
