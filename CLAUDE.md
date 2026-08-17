# kevin-dev.com

Invariants à connaître avant de modifier ce dépôt. Ce qu'est le site, comment l'installer,
les commandes et le déploiement : [README.md](README.md).

## Code que nous n'avons pas écrit

Il ne se range pas comme le nôtre. Avant de retirer un fichier, une option ou un
commentaire qui semble mort, le comparer à sa source : s'il en vient tel quel, il reste.

- **Starter kit AdonisJS** (`adonisjs/starter-kits/inertia-react`) : `config/*`, `bin/*`,
  `ace.js`, `adonisrc.ts`, `start/env.ts`, `start/kernel.ts`, `start/validator.ts`, les
  stubs de `app/middleware/`, `app/exceptions/handler.ts`, `tests/bootstrap.ts`,
  `database/schema_rules.ts`, et leurs commentaires.
- **shadcn/ui** : `inertia/components/ui/*`, `inertia/css/typeset.css` et les tokens de
  `inertia/css/app.css`. Les variantes et sous-composants inutilisés restent diffables
  avec l'upstream.
- **Généré** : `.adonisjs/` et `database/schema.ts`, réécrits à chaque `migration:run` ou
  démarrage du serveur de dev. Ne rien y éditer à la main.
- **Migrations** : de l'historique. On en ajoute, on n'en modifie pas.

## Frontière serveur / client

- `app/types/` est le terrain commun : `i18n.ts` (locales, `localePath`), `content.ts`
  (statuts de publication, catégories de technologies, types de liens, mentions du
  parcours), `seo.ts`. Le client les importe par l'alias `#types` (déclaré dans
  `vite.config.ts`, autorisé dans `eslint.config.js`). Une valeur partagée y vit une
  seule fois ; ne jamais la recopier côté `inertia/`.
- **Toute traduction est faite côté contrôleur.** Le client n'appelle jamais `t()` : il
  reçoit des libellés déjà résolus (`labels` par page, `chrome` et `lightbox` en props
  partagées depuis `inertia_middleware.ts`). Une chaîne visible en dur dans un composant
  est un bug : le site est bilingue.
- Le **compilateur React** est actif sur tout `inertia/` : pas de `useMemo`,
  `useCallback` ni `memo`, sauf identité exigée par une API.
- Les pages `admin/*` sont exclues du SSR (`config/inertia.ts`) : `window` y est toujours
  défini.

## Avant d'écrire un bloc d'interface

Chercher le composant qui existe, et l'étendre par une prop plutôt que dupliquer :

- Public : `page_header`, `reading_layout` (colonne de lecture de toutes les pages de
  prose), `content_link` (listes, liens, `LinkArrow`), `technology_list`, `status_badge`,
  `empty_state`, `seo`.
- Admin : `admin_page` (+ `AdminBackLink`), `content_list` (rangée des listes de
  contenu), `slug_field`, `external_links_card`, `translation_card`, `media_picker`,
  `publication_actions`, `confirm_button`.
- Les flèches (`←` `→`) appartiennent à `LinkArrow`, jamais aux chaînes traduites.

Même réflexe côté serveur : `content_service` (rendu, date de publication, liens),
`translations_service`, `date_format` (les trois formats de date du site),
`publication_service`, `media_service`.

## Contenu et données

- Les seeds de démo ne disent rien du contenu réel : avant de retirer un affichage parce
  qu'il paraît vide ou inutile, le mesurer sur la base de production.
- Un slug se fige dès que l'entrée a été en ligne, et une entrée publiée ne redevient pas
  brouillon (seulement archivée) : `app/validators/shared.ts` et
  `app/models/mixins/publishable.ts`.
- Le markdown est rendu à l'enregistrement, jamais à l'affichage : les pages publiques ne
  lisent que le HTML stocké.

## Vérifier un changement de rendu

Sur le HTML réellement servi (`curl`), pas seulement dans le DOM du navigateur, qui répare
silencieusement les structures invalides. C'est ainsi qu'un `<head>` cassé ou une balise
mal sérialisée se voit.
