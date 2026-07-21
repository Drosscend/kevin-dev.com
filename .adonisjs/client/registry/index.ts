/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'en.home': {
    methods: ["GET","HEAD"],
    pattern: '/en',
    tokens: [{"old":"/en","type":0,"val":"en","end":""}],
    types: placeholder as Registry['en.home']['types'],
  },
  'health': {
    methods: ["GET","HEAD"],
    pattern: '/health',
    tokens: [{"old":"/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['health']['types'],
  },
  'blog.index': {
    methods: ["GET","HEAD"],
    pattern: '/blog',
    tokens: [{"old":"/blog","type":0,"val":"blog","end":""}],
    types: placeholder as Registry['blog.index']['types'],
  },
  'blog.show': {
    methods: ["GET","HEAD"],
    pattern: '/blog/:slug',
    tokens: [{"old":"/blog/:slug","type":0,"val":"blog","end":""},{"old":"/blog/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['blog.show']['types'],
  },
  'en.blog.index': {
    methods: ["GET","HEAD"],
    pattern: '/en/blog',
    tokens: [{"old":"/en/blog","type":0,"val":"en","end":""},{"old":"/en/blog","type":0,"val":"blog","end":""}],
    types: placeholder as Registry['en.blog.index']['types'],
  },
  'en.blog.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/blog/:slug',
    tokens: [{"old":"/en/blog/:slug","type":0,"val":"en","end":""},{"old":"/en/blog/:slug","type":0,"val":"blog","end":""},{"old":"/en/blog/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['en.blog.show']['types'],
  },
  'uploads.show': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/:key/:file',
    tokens: [{"old":"/uploads/:key/:file","type":0,"val":"uploads","end":""},{"old":"/uploads/:key/:file","type":1,"val":"key","end":""},{"old":"/uploads/:key/:file","type":1,"val":"file","end":""}],
    types: placeholder as Registry['uploads.show']['types'],
  },
  'admin.login': {
    methods: ["GET","HEAD"],
    pattern: '/admin/login',
    tokens: [{"old":"/admin/login","type":0,"val":"admin","end":""},{"old":"/admin/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['admin.login']['types'],
  },
  'admin.login.store': {
    methods: ["POST"],
    pattern: '/admin/login',
    tokens: [{"old":"/admin/login","type":0,"val":"admin","end":""},{"old":"/admin/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['admin.login.store']['types'],
  },
  'admin.totp': {
    methods: ["GET","HEAD"],
    pattern: '/admin/login/verify',
    tokens: [{"old":"/admin/login/verify","type":0,"val":"admin","end":""},{"old":"/admin/login/verify","type":0,"val":"login","end":""},{"old":"/admin/login/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['admin.totp']['types'],
  },
  'admin.totp.store': {
    methods: ["POST"],
    pattern: '/admin/login/verify',
    tokens: [{"old":"/admin/login/verify","type":0,"val":"admin","end":""},{"old":"/admin/login/verify","type":0,"val":"login","end":""},{"old":"/admin/login/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['admin.totp.store']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.logout': {
    methods: ["POST"],
    pattern: '/admin/logout',
    tokens: [{"old":"/admin/logout","type":0,"val":"admin","end":""},{"old":"/admin/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['admin.logout']['types'],
  },
  'admin.security': {
    methods: ["GET","HEAD"],
    pattern: '/admin/security',
    tokens: [{"old":"/admin/security","type":0,"val":"admin","end":""},{"old":"/admin/security","type":0,"val":"security","end":""}],
    types: placeholder as Registry['admin.security']['types'],
  },
  'admin.security.store': {
    methods: ["POST"],
    pattern: '/admin/security',
    tokens: [{"old":"/admin/security","type":0,"val":"admin","end":""},{"old":"/admin/security","type":0,"val":"security","end":""}],
    types: placeholder as Registry['admin.security.store']['types'],
  },
  'admin.security.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/security',
    tokens: [{"old":"/admin/security","type":0,"val":"admin","end":""},{"old":"/admin/security","type":0,"val":"security","end":""}],
    types: placeholder as Registry['admin.security.destroy']['types'],
  },
  'admin.media.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/media',
    tokens: [{"old":"/admin/media","type":0,"val":"admin","end":""},{"old":"/admin/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['admin.media.index']['types'],
  },
  'admin.media.store': {
    methods: ["POST"],
    pattern: '/admin/media',
    tokens: [{"old":"/admin/media","type":0,"val":"admin","end":""},{"old":"/admin/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['admin.media.store']['types'],
  },
  'admin.media.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/media/:id',
    tokens: [{"old":"/admin/media/:id","type":0,"val":"admin","end":""},{"old":"/admin/media/:id","type":0,"val":"media","end":""},{"old":"/admin/media/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.media.destroy']['types'],
  },
  'admin.categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/categories',
    tokens: [{"old":"/admin/categories","type":0,"val":"admin","end":""},{"old":"/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['admin.categories.index']['types'],
  },
  'admin.categories.store': {
    methods: ["POST"],
    pattern: '/admin/categories',
    tokens: [{"old":"/admin/categories","type":0,"val":"admin","end":""},{"old":"/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['admin.categories.store']['types'],
  },
  'admin.categories.update': {
    methods: ["PUT"],
    pattern: '/admin/categories/:id',
    tokens: [{"old":"/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.categories.update']['types'],
  },
  'admin.categories.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/categories/:id',
    tokens: [{"old":"/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.categories.destroy']['types'],
  },
  'admin.tags.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/tags',
    tokens: [{"old":"/admin/tags","type":0,"val":"admin","end":""},{"old":"/admin/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['admin.tags.index']['types'],
  },
  'admin.tags.store': {
    methods: ["POST"],
    pattern: '/admin/tags',
    tokens: [{"old":"/admin/tags","type":0,"val":"admin","end":""},{"old":"/admin/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['admin.tags.store']['types'],
  },
  'admin.tags.update': {
    methods: ["PUT"],
    pattern: '/admin/tags/:id',
    tokens: [{"old":"/admin/tags/:id","type":0,"val":"admin","end":""},{"old":"/admin/tags/:id","type":0,"val":"tags","end":""},{"old":"/admin/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.tags.update']['types'],
  },
  'admin.tags.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/tags/:id',
    tokens: [{"old":"/admin/tags/:id","type":0,"val":"admin","end":""},{"old":"/admin/tags/:id","type":0,"val":"tags","end":""},{"old":"/admin/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.tags.destroy']['types'],
  },
  'admin.articles.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles',
    tokens: [{"old":"/admin/articles","type":0,"val":"admin","end":""},{"old":"/admin/articles","type":0,"val":"articles","end":""}],
    types: placeholder as Registry['admin.articles.index']['types'],
  },
  'admin.articles.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles/create',
    tokens: [{"old":"/admin/articles/create","type":0,"val":"admin","end":""},{"old":"/admin/articles/create","type":0,"val":"articles","end":""},{"old":"/admin/articles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.articles.create']['types'],
  },
  'admin.articles.store': {
    methods: ["POST"],
    pattern: '/admin/articles',
    tokens: [{"old":"/admin/articles","type":0,"val":"admin","end":""},{"old":"/admin/articles","type":0,"val":"articles","end":""}],
    types: placeholder as Registry['admin.articles.store']['types'],
  },
  'admin.articles.preview': {
    methods: ["POST"],
    pattern: '/admin/articles/preview',
    tokens: [{"old":"/admin/articles/preview","type":0,"val":"admin","end":""},{"old":"/admin/articles/preview","type":0,"val":"articles","end":""},{"old":"/admin/articles/preview","type":0,"val":"preview","end":""}],
    types: placeholder as Registry['admin.articles.preview']['types'],
  },
  'admin.articles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/articles/:id/edit',
    tokens: [{"old":"/admin/articles/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id/edit","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/articles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.articles.edit']['types'],
  },
  'admin.articles.update': {
    methods: ["PUT"],
    pattern: '/admin/articles/:id',
    tokens: [{"old":"/admin/articles/:id","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.articles.update']['types'],
  },
  'admin.articles.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/articles/:id',
    tokens: [{"old":"/admin/articles/:id","type":0,"val":"admin","end":""},{"old":"/admin/articles/:id","type":0,"val":"articles","end":""},{"old":"/admin/articles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.articles.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
