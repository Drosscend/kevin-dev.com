# Architecture de l'application

État constaté du dépôt, à lire avant d'ajouter un écran, un champ ou une règle
métier. Le vocabulaire employé ici est défini dans [CONTEXT.md](../../CONTEXT.md).

C'est une application AdonisJS unique, pas un monorepo : un serveur Adonis 7 qui
rend des pages Inertia React, avec Lucid sur Postgres.

## Direction des dépendances

```text
app/<capacité>  ──┐
                  ├──> src/<capacité>
inertia/        ──┘
```

- `app/` est la couche de délivrance : controllers, routes, middleware,
  transformers, et ce qui met en forme une réponse.
- `src/` est le métier : actions, queries, repositories, modèles, règles.
- **`src/` n'importe jamais `app/`**, tenu par `project-style/no-app-import-in-core`.
- `inertia/` ne reçoit que des props déjà calculées et déjà traduites, et ne peut
  importer que `#types`, tenu par `project-style/no-backend-import-in-frontend`.
- `providers/`, `config/`, `start/`, `commands/`, `database/` gardent leur rôle
  AdonisJS. Une commande Ace est un adaptateur : elle appelle une action.

Chaque capacité a son alias : `#blog`, `#portfolio`, `#talks`, `#technologies`,
`#pages`, `#identity`, `#contact`, `#media`, `#seo`, `#dashboard`, plus `#core`
et `#shared`.

## Une capacité

```text
app/blog/
  controllers/       un controller par cas d'usage
  routes.ts          les routes de la capacité
src/blog/
  models/            modèles Lucid
  repositories/      les écritures et leurs transactions
  queries/           les lectures nommées
  actions/           les cas d'usage qui changent l'état
```

Ne créer que les dossiers dont la capacité a besoin.

## Controllers

Un controller par cas d'usage, deux méthodes publiques au plus :

- `render` compose des Queries et rend une page Inertia ;
- `execute` valide l'entrée, appelle une Action et mappe son résultat.

La page et sa mutation restent ensemble quand elles servent le même cas d'usage
(`LoginController`, `ArticleFormController`). Une page composite garde un
controller de lecture et un controller par mutation indépendante : la page de
sécurité a `SecurityController.render`, `EnableTotpController.execute`,
`DisableTotpController.execute` et `RegenerateRecoveryCodesController.execute`.

Le validator VineJS vit sur le controller qui l'utilise :

```ts
static readonly validator = vine.create({ ... })
```

Les dépendances arrivent par le constructeur, avec `@inject()`. Un controller
construit ses métadonnées (`SeoService.build`), met en forme les dates, les URL
de médias et les libellés qui dépendent d'une donnée, flashe et redirige. Il ne
contient ni règle métier ni transaction.

## Actions

Une Action est un cas d'usage qui change l'état. Une par fichier, nommée à
l'impératif (`SaveArticle`, `EnableTotp`), avec une seule méthode `execute`.

- Elle renvoie un `Result<T, E>` quand l'appelant peut réagir à un refus métier.
- Les variantes d'erreur sont des unions discriminées locales
  (`{ type: 'article_not_found' }`), sans code HTTP ni message traduit.
- Elle ne lance que pour l'inattendu : le controller mappe chaque variante.
- La transaction appartient au repository qu'elle appelle, jamais au controller.

## Queries

Une Query est une lecture nommée, une par fichier, avec `execute`.

- Elle renvoie une projection façonnée pour son appelant, pas un modèle brut.
- Les dates restent des `DateTime` et les médias des `MediaSource` : leur mise en
  forme appartient à la couche de délivrance.
- Une lecture vraiment triviale peut rester dans le controller.

## Repositories et modèles

- Le repository porte les écritures, leur transaction et le mapping du payload.
- Les modèles étendent les classes générées de `database/schema.ts`, à ne jamais
  éditer à la main, et n'ajoutent que relations, accesseurs et helpers.
- `withPublication` porte le statut, la date, le scope `published`,
  `isPublished` et `hasBeenOnline`.
- Les migrations sont de l'historique : on en ajoute, on n'en modifie jamais.

## Ce que src/shared contient

- `content/` : rendu Markdown, champs communs aux trois familles de contenu,
  upsert des traductions, règles de publication, mixin `publishable`.
- `types/` : valeurs sans dépendance runtime, seules importables par le client.
- `site_url.ts` : l'URL absolue du site.

`app/shared/` contient l'équivalent côté délivrance : formats de date, URL de
médias, briques de validation, construction des métadonnées SEO, et la
traduction d'un verdict de publication en réponse HTTP.

## Transformers

Un transformer est le contrat de sortie d'une page : il déclare la forme que le
client recevra, et le codegen en dérive `Data.<Capacité>.<Nom>`, que la page
consomme au lieu de redéclarer la même chose.

- Un fichier par ressource, dans `app/<capacité>/transformers/`.
- Il étend `BaseTransformer<T>` et sélectionne ses champs avec `pick`.
- La ressource est l'objet que le controller a composé : dates déjà mises en
  forme, URL déjà construites, libellés déjà traduits.
- Le controller passe `XxxTransformer.transform(resource)` à `inertia.render`.
- **Seul le premier niveau des props est résolu** : une collection transformée
  imbriquée dans un objet ne l'est pas, et reste un tableau ordinaire.
- Les listes de choix d'un formulaire n'en valent pas un : elles vivent sous
  `options` et gardent un type local.
- Une page déclare ses props avec `InertiaProps<{ ... }>` : le helper y ajoute
  celles que le middleware partage, qu'elle n'a donc plus à redéclarer.

## Bilinguisme

- Les libellés publics vivent dans `resources/lang/{fr,en}/`.
- **Le client n'appelle jamais `t()`** : il lit `messages`, le dictionnaire de
  la langue courante, partagé par `inertia_middleware` en prop `once` et typé
  depuis le fichier français.
- Un libellé qui dépend d'une donnée reste résolu par le controller.
- La bannière de l'autre langue est écrite dans la langue cible, dans le fichier
  de la langue courante.
- Une chaîne visible en dur dans un composant public est un bug.
- L'administration est monolingue française.
- Les URL passent par `localePath(locale, path)`.

## Routes

Chaque capacité déclare ses routes dans `app/<capacité>/routes.ts`, et
`start/routes.ts` ne fait plus que les importer. **L'ordre des imports compte**
là où les préfixes se recouvrent : `seo` avant `blog`, sinon `/blog/:slug`
avalerait `/blog/rss.xml`.

Le registre `#generated/controllers` est régénéré au démarrage : un controller
dans `app/blog/controllers/` devient `controllers.blog.<Nom>`.

## Client Inertia

- Le SSR est actif partout sauf `admin/*` (`config/inertia.ts`).
- Le compilateur React est actif : pas de `useMemo`, `useCallback` ni `memo`.
- `Link` et `Form` viennent de `@adonisjs/inertia/react`.
- Les composants partagés existent déjà : les chercher avant d'écrire un bloc.

## Tests

- `tests/unit/` pour les fonctions pures, `tests/functional/` pour tout ce qui
  passe par HTTP, avec les helpers de `tests/helpers/`.
- Les fixtures appellent les mêmes actions que l'application.
- Les tests fonctionnels vérifient le HTML réellement servi.

## Checklists

### Ajouter une page publique

1. Query dans `src/<capacité>/queries/`, projection explicite.
2. Controller `render` dans `app/<capacité>/controllers/` : `meta`, mise en
   forme des dates et des URL.
3. Transformer dans `app/<capacité>/transformers/` pour la ressource affichée,
   consommé par la page via `Data.<Capacité>.<Nom>`.
4. Route dans `app/<capacité>/routes.ts`, en double, racine et `/en`.
5. Traductions ajoutées dans les deux fichiers de `resources/lang/`.
6. Page dans `inertia/pages/`, bâtie sur les composants partagés.
7. URL ajoutée à `SitemapController` si elle doit être indexée.
8. Test fonctionnel.

### Ajouter une mutation

1. Action dans `src/<capacité>/actions/`, avec son `Result` et ses variantes.
2. Écriture déléguée au repository, qui possède la transaction.
3. Controller `execute` avec son `static readonly validator`, qui mappe chaque
   variante d'erreur vers une réponse.
4. Route dans le fichier de la capacité.
5. Test fonctionnel dans la spec de l'écran.

### Ajouter un champ traduit

1. Migration sur la table `*_translations`, puis `migration:run` pour
   régénérer `database/schema.ts`.
2. Champ ajouté au payload du repository et au validator du formulaire.
3. Query de formulaire et query de lecture publique étendues.
4. Formulaire admin : le champ vit dans `translation_fields`.

### Ajouter une capacité

1. `src/<nom>/` avec les seuls dossiers utiles, `app/<nom>/controllers/` et
   `app/<nom>/routes.ts`.
2. Alias `#<nom>/*` ajouté aux `imports` de `package.json`.
3. Import du fichier de routes dans `start/routes.ts`, à la bonne place si un
   préfixe recouvre celui d'une autre capacité.
