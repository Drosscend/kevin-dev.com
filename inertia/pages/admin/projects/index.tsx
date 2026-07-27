import { Link, useRouter } from '@adonisjs/inertia/react'
import { Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import PreviewLink from '~/components/admin/preview_link'
import EmptyState from '~/components/admin/empty_state'
import StatusBadge from '~/components/admin/status_badge'
import type { PublicationStatus } from '~/components/admin/publication_actions'
import { plural } from '~/lib/plural'

type ProjectRow = {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  featured: boolean
  publishedAt: string | null
  scheduled: boolean
  technologiesCount: number
}

type ProjectsIndexProps = {
  projects: ProjectRow[]
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const router = useRouter()

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
        <ul className="divide-y border-y">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <span className="flex items-center gap-1.5">
                  {project.featured && <Star className="size-3.5 text-amber-500" />}
                  <Link
                    route="admin.projects.edit"
                    routeParams={{ id: project.id }}
                    className="hover:text-primary font-medium transition-colors"
                  >
                    {project.title}
                  </Link>
                </span>
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {project.slug}
                  {project.hasEnglish ? ' · FR + EN' : ' · FR'} ·{' '}
                  {plural(project.technologiesCount, 'techno')}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                <StatusBadge
                  status={project.status}
                  detail={project.publishedAt}
                  scheduled={project.scheduled}
                />
                <span className="flex items-center gap-3">
                  <PreviewLink kind="projects" slug={project.slug} title={project.title} />
                  <ConfirmButton
                    description={`Supprimer « ${project.title} » ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.projects.destroy', routeParams: { id: project.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${project.title}`}
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
