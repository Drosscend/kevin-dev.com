import { upsertTranslations } from '#shared/content/translations'
import Technology from '#technologies/models/technology'
import type { TechnologyCategory } from '#types/content'

export interface TechnologyPayload {
  slug: string
  name: string
  category: TechnologyCategory
  logoMediaId: number | null
  docsUrl: string | null
  descriptionFr: string
  descriptionEn: string | null
}

export class TechnologyRepository {
  async findById(id: number) {
    return Technology.find(id)
  }

  async save(technology: Technology, payload: TechnologyPayload) {
    technology.merge({
      slug: payload.slug,
      name: payload.name,
      category: payload.category,
      logoMediaId: payload.logoMediaId,
      docsUrl: payload.docsUrl,
    })
    await technology.save()

    await upsertTranslations(technology.related('translations'), {
      fr: { description: payload.descriptionFr },
      en: payload.descriptionEn ? { description: payload.descriptionEn } : null,
    })

    return technology
  }

  async delete(technology: Technology) {
    await technology.delete()
  }
}
