import TaxonomyPage, { type TaxonomyItem } from '~/components/admin/taxonomy_page'

type CategoriesProps = {
  categories: TaxonomyItem[]
}

export default function Categories({ categories }: CategoriesProps) {
  return <TaxonomyPage title="Catégories" baseUrl="/admin/categories" items={categories} />
}
