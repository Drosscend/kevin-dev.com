import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Indexes matching the public query patterns: published listings
 * ordered by publication date, and pivot lookups from the tag /
 * technology / project side (Postgres does not index FKs).
 */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('articles', (table) => {
      table.index(['status', 'published_at'], 'articles_status_published_at_index')
    })
    this.schema.alterTable('projects', (table) => {
      table.index(['status', 'published_at'], 'projects_status_published_at_index')
    })
    this.schema.alterTable('article_tag', (table) => {
      table.index(['tag_id'], 'article_tag_tag_id_index')
    })
    this.schema.alterTable('project_technology', (table) => {
      table.index(['technology_id'], 'project_technology_technology_id_index')
    })
    this.schema.alterTable('article_project', (table) => {
      table.index(['project_id'], 'article_project_project_id_index')
    })
  }

  async down() {
    this.schema.alterTable('articles', (table) => {
      table.dropIndex([], 'articles_status_published_at_index')
    })
    this.schema.alterTable('projects', (table) => {
      table.dropIndex([], 'projects_status_published_at_index')
    })
    this.schema.alterTable('article_tag', (table) => {
      table.dropIndex([], 'article_tag_tag_id_index')
    })
    this.schema.alterTable('project_technology', (table) => {
      table.dropIndex([], 'project_technology_technology_id_index')
    })
    this.schema.alterTable('article_project', (table) => {
      table.dropIndex([], 'article_project_project_id_index')
    })
  }
}
