Couche de délivrance : controllers, routes, middleware, mise en forme des
réponses. Le métier vit dans `src/`, jamais ici.

Lire [l'architecture de l'application](../docs/architecture/application.md) avant
d'ajouter un écran ou une mutation. Le vocabulaire du domaine est dans
[CONTEXT.md](../CONTEXT.md).

- Un dossier par capacité, un controller par cas d'usage, deux méthodes publiques
  au plus : `render` pour une page Inertia, `execute` pour une mutation.
- Le validator VineJS vit sur le controller, en `static readonly validator`.
- Les dépendances arrivent par le constructeur, avec `@inject()`.
- Un controller traduit, met en forme les dates et les URL, mappe chaque variante
  d'erreur d'une Action, flashe et redirige. Il n'ouvre jamais de transaction et
  ne porte aucune règle réutilisable.
- Les routes d'une capacité vivent dans son `routes.ts` ; `start/routes.ts` ne
  fait que les importer, dans un ordre qui compte quand les préfixes se
  recouvrent.
- `shared/` porte ce dont plusieurs capacités ont besoin côté délivrance :
  formats de date, URL de médias, briques de validation, métadonnées SEO.
