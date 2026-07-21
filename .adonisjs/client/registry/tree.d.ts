/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  en: {
    home: typeof routes['en.home']
    blog: {
      index: typeof routes['en.blog.index']
      show: typeof routes['en.blog.show']
    }
    projects: {
      index: typeof routes['en.projects.index']
      show: typeof routes['en.projects.show']
    }
    technologies: {
      index: typeof routes['en.technologies.index']
      show: typeof routes['en.technologies.show']
    }
  }
  health: typeof routes['health']
  blog: {
    index: typeof routes['blog.index']
    show: typeof routes['blog.show']
  }
  projects: {
    index: typeof routes['projects.index']
    show: typeof routes['projects.show']
  }
  technologies: {
    index: typeof routes['technologies.index']
    show: typeof routes['technologies.show']
  }
  uploads: {
    show: typeof routes['uploads.show']
  }
  admin: {
    login: typeof routes['admin.login'] & {
      store: typeof routes['admin.login.store']
    }
    totp: typeof routes['admin.totp'] & {
      store: typeof routes['admin.totp.store']
    }
    dashboard: typeof routes['admin.dashboard']
    logout: typeof routes['admin.logout']
    security: typeof routes['admin.security'] & {
      store: typeof routes['admin.security.store']
      destroy: typeof routes['admin.security.destroy']
    }
    media: {
      index: typeof routes['admin.media.index']
      store: typeof routes['admin.media.store']
      destroy: typeof routes['admin.media.destroy']
    }
    categories: {
      index: typeof routes['admin.categories.index']
      store: typeof routes['admin.categories.store']
      update: typeof routes['admin.categories.update']
      destroy: typeof routes['admin.categories.destroy']
    }
    tags: {
      index: typeof routes['admin.tags.index']
      store: typeof routes['admin.tags.store']
      update: typeof routes['admin.tags.update']
      destroy: typeof routes['admin.tags.destroy']
    }
    articles: {
      index: typeof routes['admin.articles.index']
      create: typeof routes['admin.articles.create']
      store: typeof routes['admin.articles.store']
      preview: typeof routes['admin.articles.preview']
      edit: typeof routes['admin.articles.edit']
      update: typeof routes['admin.articles.update']
      destroy: typeof routes['admin.articles.destroy']
    }
    technologies: {
      index: typeof routes['admin.technologies.index']
      store: typeof routes['admin.technologies.store']
      update: typeof routes['admin.technologies.update']
      destroy: typeof routes['admin.technologies.destroy']
    }
    projects: {
      index: typeof routes['admin.projects.index']
      create: typeof routes['admin.projects.create']
      store: typeof routes['admin.projects.store']
      edit: typeof routes['admin.projects.edit']
      update: typeof routes['admin.projects.update']
      destroy: typeof routes['admin.projects.destroy']
    }
  }
}
