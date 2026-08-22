import { Link } from '@adonisjs/inertia/react'
import { Plus } from 'lucide-react'
import AdminPage from '~/components/admin/admin_page'
import { ContentList, ContentListRow } from '~/components/admin/content_list'
import EmptyState from '~/components/admin/empty_state'
import { Button } from '~/components/ui/button'
import type { Data } from '@generated/data'

type ArticlesIndexProps = {
  articles: Data.Blog.ArticleRow[]
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
        <ContentList>
          {articles.map((article) => (
            <ContentListRow
              key={article.id}
              kind="articles"
              entry={article}
              meta={
                <>
                  {article.slug}
                  {article.category ? ` · ${article.category}` : ''}
                  {article.hasEnglish ? ' · FR + EN' : ' · FR'}
                </>
              }
            />
          ))}
        </ContentList>
      )}
    </AdminPage>
  )
}
