import { randomInt } from 'node:crypto'
import hash from '@adonisjs/core/services/hash'

/**
 * Alphabet without ambiguous characters (0/O, 1/I/L) so the codes are
 * easy to retype from a printout.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_COUNT = 10

function randomCode() {
  const block = () => Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `${block()}-${block()}`
}

export interface IssuedRecoveryCodes {
  plain: string[]
  hashed: string[]
}

/**
 * One-time recovery codes for the TOTP second factor. Only hashes are
 * ever persisted; the plain codes are readable exactly once, right
 * after they are issued.
 */
export default class RecoveryCodes {
  static async issue(): Promise<IssuedRecoveryCodes> {
    const plain = Array.from({ length: CODE_COUNT }, randomCode)
    return { plain, hashed: await Promise.all(plain.map((code) => hash.make(code))) }
  }

  static count(hashed: string[] | null) {
    return Array.isArray(hashed) ? hashed.length : 0
  }

  static async match(hashed: string[] | null, code: string) {
    const codes = Array.isArray(hashed) ? hashed : []
    const normalized = code.trim().toUpperCase()

    for (const [index, stored] of codes.entries()) {
      if (await hash.verify(stored, normalized)) {
        return index
      }
    }

    return -1
  }
}
