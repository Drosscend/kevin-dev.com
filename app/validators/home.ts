import vine from '@vinejs/vine'

/**
 * Admin editor for the homepage settings blocks (hero, "right now").
 * All fields are plain text; an empty value hides its block on the
 * public page.
 */
export const homeSettingsValidator = vine.create({
  heroRolesFr: vine.string().optional(),
  heroRolesEn: vine.string().optional(),
  heroLocation: vine.string().optional(),
  nowFr: vine.string().optional(),
  nowEn: vine.string().optional(),
})
