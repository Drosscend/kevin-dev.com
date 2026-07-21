import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'
import type { InferDriveDisks } from '@adonisjs/drive/types'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * Files live under storage/ (mounted as a persistent volume in
   * production). They are never served directly by Drive: the
   * uploads and CV controllers stream them after strict validation.
   */
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: false,
      visibility: 'private',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
