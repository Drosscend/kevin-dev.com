import vine from '@vinejs/vine'

export const contactValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100),
  email: vine.string().trim().email().maxLength(254),
  message: vine.string().trim().minLength(10).maxLength(5000),
})
