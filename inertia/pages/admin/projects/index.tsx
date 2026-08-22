import { Link } from '@adonisjs/inertia/react'
import { Plus, Star } from 'lucide-react'
import AdminPage from '~/components/admin/admin_page'
import { ContentList, ContentListRow } from '~/components/admin/content_list'
import EmptyState from '~/components/admin/empty_state'
import { Button } from '~/components/ui/button'
import { plural } from '~/lib/plural'
import type { Data } from '@generated/data'

type ProjectsIndexProps = {
  projects: Data.Portfolio.ProjectRow[]
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  return (
    <AdminPage
      title="Projets"
      action={
        <Button asChild>
          <Link route="admin.projects.create">
            <Plus className="size-4" />
            Nouveau projet
          </Link>
        </Button>
      }
    >
      {projects.length === 0 ? (
        <EmptyState>Aucun projet pour l’instant.</EmptyState>
      ) : (
        <ContentList>
          {projects.map((project) => (
            <ContentListRow
              key={project.id}
              kind="projects"
              entry={project}
              leading={project.featured && <Star className="size-3.5 text-amber-500" />}
              meta={
                <>
                  {project.slug}
                  {project.hasEnglish ? ' · FR + EN' : ' · FR'} ·{' '}
                  {plural(project.technologiesCount, 'techno')}
                </>
              }
            />
          ))}
        </ContentList>
      )}
    </AdminPage>
  )
}
