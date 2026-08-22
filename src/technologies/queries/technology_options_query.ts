import { inject } from '@adonisjs/core'
import Technology from '#technologies/models/technology'

export interface TechnologyOption {
  id: number
  name: string
}

@inject()
export class TechnologyOptionsQuery {
  async execute(): Promise<TechnologyOption[]> {
    const technologies = await Technology.query().select('id', 'name').orderBy('name')

    return technologies.map((technology) => ({ id: technology.id, name: technology.name }))
  }
}
