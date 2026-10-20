Couche client : pages Inertia, layouts, composants React.

Lire [l'architecture de l'application](../docs/architecture/application.md) avant
d'ajouter une page ou d'extraire un composant.

- **Aucun texte visible en dur** dans une page publique : les libellés se lisent
  dans la prop partagée `messages`. Un composant lit lui-même un texte qui ne
  varie pas selon l'appelant, et reçoit en prop celui qui en dépend.
  L'administration, elle, est monolingue française.
- Chercher le composant existant avant d'écrire un bloc, et l'étendre par une
  prop plutôt que le dupliquer.
- Les pages `admin/*` sont hors SSR, donc `window` y est toujours défini.
