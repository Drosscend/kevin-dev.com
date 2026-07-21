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
  'health': {
    methods: ["GET","HEAD"],
    pattern: '/health',
    tokens: [{"old":"/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['health']['types'],
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
