import { inject } from '@adonisjs/core'
import Category from '#blog/models/category'
import { CategoryRepository } from '#blog/repositories/category_repository'
import { err, ok, type Result } from '#core/result'
import type { CategoryPayload } from '#blog/repositories/category_repository'

export interface SaveCategoryParams {
  id?: number
  payload: CategoryPayload
}

export interface CategoryNotFoundError {
  type: 'category_not_found'
}

export type SaveCategoryResult = Result<Category, CategoryNotFoundError>

@inject()
export class SaveCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(params: SaveCategoryParams): Promise<SaveCategoryResult> {
    if (params.id === undefined) {
      return ok(await this.categories.save(new Category(), params.payload))
    }

    const category = await this.categories.findById(params.id)

    if (!category) {
      return err({ type: 'category_not_found' })
    }

    return ok(await this.categories.save(category, params.payload))
  }
}
