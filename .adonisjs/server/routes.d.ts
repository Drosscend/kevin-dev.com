import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.rss': { paramsTuple?: []; params?: {} }
    'en.seo.rss': { paramsTuple?: []; params?: {} }
    'llms.index': { paramsTuple?: []; params?: {} }
    'llms.cv': { paramsTuple?: []; params?: {} }
    'en.llms.cv': { paramsTuple?: []; params?: {} }
    'llms.legal': { paramsTuple?: []; params?: {} }
    'en.llms.legal': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.projects.index': { paramsTuple?: []; params?: {} }
    'en.projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'technologies.index': { paramsTuple?: []; params?: {} }
    'technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.technologies.index': { paramsTuple?: []; params?: {} }
    'en.technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'cv.show': { paramsTuple?: []; params?: {} }
    'en.cv.show': { paramsTuple?: []; params?: {} }
    'cv.pdf': { paramsTuple?: []; params?: {} }
    'legal.show': { paramsTuple?: []; params?: {} }
    'en.legal.show': { paramsTuple?: []; params?: {} }
    'contact.show': { paramsTuple?: []; params?: {} }
    'contact.store': { paramsTuple?: []; params?: {} }
    'en.contact.show': { paramsTuple?: []; params?: {} }
    'en.contact.store': { paramsTuple?: []; params?: {} }
    'uploads.show': { paramsTuple: [ParamValue,ParamValue]; params: {'key': ParamValue,'file': ParamValue} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.login.store': { paramsTuple?: []; params?: {} }
    'admin.totp': { paramsTuple?: []; params?: {} }
    'admin.totp.store': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'admin.security': { paramsTuple?: []; params?: {} }
    'admin.security.store': { paramsTuple?: []; params?: {} }
    'admin.security.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.media.store': { paramsTuple?: []; params?: {} }
    'admin.media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.index': { paramsTuple?: []; params?: {} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.index': { paramsTuple?: []; params?: {} }
    'admin.tags.store': { paramsTuple?: []; params?: {} }
    'admin.tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.index': { paramsTuple?: []; params?: {} }
    'admin.articles.create': { paramsTuple?: []; params?: {} }
    'admin.articles.store': { paramsTuple?: []; params?: {} }
    'admin.articles.preview': { paramsTuple?: []; params?: {} }
    'admin.articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.index': { paramsTuple?: []; params?: {} }
    'admin.technologies.store': { paramsTuple?: []; params?: {} }
    'admin.technologies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.projects.index': { paramsTuple?: []; params?: {} }
    'admin.projects.create': { paramsTuple?: []; params?: {} }
    'admin.projects.store': { paramsTuple?: []; params?: {} }
    'admin.projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.pages.update': { paramsTuple?: []; params?: {} }
    'admin.pages.pdf': { paramsTuple?: []; params?: {} }
    'admin.messages.index': { paramsTuple?: []; params?: {} }
    'admin.messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.rss': { paramsTuple?: []; params?: {} }
    'en.seo.rss': { paramsTuple?: []; params?: {} }
    'llms.index': { paramsTuple?: []; params?: {} }
    'llms.cv': { paramsTuple?: []; params?: {} }
    'en.llms.cv': { paramsTuple?: []; params?: {} }
    'llms.legal': { paramsTuple?: []; params?: {} }
    'en.llms.legal': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.projects.index': { paramsTuple?: []; params?: {} }
    'en.projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'technologies.index': { paramsTuple?: []; params?: {} }
    'technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.technologies.index': { paramsTuple?: []; params?: {} }
    'en.technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'cv.show': { paramsTuple?: []; params?: {} }
    'en.cv.show': { paramsTuple?: []; params?: {} }
    'cv.pdf': { paramsTuple?: []; params?: {} }
    'legal.show': { paramsTuple?: []; params?: {} }
    'en.legal.show': { paramsTuple?: []; params?: {} }
    'contact.show': { paramsTuple?: []; params?: {} }
    'en.contact.show': { paramsTuple?: []; params?: {} }
    'uploads.show': { paramsTuple: [ParamValue,ParamValue]; params: {'key': ParamValue,'file': ParamValue} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.totp': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.security': { paramsTuple?: []; params?: {} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.categories.index': { paramsTuple?: []; params?: {} }
    'admin.tags.index': { paramsTuple?: []; params?: {} }
    'admin.articles.index': { paramsTuple?: []; params?: {} }
    'admin.articles.create': { paramsTuple?: []; params?: {} }
    'admin.articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.index': { paramsTuple?: []; params?: {} }
    'admin.projects.index': { paramsTuple?: []; params?: {} }
    'admin.projects.create': { paramsTuple?: []; params?: {} }
    'admin.projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.messages.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.rss': { paramsTuple?: []; params?: {} }
    'en.seo.rss': { paramsTuple?: []; params?: {} }
    'llms.index': { paramsTuple?: []; params?: {} }
    'llms.cv': { paramsTuple?: []; params?: {} }
    'en.llms.cv': { paramsTuple?: []; params?: {} }
    'llms.legal': { paramsTuple?: []; params?: {} }
    'en.llms.legal': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.projects.index': { paramsTuple?: []; params?: {} }
    'en.projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'technologies.index': { paramsTuple?: []; params?: {} }
    'technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.technologies.index': { paramsTuple?: []; params?: {} }
    'en.technologies.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'cv.show': { paramsTuple?: []; params?: {} }
    'en.cv.show': { paramsTuple?: []; params?: {} }
    'cv.pdf': { paramsTuple?: []; params?: {} }
    'legal.show': { paramsTuple?: []; params?: {} }
    'en.legal.show': { paramsTuple?: []; params?: {} }
    'contact.show': { paramsTuple?: []; params?: {} }
    'en.contact.show': { paramsTuple?: []; params?: {} }
    'uploads.show': { paramsTuple: [ParamValue,ParamValue]; params: {'key': ParamValue,'file': ParamValue} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.totp': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.security': { paramsTuple?: []; params?: {} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.categories.index': { paramsTuple?: []; params?: {} }
    'admin.tags.index': { paramsTuple?: []; params?: {} }
    'admin.articles.index': { paramsTuple?: []; params?: {} }
    'admin.articles.create': { paramsTuple?: []; params?: {} }
    'admin.articles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.index': { paramsTuple?: []; params?: {} }
    'admin.projects.index': { paramsTuple?: []; params?: {} }
    'admin.projects.create': { paramsTuple?: []; params?: {} }
    'admin.projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.messages.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'contact.store': { paramsTuple?: []; params?: {} }
    'en.contact.store': { paramsTuple?: []; params?: {} }
    'admin.login.store': { paramsTuple?: []; params?: {} }
    'admin.totp.store': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'admin.security.store': { paramsTuple?: []; params?: {} }
    'admin.media.store': { paramsTuple?: []; params?: {} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.tags.store': { paramsTuple?: []; params?: {} }
    'admin.articles.store': { paramsTuple?: []; params?: {} }
    'admin.articles.preview': { paramsTuple?: []; params?: {} }
    'admin.technologies.store': { paramsTuple?: []; params?: {} }
    'admin.projects.store': { paramsTuple?: []; params?: {} }
    'admin.pages.pdf': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.security.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'admin.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.technologies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.pages.update': { paramsTuple?: []; params?: {} }
    'admin.messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}