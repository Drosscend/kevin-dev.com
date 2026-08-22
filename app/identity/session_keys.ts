/**
 * Session and flash keys shared by the identity controllers. The
 * pending user id and the candidate secret live in the session because
 * neither is persisted before it has been proven.
 */
export const TOTP_PENDING_KEY = 'totp_pending_user_id'
export const TOTP_SETUP_KEY = 'totp_setup_secret'
export const RECOVERY_CODES_FLASH_KEY = 'recovery_codes'
