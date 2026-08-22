import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { TechnologyRepository } from '#technologies/repositories/technology_repository'
import type { TechnologyNotFoundError } from '#technologies/actions/save_technology'

export type DeleteTechnologyResult = Result<null, TechnologyNotFoundError>

@inject()
export class DeleteTechnology {
  constructor(private readonly technologies: TechnologyRepository) {}

  async execute(id: number): Promise<DeleteTechnologyResult> {
    const technology = await this.technologies.findById(id)

    if (!technology) {
      return err({ type: 'technology_not_found' })
    }

    await this.technologies.delete(technology)

    return ok(null)
  }
}
