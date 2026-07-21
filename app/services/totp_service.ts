import { Secret, TOTP } from 'otpauth'

const ISSUER = 'kevin-dev.com'

/**
 * Encapsule la génération et la vérification des codes TOTP (RFC 6238).
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
   * URI otpauth:// à encoder en QR code pour l'enrôlement.
   */
  static uri(email: string, secret: string) {
    return this.#build(email, secret).toString()
  }

  /**
   * Vérifie un code avec une fenêtre de ±1 période (tolérance d'horloge).
   */
  static verify(email: string, secret: string, code: string) {
    return this.#build(email, secret).validate({ token: code, window: 1 }) !== null
  }
}
