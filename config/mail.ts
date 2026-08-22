import { defineConfig, transports } from '@adonisjs/mail'
import env from '#start/env'

/**
 * Outgoing mail goes through an SMTP relay reachable on a private
 * Docker network. The relay speaks STARTTLS with a self-signed
 * certificate there, hence the relaxed certificate check paired with a
 * mandatory upgrade.
 */
const mailConfig = defineConfig({
  default: 'smtp',

  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'contact@kevin-dev.com'),
    name: env.get('MAIL_FROM_NAME', 'kevin-dev.com'),
  },

  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'mailbridge'),
      port: env.get('SMTP_PORT', 25),
      secure: false,
      requireTLS: true,
      tls: { rejectUnauthorized: false },
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME', ''),
        pass: env.get('SMTP_PASSWORD', ''),
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
