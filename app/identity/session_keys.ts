export const TOTP_PENDING_KEY = 'totp_pending_user_id'
export const TOTP_PENDING_UNTIL_KEY = 'totp_pending_until'
export const TOTP_SETUP_KEY = 'totp_setup_secret'
export const RECOVERY_CODES_FLASH_KEY = 'recovery_codes'

/** How long a password-verified login may wait for its second factor. */
export const TOTP_PENDING_TTL_MS = 5 * 60 * 1000
