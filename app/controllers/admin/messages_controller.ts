import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import ContactMessage from '#models/contact_message'

export default class MessagesController {
  async index({ inertia }: HttpContext) {
    const messages = await ContactMessage.query().orderBy('created_at', 'desc')

    return inertia.render('admin/messages', {
      messages: messages.map((message) => ({
        id: message.id,
        name: message.name,
        email: message.email,
        body: message.body,
        isRead: message.isRead,
        createdAt: message.createdAt.setLocale('fr').toLocaleString(DateTime.DATETIME_MED),
      })),
    })
  }

  async toggleRead({ params, response, session }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    message.readAt = message.isRead ? null : DateTime.now()
    await message.save()

    session.flash('success', message.isRead ? 'Message marqué comme lu' : 'Message marqué non lu')
    response.redirect().toRoute('admin.messages.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const message = await ContactMessage.findOrFail(params.id)
    await message.delete()

    session.flash('success', 'Message supprimé')
    response.redirect().toRoute('admin.messages.index')
  }
}
