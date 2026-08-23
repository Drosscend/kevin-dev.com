/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'seo.sitemap': {
    methods: ["GET","HEAD"]
    pattern: '/sitemap.xml'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/sitemap_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/sitemap_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/robots_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/robots_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/security_txt_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/security_txt_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/feed_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/feed_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/feed_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/feed_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/llms_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/llms_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/cv_markdown_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/cv_markdown_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/cv_markdown_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/cv_markdown_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/legal_markdown_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/legal_markdown_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/seo/controllers/legal_markdown_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/seo/controllers/legal_markdown_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/shared/controllers/health_checks_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/shared/controllers/health_checks_controller').default['handle']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_pdf_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/cv_pdf_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/legal_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/legal_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/legal_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/legal_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_home_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_home_controller').default['render']>>>
    }
  }
  'admin.home.update': {
    methods: ["PUT"]
    pattern: '/admin/home'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/manage_home_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/manage_home_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_home_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_home_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.timeline.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/timeline'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['render']>>>
    }
  }
  'admin.timeline.store': {
    methods: ["POST"]
    pattern: '/admin/timeline'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/manage_timeline_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/manage_timeline_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.timeline.update': {
    methods: ["PUT"]
    pattern: '/admin/timeline/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/manage_timeline_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/manage_timeline_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_timeline_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.timeline.move': {
    methods: ["PUT"]
    pattern: '/admin/timeline/:id/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/move_timeline_entry_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/move_timeline_entry_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/move_timeline_entry_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/move_timeline_entry_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.timeline.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/timeline/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/delete_timeline_entry_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/delete_timeline_entry_controller').default['execute']>>>
    }
  }
  'admin.cv.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/cv'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_cv_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_cv_controller').default['render']>>>
    }
  }
  'admin.cv.update': {
    methods: ["PUT"]
    pattern: '/admin/cv'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/manage_cv_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/manage_cv_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_cv_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_cv_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.cv.pdf.store': {
    methods: ["POST"]
    pattern: '/admin/cv/pdf'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/upload_cv_pdf_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/upload_cv_pdf_controller').default['execute']>>>
    }
  }
  'admin.legal.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/legal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_legal_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_legal_controller').default['render']>>>
    }
  }
  'admin.legal.update': {
    methods: ["PUT"]
    pattern: '/admin/legal'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/pages/controllers/manage_legal_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/pages/controllers/manage_legal_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_legal_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/manage_legal_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/manage_articles_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/manage_articles_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['render']>>>
    }
  }
  'admin.articles.store': {
    methods: ["POST"]
    pattern: '/admin/articles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/blog/controllers/article_form_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/blog/controllers/article_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['render']>>>
    }
  }
  'admin.articles.update': {
    methods: ["PUT"]
    pattern: '/admin/articles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/blog/controllers/article_form_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/blog/controllers/article_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/article_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/delete_article_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/delete_article_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/manage_categories_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/manage_categories_controller').default['render']>>>
    }
  }
  'admin.categories.store': {
    methods: ["POST"]
    pattern: '/admin/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/blog/controllers/save_category_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/blog/controllers/save_category_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/save_category_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/save_category_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/blog/controllers/save_category_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/blog/controllers/save_category_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/save_category_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/save_category_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/blog/controllers/delete_category_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/blog/controllers/delete_category_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/media/controllers/serve_media_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/media/controllers/serve_media_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/media/controllers/media_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/media/controllers/media_controller').default['render']>>>
    }
  }
  'admin.media.store': {
    methods: ["POST"]
    pattern: '/admin/media'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/media/controllers/store_media_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/media/controllers/store_media_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/media/controllers/store_media_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/media/controllers/store_media_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.media.upload': {
    methods: ["POST"]
    pattern: '/admin/media/upload'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/media/controllers/upload_image_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/media/controllers/upload_image_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/media/controllers/upload_image_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/media/controllers/upload_image_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/media/controllers/delete_media_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/media/controllers/delete_media_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/manage_projects_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/manage_projects_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['render']>>>
    }
  }
  'admin.projects.store': {
    methods: ["POST"]
    pattern: '/admin/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/portfolio/controllers/project_form_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/portfolio/controllers/project_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['render']>>>
    }
  }
  'admin.projects.update': {
    methods: ["PUT"]
    pattern: '/admin/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/portfolio/controllers/project_form_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/portfolio/controllers/project_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/project_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/portfolio/controllers/delete_project_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/portfolio/controllers/delete_project_controller').default['execute']>>>
    }
  }
  'talks.index': {
    methods: ["GET","HEAD"]
    pattern: '/talks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_list_controller').default['render']>>>
    }
  }
  'talks.show': {
    methods: ["GET","HEAD"]
    pattern: '/talks/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_controller').default['render']>>>
    }
  }
  'en.talks.index': {
    methods: ["GET","HEAD"]
    pattern: '/en/talks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_list_controller').default['render']>>>
    }
  }
  'en.talks.show': {
    methods: ["GET","HEAD"]
    pattern: '/en/talks/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_controller').default['render']>>>
    }
  }
  'admin.talks.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/talks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/manage_talks_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/manage_talks_controller').default['render']>>>
    }
  }
  'admin.talks.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/talks/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['render']>>>
    }
  }
  'admin.talks.store': {
    methods: ["POST"]
    pattern: '/admin/talks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/talks/controllers/talk_form_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/talks/controllers/talk_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.talks.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/talks/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['render']>>>
    }
  }
  'admin.talks.update': {
    methods: ["PUT"]
    pattern: '/admin/talks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/talks/controllers/talk_form_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/talks/controllers/talk_form_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/talk_form_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.talks.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/talks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/talks/controllers/delete_talk_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/talks/controllers/delete_talk_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_list_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_list_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/technology_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/manage_technologies_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/manage_technologies_controller').default['render']>>>
    }
  }
  'admin.technologies.store': {
    methods: ["POST"]
    pattern: '/admin/technologies'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/technologies/controllers/save_technology_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/technologies/controllers/save_technology_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/save_technology_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/save_technology_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.technologies.update': {
    methods: ["PUT"]
    pattern: '/admin/technologies/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/technologies/controllers/save_technology_controller').default)['validator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#app/technologies/controllers/save_technology_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/save_technology_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/save_technology_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/technologies/controllers/delete_technology_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/technologies/controllers/delete_technology_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['render']>>>
    }
  }
  'contact.store': {
    methods: ["POST"]
    pattern: '/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/contact/controllers/contact_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/contact/controllers/contact_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['render']>>>
    }
  }
  'en.contact.store': {
    methods: ["POST"]
    pattern: '/en/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/contact/controllers/contact_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/contact/controllers/contact_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/contact_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/messages_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/messages_controller').default['render']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/toggle_message_read_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/toggle_message_read_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/contact/controllers/delete_message_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/contact/controllers/delete_message_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['render']>>>
    }
  }
  'admin.login.store': {
    methods: ["POST"]
    pattern: '/admin/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/login_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/login_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/totp_challenge_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/totp_challenge_controller').default['render']>>>
    }
  }
  'admin.totp.store': {
    methods: ["POST"]
    pattern: '/admin/login/verify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/totp_challenge_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/totp_challenge_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/totp_challenge_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/totp_challenge_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/logout_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/logout_controller').default['execute']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/security_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/security_controller').default['render']>>>
    }
  }
  'admin.security.store': {
    methods: ["POST"]
    pattern: '/admin/security'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/enable_totp_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/enable_totp_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/enable_totp_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/enable_totp_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.security.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/security'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/disable_totp_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/disable_totp_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/disable_totp_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/disable_totp_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.security.recovery.store': {
    methods: ["POST"]
    pattern: '/admin/security/recovery'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/regenerate_recovery_codes_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/regenerate_recovery_codes_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/regenerate_recovery_codes_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/regenerate_recovery_codes_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
