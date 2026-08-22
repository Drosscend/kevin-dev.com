import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import Project from '#portfolio/models/project'
import { ProjectRepository } from '#portfolio/repositories/project_repository'
import type { ProjectPayload } from '#portfolio/repositories/project_repository'

export interface SaveProjectParams {
  id?: number
  payload: ProjectPayload
}

export interface ProjectNotFoundError {
  type: 'project_not_found'
}

export type SaveProjectResult = Result<Project, ProjectNotFoundError>

@inject()
export class SaveProject {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(params: SaveProjectParams): Promise<SaveProjectResult> {
    if (params.id === undefined) {
      return ok(await this.projects.save(new Project(), params.payload))
    }

    const project = await this.projects.findById(params.id)

    if (!project) {
      return err({ type: 'project_not_found' })
    }

    return ok(await this.projects.save(project, params.payload))
  }
}
