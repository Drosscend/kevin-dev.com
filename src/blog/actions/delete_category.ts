import { inject } from '@adonisjs/core'
import { CategoryRepository } from '#blog/repositories/category_repository'
import { err, ok, type Result } from '#core/result'
import type { CategoryNotFoundError } from '#blog/actions/save_category'

export type DeleteCategoryResult = Result<null, CategoryNotFoundError>

@inject()
export class DeleteCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(id: number): Promise<DeleteCategoryResult> {
    const category = await this.categories.findById(id)

    if (!category) {
      return err({ type: 'category_not_found' })
    }

    await this.categories.delete(category)

    return ok(null)
  }
}
