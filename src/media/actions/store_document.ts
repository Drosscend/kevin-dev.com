import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { DOCUMENT_MIME_TYPE } from '#media/models/media'
import { MediaRepository } from '#media/repositories/media_repository'
import { DOCUMENT_FILE, MediaStorage } from '#media/storage'
import type Media from '#media/models/media'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

const PDF_SIGNATURE = Buffer.from('%PDF-')

export interface StoreDocumentParams {
  file: MultipartFile
  alt: string
}

export interface InvalidDocumentError {
  type: 'invalid_document'
}

export type StoreDocumentResult = Result<Media, InvalidDocumentError>

/**
 * Stores a PDF untouched: the magic number is checked so a renamed
 * file cannot be served back as application/pdf.
 */
@inject()
export class StoreDocument {
  constructor(
    private readonly media: MediaRepository,
    private readonly storage: MediaStorage
  ) {}

  async execute(params: StoreDocumentParams): Promise<StoreDocumentResult> {
    const contents = await readFile(params.file.tmpPath!)

    if (!contents.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE)) {
      return err({ type: 'invalid_document' })
    }

    const mediaKey = randomBytes(12).toString('hex')

    try {
      await this.storage.put(mediaKey, DOCUMENT_FILE, contents)

      return ok(
        await this.media.create({
          key: mediaKey,
          originalName: params.file.clientName,
          alt: params.alt,
          mimeType: DOCUMENT_MIME_TYPE,
          width: null,
          height: null,
          size: contents.byteLength,
          variants: [],
        })
      )
    } catch (error) {
      await this.storage.deleteAll(mediaKey)
      throw error
    }
  }
}
