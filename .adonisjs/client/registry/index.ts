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
  'seo.sitemap': {
    methods: ["GET","HEAD"],
    pattern: '/sitemap.xml',
    tokens: [{"old":"/sitemap.xml","type":0,"val":"sitemap.xml","end":""}],
    types: placeholder as Registry['seo.sitemap']['types'],
  },
  'seo.robots': {
    methods: ["GET","HEAD"],
    pattern: '/robots.txt',
    tokens: [{"old":"/robots.txt","type":0,"val":"robots.txt","end":""}],
    types: placeholder as Registry['seo.robots']['types'],
  },
  'seo.rss': {
    methods: ["GET","HEAD"],
    pattern: '/blog/rss.xml',
    tokens: [{"old":"/blog/rss.xml","type":0,"val":"blog","end":""},{"old":"/blog/rss.xml","type":0,"val":"rss.xml","end":""}],
    types: placeholder as Registry['seo.rss']['types'],
  },
  'en.seo.rss': {
    methods: ["GET","HEAD"],
    pattern: '/en/blog/rss.xml',
    tokens: [{"old":"/en/blog/rss.xml","type":0,"val":"en","end":""},{"old":"/en/blog/rss.xml","type":0,"val":"blog","end":""},{"old":"/en/blog/rss.xml","type":0,"val":"rss.xml","end":""}],
    types: placeholder as Registry['en.seo.rss']['types'],
  },
  'llms.index': {
    methods: ["GET","HEAD"],
    pattern: '/llms.txt',
    tokens: [{"old":"/llms.txt","type":0,"val":"llms.txt","end":""}],
    types: placeholder as Registry['llms.index']['types'],
  },
  'llms.cv': {
    methods: ["GET","HEAD"],
    pattern: '/cv.md',
    tokens: [{"old":"/cv.md","type":0,"val":"cv.md","end":""}],
    types: placeholder as Registry['llms.cv']['types'],
  },
  'en.llms.cv': {
    methods: ["GET","HEAD"],
    pattern: '/en/cv.md',
    tokens: [{"old":"/en/cv.md","type":0,"val":"en","end":""},{"old":"/en/cv.md","type":0,"val":"cv.md","end":""}],
    types: placeholder as Registry['en.llms.cv']['types'],
  },
  'llms.legal': {
    methods: ["GET","HEAD"],
    pattern: '/legal.md',
    tokens: [{"old":"/legal.md","type":0,"val":"legal.md","end":""}],
    types: placeholder as Registry['llms.legal']['types'],
  },
  'en.llms.legal': {
    methods: ["GET","HEAD"],
    pattern: '/en/legal.md',
    tokens: [{"old":"/en/legal.md","type":0,"val":"en","end":""},{"old":"/en/legal.md","type":0,"val":"legal.md","end":""}],
    types: placeholder as Registry['en.llms.legal']['types'],
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
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:slug',
    tokens: [{"old":"/projects/:slug","type":0,"val":"projects","end":""},{"old":"/projects/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'en.projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/en/projects',
    tokens: [{"old":"/en/projects","type":0,"val":"en","end":""},{"old":"/en/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['en.projects.index']['types'],
  },
  'en.projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/projects/:slug',
    tokens: [{"old":"/en/projects/:slug","type":0,"val":"en","end":""},{"old":"/en/projects/:slug","type":0,"val":"projects","end":""},{"old":"/en/projects/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['en.projects.show']['types'],
  },
  'technologies.index': {
    methods: ["GET","HEAD"],
    pattern: '/technologies',
    tokens: [{"old":"/technologies","type":0,"val":"technologies","end":""}],
    types: placeholder as Registry['technologies.index']['types'],
  },
  'technologies.show': {
    methods: ["GET","HEAD"],
    pattern: '/technologies/:slug',
    tokens: [{"old":"/technologies/:slug","type":0,"val":"technologies","end":""},{"old":"/technologies/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['technologies.show']['types'],
  },
  'en.technologies.index': {
    methods: ["GET","HEAD"],
    pattern: '/en/technologies',
    tokens: [{"old":"/en/technologies","type":0,"val":"en","end":""},{"old":"/en/technologies","type":0,"val":"technologies","end":""}],
    types: placeholder as Registry['en.technologies.index']['types'],
  },
  'en.technologies.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/technologies/:slug',
    tokens: [{"old":"/en/technologies/:slug","type":0,"val":"en","end":""},{"old":"/en/technologies/:slug","type":0,"val":"technologies","end":""},{"old":"/en/technologies/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['en.technologies.show']['types'],
  },
  'cv.show': {
    methods: ["GET","HEAD"],
    pattern: '/cv',
    tokens: [{"old":"/cv","type":0,"val":"cv","end":""}],
    types: placeholder as Registry['cv.show']['types'],
  },
  'en.cv.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/cv',
    tokens: [{"old":"/en/cv","type":0,"val":"en","end":""},{"old":"/en/cv","type":0,"val":"cv","end":""}],
    types: placeholder as Registry['en.cv.show']['types'],
  },
  'cv.pdf': {
    methods: ["GET","HEAD"],
    pattern: '/cv.pdf',
    tokens: [{"old":"/cv.pdf","type":0,"val":"cv.pdf","end":""}],
    types: placeholder as Registry['cv.pdf']['types'],
  },
  'legal.show': {
    methods: ["GET","HEAD"],
    pattern: '/legal',
    tokens: [{"old":"/legal","type":0,"val":"legal","end":""}],
    types: placeholder as Registry['legal.show']['types'],
  },
  'en.legal.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/legal',
    tokens: [{"old":"/en/legal","type":0,"val":"en","end":""},{"old":"/en/legal","type":0,"val":"legal","end":""}],
    types: placeholder as Registry['en.legal.show']['types'],
  },
  'contact.show': {
    methods: ["GET","HEAD"],
    pattern: '/contact',
    tokens: [{"old":"/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contact.show']['types'],
  },
  'contact.store': {
    methods: ["POST"],
    pattern: '/contact',
    tokens: [{"old":"/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contact.store']['types'],
  },
  'en.contact.show': {
    methods: ["GET","HEAD"],
    pattern: '/en/contact',
    tokens: [{"old":"/en/contact","type":0,"val":"en","end":""},{"old":"/en/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['en.contact.show']['types'],
  },
  'en.contact.store': {
    methods: ["POST"],
    pattern: '/en/contact',
    tokens: [{"old":"/en/contact","type":0,"val":"en","end":""},{"old":"/en/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['en.contact.store']['types'],
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
  'admin.technologies.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/technologies',
    tokens: [{"old":"/admin/technologies","type":0,"val":"admin","end":""},{"old":"/admin/technologies","type":0,"val":"technologies","end":""}],
    types: placeholder as Registry['admin.technologies.index']['types'],
  },
  'admin.technologies.store': {
    methods: ["POST"],
    pattern: '/admin/technologies',
    tokens: [{"old":"/admin/technologies","type":0,"val":"admin","end":""},{"old":"/admin/technologies","type":0,"val":"technologies","end":""}],
    types: placeholder as Registry['admin.technologies.store']['types'],
  },
  'admin.technologies.update': {
    methods: ["PUT"],
    pattern: '/admin/technologies/:id',
    tokens: [{"old":"/admin/technologies/:id","type":0,"val":"admin","end":""},{"old":"/admin/technologies/:id","type":0,"val":"technologies","end":""},{"old":"/admin/technologies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.technologies.update']['types'],
  },
  'admin.technologies.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/technologies/:id',
    tokens: [{"old":"/admin/technologies/:id","type":0,"val":"admin","end":""},{"old":"/admin/technologies/:id","type":0,"val":"technologies","end":""},{"old":"/admin/technologies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.technologies.destroy']['types'],
  },
  'admin.projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/projects',
    tokens: [{"old":"/admin/projects","type":0,"val":"admin","end":""},{"old":"/admin/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['admin.projects.index']['types'],
  },
  'admin.projects.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/projects/create',
    tokens: [{"old":"/admin/projects/create","type":0,"val":"admin","end":""},{"old":"/admin/projects/create","type":0,"val":"projects","end":""},{"old":"/admin/projects/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.projects.create']['types'],
  },
  'admin.projects.store': {
    methods: ["POST"],
    pattern: '/admin/projects',
    tokens: [{"old":"/admin/projects","type":0,"val":"admin","end":""},{"old":"/admin/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['admin.projects.store']['types'],
  },
  'admin.projects.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/projects/:id/edit',
    tokens: [{"old":"/admin/projects/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/projects/:id/edit","type":0,"val":"projects","end":""},{"old":"/admin/projects/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/projects/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.projects.edit']['types'],
  },
  'admin.projects.update': {
    methods: ["PUT"],
    pattern: '/admin/projects/:id',
    tokens: [{"old":"/admin/projects/:id","type":0,"val":"admin","end":""},{"old":"/admin/projects/:id","type":0,"val":"projects","end":""},{"old":"/admin/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.projects.update']['types'],
  },
  'admin.projects.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/projects/:id',
    tokens: [{"old":"/admin/projects/:id","type":0,"val":"admin","end":""},{"old":"/admin/projects/:id","type":0,"val":"projects","end":""},{"old":"/admin/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.projects.destroy']['types'],
  },
  'admin.pages': {
    methods: ["GET","HEAD"],
    pattern: '/admin/pages',
    tokens: [{"old":"/admin/pages","type":0,"val":"admin","end":""},{"old":"/admin/pages","type":0,"val":"pages","end":""}],
    types: placeholder as Registry['admin.pages']['types'],
  },
  'admin.pages.update': {
    methods: ["PUT"],
    pattern: '/admin/pages',
    tokens: [{"old":"/admin/pages","type":0,"val":"admin","end":""},{"old":"/admin/pages","type":0,"val":"pages","end":""}],
    types: placeholder as Registry['admin.pages.update']['types'],
  },
  'admin.pages.pdf': {
    methods: ["POST"],
    pattern: '/admin/pages/cv-pdf',
    tokens: [{"old":"/admin/pages/cv-pdf","type":0,"val":"admin","end":""},{"old":"/admin/pages/cv-pdf","type":0,"val":"pages","end":""},{"old":"/admin/pages/cv-pdf","type":0,"val":"cv-pdf","end":""}],
    types: placeholder as Registry['admin.pages.pdf']['types'],
  },
  'admin.messages.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/messages',
    tokens: [{"old":"/admin/messages","type":0,"val":"admin","end":""},{"old":"/admin/messages","type":0,"val":"messages","end":""}],
    types: placeholder as Registry['admin.messages.index']['types'],
  },
  'admin.messages.read': {
    methods: ["PUT"],
    pattern: '/admin/messages/:id/read',
    tokens: [{"old":"/admin/messages/:id/read","type":0,"val":"admin","end":""},{"old":"/admin/messages/:id/read","type":0,"val":"messages","end":""},{"old":"/admin/messages/:id/read","type":1,"val":"id","end":""},{"old":"/admin/messages/:id/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['admin.messages.read']['types'],
  },
  'admin.messages.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/messages/:id',
    tokens: [{"old":"/admin/messages/:id","type":0,"val":"admin","end":""},{"old":"/admin/messages/:id","type":0,"val":"messages","end":""},{"old":"/admin/messages/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.messages.destroy']['types'],
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
