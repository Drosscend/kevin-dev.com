import vine from '@vinejs/vine'
import { TIMELINE_HONOURS } from '#models/timeline_entry'

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

/**
 * A homepage timeline entry. The English translation is optional as a
 * whole: when every EN field is empty, the French entry is shown to
 * both locales. The honours are locale independent: only their label
 * is translated.
 */
export const timelineEntryValidator = vine.create({
  honours: vine.enum(TIMELINE_HONOURS).optional(),
  periodFr: vine.string().trim().minLength(1).maxLength(50),
  titleFr: vine.string().trim().minLength(1).maxLength(200),
  placeFr: vine.string().trim().minLength(1).maxLength(200),
  periodEn: vine.string().trim().maxLength(50).optional(),
  titleEn: vine.string().trim().maxLength(200).optional(),
  placeEn: vine.string().trim().maxLength(200).optional(),
})

export const timelineMoveValidator = vine.create({
  direction: vine.enum(['up', 'down']),
})
