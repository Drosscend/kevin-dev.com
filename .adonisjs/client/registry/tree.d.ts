/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  health: typeof routes['health']
  uploads: {
    show: typeof routes['uploads.show']
  }
  admin: {
    login: typeof routes['admin.login'] & {
      store: typeof routes['admin.login.store']
    }
    totp: typeof routes['admin.totp'] & {
      store: typeof routes['admin.totp.store']
    }
    dashboard: typeof routes['admin.dashboard']
    logout: typeof routes['admin.logout']
    security: typeof routes['admin.security'] & {
      store: typeof routes['admin.security.store']
      destroy: typeof routes['admin.security.destroy']
    }
    media: {
      index: typeof routes['admin.media.index']
      store: typeof routes['admin.media.store']
      destroy: typeof routes['admin.media.destroy']
    }
  }
}
