/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['handle']>>>
    }
  }
  'en.home': {
    methods: ["GET","HEAD"]
    pattern: '/en'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['handle']>>>
    }
  }
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/health'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/health_checks_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/health_checks_controller').default['handle']>>>
    }
  }
  'seo.sitemap': {
    methods: ["GET","HEAD"]
    pattern: '/sitemap.xml'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['sitemap']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['sitemap']>>>
    }
  }
  'seo.robots': {
    methods: ["GET","HEAD"]
    pattern: '/robots.txt'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['robots']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['robots']>>>
    }
  }
  'seo.security': {
    methods: ["GET","HEAD"]
    pattern: '/.well-known/security.txt'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['securityTxt']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['securityTxt']>>>
    }
  }
  'seo.rss': {
    methods: ["GET","HEAD"]
    pattern: '/blog/rss.xml'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['rss']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['rss']>>>
    }
  }
  'en.seo.rss': {
    methods: ["GET","HEAD"]
    pattern: '/en/blog/rss.xml'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['rss']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seo_controller').default['rss']>>>
    }
  }
  'llms.index': {
    methods: ["GET","HEAD"]
    pattern: '/llms.txt'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['index']>>>
    }
  }
  'llms.cv': {
    methods: ["GET","HEAD"]
    pattern: '/cv.md'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['cv']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['cv']>>>
    }
  }
  'en.llms.cv': {
    methods: ["GET","HEAD"]
    pattern: '/en/cv.md'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['cv']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['cv']>>>
    }
  }
  'llms.legal': {
    methods: ["GET","HEAD"]
    pattern: '/legal.md'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['legal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['legal']>>>
    }
  }
  'en.llms.legal': {
    methods: ["GET","HEAD"]
    pattern: '/en/legal.md'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['legal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/llms_controller').default['legal']>>>
    }
  }
  'blog.index': {
    methods: ["GET","HEAD"]
    pattern: '/blog'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
    }
  }
  'blog.show': {
    methods: ["GET","HEAD"]
    pattern: '/blog/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
    }
  }
  'en.blog.index': {
    methods: ["GET","HEAD"]
    pattern: '/en/blog'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['index']>>>
    }
  }
  'en.blog.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/blog/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blog_controller').default['show']>>>
    }
  }
  'projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
    }
  }
  'projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'en.projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/en/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
    }
  }
  'en.projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/projects/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'technologies.index': {
    methods: ["GET","HEAD"]
    pattern: '/technologies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['index']>>>
    }
  }
  'technologies.show': {
    methods: ["GET","HEAD"]
    pattern: '/technologies/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['show']>>>
    }
  }
  'en.technologies.index': {
    methods: ["GET","HEAD"]
    pattern: '/en/technologies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['index']>>>
    }
  }
  'en.technologies.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/technologies/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/technologies_controller').default['show']>>>
    }
  }
  'cv.show': {
    methods: ["GET","HEAD"]
    pattern: '/cv'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['show']>>>
    }
  }
  'en.cv.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/cv'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['show']>>>
    }
  }
  'cv.pdf': {
    methods: ["GET","HEAD"]
    pattern: '/cv.pdf'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['pdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cv_controller').default['pdf']>>>
    }
  }
  'legal.show': {
    methods: ["GET","HEAD"]
    pattern: '/legal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/legal_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/legal_controller').default['show']>>>
    }
  }
  'en.legal.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/legal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/legal_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/legal_controller').default['show']>>>
    }
  }
  'contact.show': {
    methods: ["GET","HEAD"]
    pattern: '/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['show']>>>
    }
  }
  'contact.store': {
    methods: ["POST"]
    pattern: '/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').contactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').contactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'en.contact.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['show']>>>
    }
  }
  'en.contact.store': {
    methods: ["POST"]
    pattern: '/en/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').contactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').contactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'uploads.show': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/:key/:file'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { key: ParamValue; file: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['show']>>>
    }
  }
  'admin.login': {
    methods: ["GET","HEAD"]
    pattern: '/admin/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['create']>>>
    }
  }
  'admin.login.store': {
    methods: ["POST"]
    pattern: '/admin/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.totp': {
    methods: ["GET","HEAD"]
    pattern: '/admin/login/verify'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['totpCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['totpCreate']>>>
    }
  }
  'admin.totp.store': {
    methods: ["POST"]
    pattern: '/admin/login/verify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').challengeCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').challengeCodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['totpStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['totpStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['handle']>>>
    }
  }
  'admin.logout': {
    methods: ["POST"]
    pattern: '/admin/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/session_controller').default['destroy']>>>
    }
  }
  'admin.home.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/home'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['show']>>>
    }
  }
  'admin.home.update': {
    methods: ["PUT"]
    pattern: '/admin/home'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/home').homeSettingsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/home').homeSettingsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.home.timeline.store': {
    methods: ["POST"]
    pattern: '/admin/home/timeline'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/home').timelineEntryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/home').timelineEntryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.home.timeline.update': {
    methods: ["PUT"]
    pattern: '/admin/home/timeline/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/home').timelineEntryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/home').timelineEntryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineUpdate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.home.timeline.move': {
    methods: ["PUT"]
    pattern: '/admin/home/timeline/:id/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/home').timelineMoveValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/home').timelineMoveValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineMove']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineMove']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.home.timeline.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/home/timeline/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/home_controller').default['timelineDestroy']>>>
    }
  }
  'admin.security': {
    methods: ["GET","HEAD"]
    pattern: '/admin/security'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['show']>>>
    }
  }
  'admin.security.store': {
    methods: ["POST"]
    pattern: '/admin/security'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.security.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/security'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.security.recovery.store': {
    methods: ["POST"]
    pattern: '/admin/security/recovery'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['regenerateRecovery']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['regenerateRecovery']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.media.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/media'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['index']>>>
    }
  }
  'admin.media.store': {
    methods: ["POST"]
    pattern: '/admin/media'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').mediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media').mediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.media.upload': {
    methods: ["POST"]
    pattern: '/admin/media/upload'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').mediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media').mediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['upload']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['upload']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.media.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/media/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['destroy']>>>
    }
  }
  'admin.categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
    }
  }
  'admin.categories.store': {
    methods: ["POST"]
    pattern: '/admin/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').categoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').categoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').categoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').categoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['destroy']>>>
    }
  }
  'admin.tags.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/tags'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
    }
  }
  'admin.tags.store': {
    methods: ["POST"]
    pattern: '/admin/tags'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').tagValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').tagValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.tags.update': {
    methods: ["PUT"]
    pattern: '/admin/tags/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').tagValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').tagValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.tags.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/tags/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['destroy']>>>
    }
  }
  'admin.articles.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['index']>>>
    }
  }
  'admin.articles.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['create']>>>
    }
  }
  'admin.articles.store': {
    methods: ["POST"]
    pattern: '/admin/articles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').articleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').articleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.articles.preview': {
    methods: ["POST"]
    pattern: '/admin/articles/preview'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').previewValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').previewValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['preview']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['preview']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.articles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/articles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['edit']>>>
    }
  }
  'admin.articles.update': {
    methods: ["PUT"]
    pattern: '/admin/articles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/blog').articleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/blog').articleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.articles.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['destroy']>>>
    }
  }
  'admin.technologies.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/technologies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['index']>>>
    }
  }
  'admin.technologies.store': {
    methods: ["POST"]
    pattern: '/admin/technologies'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/portfolio').technologyValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/portfolio').technologyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.technologies.update': {
    methods: ["PUT"]
    pattern: '/admin/technologies/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/portfolio').technologyValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/portfolio').technologyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.technologies.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/technologies/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/technologies_controller').default['destroy']>>>
    }
  }
  'admin.projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['index']>>>
    }
  }
  'admin.projects.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/projects/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['create']>>>
    }
  }
  'admin.projects.store': {
    methods: ["POST"]
    pattern: '/admin/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/portfolio').projectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/portfolio').projectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.projects.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/projects/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['edit']>>>
    }
  }
  'admin.projects.update': {
    methods: ["PUT"]
    pattern: '/admin/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/portfolio').projectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/portfolio').projectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.projects.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['destroy']>>>
    }
  }
  'admin.pages.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/pages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['show']>>>
    }
  }
  'admin.pages.update': {
    methods: ["PUT"]
    pattern: '/admin/pages'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').pagesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').pagesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.pages.pdf.store': {
    methods: ["POST"]
    pattern: '/admin/pages/cv-pdf'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['uploadPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/pages_controller').default['uploadPdf']>>>
    }
  }
  'admin.messages.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['index']>>>
    }
  }
  'admin.messages.read': {
    methods: ["PUT"]
    pattern: '/admin/messages/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['toggleRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['toggleRead']>>>
    }
  }
  'admin.messages.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/messages_controller').default['destroy']>>>
    }
  }
}
