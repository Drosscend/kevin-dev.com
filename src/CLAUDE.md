Capacités métier : actions, queries, repositories, modèles, règles.

Lire [l'architecture de l'application](../docs/architecture/application.md) avant
d'ajouter une capacité ou un cas d'usage.

- **Rien ici n'importe `app/`** : la délivrance dépend des capacités, jamais
  l'inverse. Le lint le refuse.
- Une Action par fichier, nommée à l'impératif, avec une seule méthode `execute`.
  Elle renvoie un `Result` quand l'appelant peut réagir au refus, et ses
  variantes d'erreur ne contiennent ni code HTTP ni message traduit.
- Une Query par fichier : une lecture nommée qui renvoie une projection, pas un
  modèle brut. Les dates et les médias restent bruts, leur mise en forme
  appartient à la couche de délivrance.
- Le repository porte les écritures et leur transaction.
- Les modèles étendent les classes générées de `database/schema.ts` et n'ajoutent
  que relations, accesseurs et helpers.
- `shared/` porte ce que plusieurs capacités partagent, `core/` le type `Result`.
