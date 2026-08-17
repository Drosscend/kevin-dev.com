import { Link, useRouter } from '@adonisjs/inertia/react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import PreviewLink from '~/components/admin/preview_link'
import EmptyState from '~/components/admin/empty_state'
import StatusBadge from '~/components/admin/status_badge'
import type { PublicationStatus } from '#types/content'

type ArticleRow = {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  publishedAt: string | null
  scheduled: boolean
  category: string | null
}

type ArticlesIndexProps = {
  articles: ArticleRow[]
}

export default function ArticlesIndex({ articles }: ArticlesIndexProps) {
  const router = useRouter()

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
            <li
              key={article.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <Link
                  route="admin.articles.edit"
                  routeParams={{ id: article.id }}
                  className="hover:text-primary font-medium transition-colors"
                >
                  {article.title}
                </Link>
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {article.slug}
                  {article.category ? ` · ${article.category}` : ''}
                  {article.hasEnglish ? ' · FR + EN' : ' · FR'}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                <StatusBadge
                  status={article.status}
                  detail={article.publishedAt}
                  scheduled={article.scheduled}
                />
                <span className="flex items-center gap-3">
                  <PreviewLink kind="articles" slug={article.slug} title={article.title} />
                  <ConfirmButton
                    description={`Supprimer « ${article.title} » ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.articles.destroy', routeParams: { id: article.id } },
                        { preserveScroll: true }
                      )
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
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
