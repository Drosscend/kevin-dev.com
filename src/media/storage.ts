import drive from '@adonisjs/drive/services/main'

/** Single file name every stored document lives under. */
export const DOCUMENT_FILE = 'document.pdf'

/**
 * Disk layout of the media library, backed by Drive (fs disk under
 * storage/). Files live under generated keys, so no client-provided
 * name ever reaches the disk.
 */
export class MediaStorage {
  directory(mediaKey: string) {
    return `media/${mediaKey}`
  }

  key(mediaKey: string, file: string) {
    return `${this.directory(mediaKey)}/${file}`
  }

  async put(mediaKey: string, file: string, contents: Buffer) {
    await drive.use().put(this.key(mediaKey, file), contents)
  }

  async exists(mediaKey: string, file: string) {
    return drive.use().exists(this.key(mediaKey, file))
  }

  async stream(mediaKey: string, file: string) {
    return drive.use().getStream(this.key(mediaKey, file))
  }

  async deleteAll(mediaKey: string) {
    await drive.use().deleteAll(this.directory(mediaKey))
  }
}
