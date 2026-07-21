import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
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
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'uploads.show': { paramsTuple: [ParamValue,ParamValue]; params: {'key': ParamValue,'file': ParamValue} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.totp': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.security': { paramsTuple?: []; params?: {} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'uploads.show': { paramsTuple: [ParamValue,ParamValue]; params: {'key': ParamValue,'file': ParamValue} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.totp': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.security': { paramsTuple?: []; params?: {} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.login.store': { paramsTuple?: []; params?: {} }
    'admin.totp.store': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'admin.security.store': { paramsTuple?: []; params?: {} }
    'admin.media.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.security.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}