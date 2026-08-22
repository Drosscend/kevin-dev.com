import { inject } from '@adonisjs/core'
import CategoryRowTransformer from '#app/blog/transformers/category_row_transformer'
import { CategoryAdminListQuery } from '#blog/queries/category_admin_list_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ManageCategoriesController {
  constructor(private readonly categoryAdminList: CategoryAdminListQuery) {}

  async render({ inertia }: HttpContext) {
    return inertia.render('admin/categories', {
      categories: CategoryRowTransformer.transform(await this.categoryAdminList.execute()),
    })
  }
}
