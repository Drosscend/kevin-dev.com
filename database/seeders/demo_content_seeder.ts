import { rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import sharp from 'sharp'
import db from '@adonisjs/lucid/services/db'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import Article from '#models/article'
import Category from '#models/category'
import ContactMessage from '#models/contact_message'
import Project from '#models/project'
import Tag from '#models/tag'
import Technology from '#models/technology'
import TimelineEntry from '#models/timeline_entry'
import type Media from '#models/media'
import ArticleService from '#services/article_service'
import MarkdownService from '#services/markdown_service'
import MediaService from '#services/media_service'
import ProjectService from '#services/project_service'
import SettingsService from '#services/settings_service'
import {
  ARTICLES,
  CATEGORIES,
  CONTACT_MESSAGES,
  CV_EN,
  CV_FR,
  PROJECTS,
  TAGS,
  TECHNOLOGIES,
  TIMELINE,
  type Cover,
} from '#database/seeders/demo/content'

/**
 * Content tables wiped before reseeding, ordered so that the
 * truncation cascade stays predictable. Users and settings are left
 * alone: the admin account and the legal page survive a reseed.
 */
const CONTENT_TABLES = [
  'article_project',
  'article_tag',
  'article_translations',
  'articles',
  'category_translations',
  'categories',
  'tag_translations',
  'tags',
  'project_links',
  'project_technology',
  'project_translations',
  'projects',
  'technology_translations',
  'technologies',
  'timeline_entry_translations',
  'timeline_entries',
  'contact_messages',
  'media',
]

/**
 * Generates a cover image as a two-tone gradient with a few
 * geometric shapes, so every seeded entry gets a distinct visual
 * without shipping binary fixtures in the repository.
 */
async function makeCover(cover: Cover | null, alt: string): Promise<Media | null> {
  if (!cover) {
    return null
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${cover.from}"/>
        <stop offset="100%" stop-color="${cover.to}"/>
      </linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#g)"/>
    <circle cx="1280" cy="220" r="300" fill="#ffffff" fill-opacity="0.07"/>
    <circle cx="300" cy="760" r="220" fill="#ffffff" fill-opacity="0.05"/>
    <rect x="120" y="120" width="620" height="6" fill="#ffffff" fill-opacity="0.35"/>
  </svg>`

  const path = join(tmpdir(), `demo-cover-${cover.name}.png`)
  await writeFile(path, await sharp(Buffer.from(svg)).png().toBuffer())

  try {
    return await MediaService.store(
      { tmpPath: path, clientName: `${cover.name}.png` } as MultipartFile,
      alt
    )
  } finally {
    await rm(path, { force: true })
  }
}

/**
 * Fills the site with realistic demo content: technologies,
 * categories, tags, articles (published, draft and scheduled),
 * projects with covers and links, CV timeline, settings and contact
 * messages. Destructive by design — every content table is emptied
 * first — so it is restricted to development.
 */
export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    await this.#wipe()

    const technologies = await this.#seedTechnologies()
    const categories = await this.#seedCategories()
    const tags = await this.#seedTags()
    const articles = await this.#seedArticles(categories, tags)
    await this.#seedProjects(technologies, articles)
    await this.#seedTimeline()
    await this.#seedSettings()
    await this.#seedContactMessages()

    logger.info('Demo content seeded')
  }

  async #wipe() {
    await db.rawQuery(`TRUNCATE ${CONTENT_TABLES.join(', ')} RESTART IDENTITY CASCADE`)
    await drive.use().deleteAll('media')
  }

  async #seedTechnologies() {
    const bySlug = new Map<string, Technology>()

    for (const entry of TECHNOLOGIES) {
      const technology = await Technology.create({
        slug: entry.slug,
        name: entry.name,
        category: entry.category,
        logoMediaId: null,
      })
      await technology.related('translations').createMany([
        { locale: 'fr', description: entry.fr },
        { locale: 'en', description: entry.en },
      ])
      bySlug.set(entry.slug, technology)
    }

    return bySlug
  }

  async #seedCategories() {
    const bySlug = new Map<string, Category>()

    for (const entry of CATEGORIES) {
      const category = await Category.create({ slug: entry.slug })
      await category.related('translations').createMany([
        { locale: 'fr', name: entry.fr },
        { locale: 'en', name: entry.en },
      ])
      bySlug.set(entry.slug, category)
    }

    return bySlug
  }

  async #seedTags() {
    const bySlug = new Map<string, Tag>()

    for (const entry of TAGS) {
      const tag = await Tag.create({ slug: entry.slug })
      await tag.related('translations').createMany([
        { locale: 'fr', name: entry.fr },
        { locale: 'en', name: entry.en },
      ])
      bySlug.set(entry.slug, tag)
    }

    return bySlug
  }

  async #seedArticles(categories: Map<string, Category>, tags: Map<string, Tag>) {
    const bySlug = new Map<string, Article>()

    for (const entry of ARTICLES) {
      const cover = await makeCover(entry.cover, entry.fr.title)

      const article = await ArticleService.save(new Article(), {
        slug: entry.slug,
        status: entry.status,
        categoryId: categories.get(entry.category)?.id ?? null,
        coverMediaId: cover?.id ?? null,
        tagIds: entry.tags.map((slug) => tags.get(slug)!.id),
        publishedAt: entry.publishedAt,
        fr: entry.fr,
        en: entry.en,
      })

      bySlug.set(entry.slug, article)
    }

    return bySlug
  }

  async #seedProjects(technologies: Map<string, Technology>, articles: Map<string, Article>) {
    for (const entry of PROJECTS) {
      const cover = await makeCover(entry.cover, entry.fr.title)

      await ProjectService.save(new Project(), {
        slug: entry.slug,
        status: entry.status,
        coverMediaId: cover?.id ?? null,
        startedAt: entry.startedAt,
        endedAt: entry.endedAt,
        featured: entry.featured,
        technologyIds: entry.technologies.map((slug) => technologies.get(slug)!.id),
        articleIds: entry.articles.map((slug) => articles.get(slug)!.id),
        links: entry.links,
        publishedAt: entry.publishedAt,
        fr: entry.fr,
        en: entry.en,
      })
    }
  }

  async #seedTimeline() {
    for (const [index, entry] of TIMELINE.entries()) {
      const timelineEntry = await TimelineEntry.create({ position: index })
      await timelineEntry.related('translations').createMany([
        { locale: 'fr', ...entry.fr },
        { locale: 'en', ...entry.en },
      ])
    }
  }

  async #seedSettings() {
    await SettingsService.set(
      'now_fr',
      "En ce moment : refonte du back-office d'Atlas CMS, et une série d'articles sur la recherche vectorielle dans PostgreSQL."
    )
    await SettingsService.set(
      'now_en',
      'Right now: rebuilding the Atlas CMS back-office, and writing a series on vector search inside PostgreSQL.'
    )
    await SettingsService.set('hero_roles_fr', 'Développeur full-stack\nArchitecte applicatif')
    await SettingsService.set('hero_roles_en', 'Full-stack developer\nApplication architect')
    await SettingsService.set('hero_location', 'Lyon, France')
    await SettingsService.set(
      'talks_fr',
      "J'interviens ponctuellement en meetup sur la performance back-end, la recherche vectorielle et les pipelines de CI. Format court, retour d'expérience, sans diapositive commerciale."
    )
    await SettingsService.set(
      'talks_en',
      'I occasionally speak at meetups about back-end performance, vector search and CI pipelines. Short format, field notes, no sales deck.'
    )

    await SettingsService.set('cv_markdown_fr', CV_FR)
    await SettingsService.set('cv_html_fr', await MarkdownService.render(CV_FR))
    await SettingsService.set('cv_markdown_en', CV_EN)
    await SettingsService.set('cv_html_en', await MarkdownService.render(CV_EN))
  }

  async #seedContactMessages() {
    for (const entry of CONTACT_MESSAGES) {
      await ContactMessage.create({
        name: entry.name,
        email: entry.email,
        body: entry.body,
        readAt: entry.readAt ? DateTime.fromISO(entry.readAt) : null,
        createdAt: DateTime.fromISO(entry.createdAt),
      })
    }
  }
}
