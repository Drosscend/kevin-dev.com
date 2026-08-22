import { randomInt } from 'node:crypto'
import hash from '@adonisjs/core/services/hash'
import type User from '#models/user'

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

/**
 * One-time recovery codes for the TOTP second factor. Only hashes are
 * persisted; the plain codes are shown to the user exactly once.
 */
export default class RecoveryCodesService {
  /** Generates a fresh set, replacing any previous codes. */
  static async generate(user: User) {
    const codes = Array.from({ length: CODE_COUNT }, randomCode)
    user.recoveryCodes = await Promise.all(codes.map((code) => hash.make(code)))
    await user.save()
    return codes
  }

  static remaining(user: User) {
    return Array.isArray(user.recoveryCodes) ? user.recoveryCodes.length : 0
  }

  /**
   * Checks the code against the stored hashes and consumes it on
   * success, so each code can only be used once.
   */
  static async verifyAndConsume(user: User, code: string) {
    const hashes: string[] = Array.isArray(user.recoveryCodes) ? user.recoveryCodes : []
    const normalized = code.trim().toUpperCase()

    for (const [index, stored] of hashes.entries()) {
      if (await hash.verify(stored, normalized)) {
        user.recoveryCodes = hashes.filter((_, i) => i !== index)
        await user.save()
        return true
      }
    }
    return false
  }

  static async clear(user: User) {
    user.recoveryCodes = null
    await user.save()
  }
}
