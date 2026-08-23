/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  seo: {
    sitemap: typeof routes['seo.sitemap']
    robots: typeof routes['seo.robots']
    security: typeof routes['seo.security']
    rss: typeof routes['seo.rss']
  }
  en: {
    seo: {
      rss: typeof routes['en.seo.rss']
    }
    llms: {
      cv: typeof routes['en.llms.cv']
      legal: typeof routes['en.llms.legal']
    }
    home: typeof routes['en.home']
    cv: {
      show: typeof routes['en.cv.show']
    }
    legal: {
      show: typeof routes['en.legal.show']
    }
    blog: {
      index: typeof routes['en.blog.index']
      show: typeof routes['en.blog.show']
    }
    projects: {
      index: typeof routes['en.projects.index']
      show: typeof routes['en.projects.show']
    }
    talks: {
      index: typeof routes['en.talks.index']
      show: typeof routes['en.talks.show']
    }
    technologies: {
      index: typeof routes['en.technologies.index']
      show: typeof routes['en.technologies.show']
    }
    contact: {
      show: typeof routes['en.contact.show']
      store: typeof routes['en.contact.store']
    }
  }
  llms: {
    index: typeof routes['llms.index']
    cv: typeof routes['llms.cv']
    legal: typeof routes['llms.legal']
  }
  health: typeof routes['health']
  home: typeof routes['home']
  cv: {
    show: typeof routes['cv.show']
    pdf: typeof routes['cv.pdf']
  }
  legal: {
    show: typeof routes['legal.show']
  }
  admin: {
    home: {
      index: typeof routes['admin.home.index']
      update: typeof routes['admin.home.update']
    }
    timeline: {
      index: typeof routes['admin.timeline.index']
      store: typeof routes['admin.timeline.store']
      update: typeof routes['admin.timeline.update']
      move: typeof routes['admin.timeline.move']
      destroy: typeof routes['admin.timeline.destroy']
    }
    cv: {
      index: typeof routes['admin.cv.index']
      update: typeof routes['admin.cv.update']
      pdf: {
        store: typeof routes['admin.cv.pdf.store']
      }
    }
    legal: {
      index: typeof routes['admin.legal.index']
      update: typeof routes['admin.legal.update']
    }
    articles: {
      index: typeof routes['admin.articles.index']
      create: typeof routes['admin.articles.create']
      store: typeof routes['admin.articles.store']
      edit: typeof routes['admin.articles.edit']
      update: typeof routes['admin.articles.update']
      destroy: typeof routes['admin.articles.destroy']
    }
    categories: {
      index: typeof routes['admin.categories.index']
      store: typeof routes['admin.categories.store']
      update: typeof routes['admin.categories.update']
      destroy: typeof routes['admin.categories.destroy']
    }
    dashboard: typeof routes['admin.dashboard']
    media: {
      index: typeof routes['admin.media.index']
      store: typeof routes['admin.media.store']
      upload: typeof routes['admin.media.upload']
      destroy: typeof routes['admin.media.destroy']
    }
    projects: {
      index: typeof routes['admin.projects.index']
      create: typeof routes['admin.projects.create']
      store: typeof routes['admin.projects.store']
      edit: typeof routes['admin.projects.edit']
      update: typeof routes['admin.projects.update']
      destroy: typeof routes['admin.projects.destroy']
    }
    talks: {
      index: typeof routes['admin.talks.index']
      create: typeof routes['admin.talks.create']
      store: typeof routes['admin.talks.store']
      edit: typeof routes['admin.talks.edit']
      update: typeof routes['admin.talks.update']
      destroy: typeof routes['admin.talks.destroy']
    }
    technologies: {
      index: typeof routes['admin.technologies.index']
      store: typeof routes['admin.technologies.store']
      update: typeof routes['admin.technologies.update']
      destroy: typeof routes['admin.technologies.destroy']
    }
    messages: {
      index: typeof routes['admin.messages.index']
      read: typeof routes['admin.messages.read']
      destroy: typeof routes['admin.messages.destroy']
    }
    login: typeof routes['admin.login'] & {
      store: typeof routes['admin.login.store']
    }
    totp: typeof routes['admin.totp'] & {
      store: typeof routes['admin.totp.store']
    }
    logout: typeof routes['admin.logout']
    security: typeof routes['admin.security'] & {
      store: typeof routes['admin.security.store']
      destroy: typeof routes['admin.security.destroy']
      recovery: {
        store: typeof routes['admin.security.recovery.store']
      }
    }
  }
  blog: {
    index: typeof routes['blog.index']
    show: typeof routes['blog.show']
  }
  uploads: {
    show: typeof routes['uploads.show']
  }
  projects: {
    index: typeof routes['projects.index']
    show: typeof routes['projects.show']
  }
  talks: {
    index: typeof routes['talks.index']
    show: typeof routes['talks.show']
  }
  technologies: {
    index: typeof routes['technologies.index']
    show: typeof routes['technologies.show']
  }
  contact: {
    show: typeof routes['contact.show']
    store: typeof routes['contact.store']
  }
}
