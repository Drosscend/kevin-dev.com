import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import StatusBadge from '~/components/admin/status_badge'

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
  return (
    <AdminPage
      title="Articles"
      action={
        <Button asChild>
          <Link route="admin.articles.create">
            <Plus className="size-4" />
            Nouvel article
          </Link>
        </Button>
      }
    >
      {articles.length === 0 ? (
        <EmptyState>Aucun article pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {articles.map((article) => (
            <li key={article.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="hover:text-primary font-medium transition-colors"
                >
                  {article.title}
                </Link>
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {article.slug}
                  {article.category ? ` — ${article.category}` : ''}
                  {article.hasEnglish ? ' — FR + EN' : ' — FR'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={article.status} detail={article.publishedAt} />
                <ConfirmButton
                  description={`Supprimer « ${article.title} » ? Cette action est définitive.`}
                  onConfirm={() =>
                    router.delete(`/admin/articles/${article.id}`, { preserveScroll: true })
                  }
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      aria-label={`Supprimer ${article.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
