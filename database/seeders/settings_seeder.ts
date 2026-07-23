import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting from '#models/setting'
import SettingsService from '#services/settings_service'
import MarkdownService from '#services/markdown_service'

const DEFAULT_LEGAL_FR = `## Représentant

M. Kévin Véronési, kevin.veronesipro@gmail.com

## Hébergement

Ce site est auto-hébergé sur un serveur privé virtuel fourni par
Hetzner Online GmbH (Industriestr. 25, 91710 Gunzenhausen, Allemagne).
Hetzner agit en qualité de fournisseur d'infrastructure et ne peut être
tenu responsable du contenu de ce site.

## Données personnelles

Les informations transmises via le formulaire de contact (nom, email,
message) ne servent qu'à répondre à votre demande. Elles ne sont ni
partagées ni utilisées à d'autres fins, et sont supprimées sur simple
demande à l'adresse ci-dessus. Ce site utilise une instance Umami
auto-hébergée pour mesurer son audience, sans cookies ni collecte de
données personnelles.
`

/**
 * Seeds the default legal notice (French) when none exists yet.
 * The content remains editable from the admin afterwards.
 */
export default class extends BaseSeeder {
  async run() {
    const existing = await Setting.findBy('key', 'legal_markdown_fr')
    if (existing && existing.value.trim() !== '') {
      return
    }

    await SettingsService.set('legal_markdown_fr', DEFAULT_LEGAL_FR)
    await SettingsService.set('legal_html_fr', await MarkdownService.render(DEFAULT_LEGAL_FR))
  }
}
