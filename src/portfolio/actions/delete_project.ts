import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { ProjectRepository } from '#portfolio/repositories/project_repository'
import type { ProjectNotFoundError } from '#portfolio/actions/save_project'

export type DeleteProjectResult = Result<null, ProjectNotFoundError>

@inject()
export class DeleteProject {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(id: number): Promise<DeleteProjectResult> {
    const project = await this.projects.findById(id)

    if (!project) {
      return err({ type: 'project_not_found' })
    }

    await this.projects.delete(project)

    return ok(null)
  }
}
