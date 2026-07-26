import { Secret, TOTP } from 'otpauth'

const ISSUER = 'kevin-dev.com'

/**
 * Generates and verifies TOTP codes (RFC 6238).
 */
export default class TotpService {
  static generateSecret() {
    return new Secret({ size: 20 }).base32
  }

  static #build(email: string, secret: string) {
    return new TOTP({
      issuer: ISSUER,
      label: email,
      digits: 6,
      period: 30,
      secret: Secret.fromBase32(secret),
    })
  }

  /**
   * otpauth:// URI to encode as a QR code during enrollment.
   */
  static uri(email: string, secret: string) {
    return this.#build(email, secret).toString()
  }

  /**
   * Verifies a code with a ±1 period window (clock drift tolerance).
   */
  static verify(email: string, secret: string, code: string) {
    return this.#build(email, secret).validate({ token: code, window: 1 }) !== null
  }
}
