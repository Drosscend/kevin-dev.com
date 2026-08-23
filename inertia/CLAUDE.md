Couche client : pages Inertia, layouts, composants React.

Lire [l'architecture de l'application](../docs/architecture/application.md) avant
d'ajouter une page ou d'extraire un composant.

- **Aucun texte visible en dur** dans une page publique : les libellés se lisent
  dans la prop partagée `messages`. Un composant lit lui-même un texte qui ne
  varie pas selon l'appelant, et reçoit en prop celui qui en dépend.
  L'administration, elle, est monolingue française.
- Chercher le composant existant avant d'écrire un bloc, et l'étendre par une
  prop plutôt que le dupliquer. Public : `page_header`, `reading_layout`,
  `content_link`, `technology_list`, `status_badge`, `empty_state`, `seo`.
  Admin : `admin_page`, `content_list`, `slug_field`, `external_links_card`,
  `translation_card`, `media_picker`, `publication_actions`, `confirm_button`.
- Une page ne redéclare pas la forme de ses props : elle lit le type généré
  `Data.<Capacité>.<Nom>` depuis `@generated/data`, et compose ses propres props
  avec `InertiaProps<{ ... }>`, qui y ajoute celles que le middleware partage
  (`locale`, `user`, `messages`, `errors`).
- Les flèches appartiennent à `LinkArrow`, jamais aux chaînes.
- Le compilateur React est actif : pas de `useMemo`, `useCallback` ni `memo`.
- `Link` et `Form` viennent de `@adonisjs/inertia/react`, pas de `@inertiajs/react`.
- Seul `#types` traverse la frontière serveur ; tout autre import `#` est refusé
  par le lint.
- `components/ui/` vient de shadcn : ne pas le ranger comme notre code.
- Les pages `admin/*` sont hors SSR, donc `window` y est toujours défini.
