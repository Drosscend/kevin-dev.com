/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  en: {
    home: typeof routes['en.home']
    seo: {
      rss: typeof routes['en.seo.rss']
    }
    llms: {
      cv: typeof routes['en.llms.cv']
      legal: typeof routes['en.llms.legal']
    }
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
    cv: {
      show: typeof routes['en.cv.show']
    }
    legal: {
      show: typeof routes['en.legal.show']
    }
    contact: {
      show: typeof routes['en.contact.show']
      store: typeof routes['en.contact.store']
    }
  }
  health: typeof routes['health']
  seo: {
    sitemap: typeof routes['seo.sitemap']
    robots: typeof routes['seo.robots']
    rss: typeof routes['seo.rss']
  }
  llms: {
    index: typeof routes['llms.index']
    cv: typeof routes['llms.cv']
    legal: typeof routes['llms.legal']
  }
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
  cv: {
    show: typeof routes['cv.show']
    pdf: typeof routes['cv.pdf']
  }
  legal: {
    show: typeof routes['legal.show']
  }
  contact: {
    show: typeof routes['contact.show']
    store: typeof routes['contact.store']
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
    pages: {
      index: typeof routes['admin.pages.index']
      update: typeof routes['admin.pages.update']
      pdf: {
        store: typeof routes['admin.pages.pdf.store']
      }
    }
    messages: {
      index: typeof routes['admin.messages.index']
      read: typeof routes['admin.messages.read']
      destroy: typeof routes['admin.messages.destroy']
    }
  }
}
