import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

type ProjectRow = {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: 'draft' | 'published'
  featured: boolean
  publishedAt: string | null
  technologiesCount: number
}

type ProjectsIndexProps = {
  projects: ProjectRow[]
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  function remove(project: ProjectRow) {
    if (confirm(`Supprimer « ${project.title} » ? Cette action est définitive.`)) {
      router.delete(`/admin/projects/${project.id}`, { preserveScroll: true })
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projets</h1>
        <Button asChild>
          <Link href="/admin/projects/create">
            <Plus className="size-4" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun projet pour l’instant.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    {project.featured && <Star className="size-3.5 text-amber-500" />}
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                  </span>
                  <p className="text-muted-foreground truncate text-xs">
                    {project.slug}
                    {project.hasEnglish ? ' — FR + EN' : ' — FR'} — {project.technologiesCount}{' '}
                    techno(s)
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {project.status === 'published' ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Publié{project.publishedAt ? ` le ${project.publishedAt}` : ''}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Brouillon</span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => remove(project)}
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
