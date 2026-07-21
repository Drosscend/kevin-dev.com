import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
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
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
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
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'en.home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'blog.index': { paramsTuple?: []; params?: {} }
    'blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'en.blog.index': { paramsTuple?: []; params?: {} }
    'en.blog.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
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
  }
  POST: {
    'admin.login.store': { paramsTuple?: []; params?: {} }
    'admin.totp.store': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'admin.security.store': { paramsTuple?: []; params?: {} }
    'admin.media.store': { paramsTuple?: []; params?: {} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.tags.store': { paramsTuple?: []; params?: {} }
    'admin.articles.store': { paramsTuple?: []; params?: {} }
    'admin.articles.preview': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.security.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'admin.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}