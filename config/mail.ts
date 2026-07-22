import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

/**
 * Outgoing mail goes through the shared Proton Mail Bridge exposed on
 * the `mail` Docker network as `mailbridge:25`. The bridge speaks
 * STARTTLS with a self-signed certificate on a private network, hence
 * the relaxed certificate check paired with a mandatory upgrade.
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
