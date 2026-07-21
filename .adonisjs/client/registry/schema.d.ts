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
      response: unknown
      errorResponse: unknown
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
      body: ExtractBody<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').totpCodeValidator)>>
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
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['destroy']>>>
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
}
