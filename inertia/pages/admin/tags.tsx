import TaxonomyPage, { type TaxonomyItem } from '~/components/admin/taxonomy_page'

type TagsProps = {
  tags: TaxonomyItem[]
}

export default function Tags({ tags }: TagsProps) {
  return <TaxonomyPage title="Tags" route="admin.tags" items={tags} />
}
