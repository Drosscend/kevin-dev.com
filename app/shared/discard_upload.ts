import { rm } from 'node:fs/promises'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

/**
 * The bodyparser streams every upload to a temporary file and only
 * removes it when the stream itself fails: once an action has read the
 * file, the controller drops it.
 */
export async function discardUpload(file: MultipartFile | null) {
  if (file?.tmpPath) {
    await rm(file.tmpPath, { force: true })
  }
}
