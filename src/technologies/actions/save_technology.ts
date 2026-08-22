import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import Technology from '#technologies/models/technology'
import { TechnologyRepository } from '#technologies/repositories/technology_repository'
import type { TechnologyPayload } from '#technologies/repositories/technology_repository'

export interface SaveTechnologyParams {
  id?: number
  payload: TechnologyPayload
}

export interface TechnologyNotFoundError {
  type: 'technology_not_found'
}

export type SaveTechnologyResult = Result<Technology, TechnologyNotFoundError>

@inject()
export class SaveTechnology {
  constructor(private readonly technologies: TechnologyRepository) {}

  async execute(params: SaveTechnologyParams): Promise<SaveTechnologyResult> {
    if (params.id === undefined) {
      return ok(await this.technologies.save(new Technology(), params.payload))
    }

    const technology = await this.technologies.findById(params.id)

    if (!technology) {
      return err({ type: 'technology_not_found' })
    }

    return ok(await this.technologies.save(technology, params.payload))
  }
}
