# Architecture de l'application

État constaté du dépôt, à lire avant d'ajouter un écran, un champ ou une règle
métier. Le vocabulaire employé ici est défini dans [CONTEXT.md](../../CONTEXT.md).

C'est une application AdonisJS unique, pas un monorepo : un serveur Adonis 7 qui
rend des pages Inertia React, avec Lucid sur Postgres.

## Direction des dépendances

```text
start/routes.ts ──> app/controllers ──> app/services ──> app/models
                          │
                          └──> inertia/pages   (props sérialisées)
```

- `app/` est le seul endroit qui connaît la base et le métier.
- `inertia/` ne reçoit que des props déjà calculées et déjà traduites.
- `app/types/` est le terrain commun des deux : valeurs sans dépendance runtime
  (locales, énumérations de contenu, types SEO). Le client les importe par
  l'alias `#types`, seule exception à la frontière, tenue par
  `project-style/no-backend-import-in-frontend`.
- `providers/`, `config/`, `start/`, `commands/`, `database/` gardent leur rôle
  AdonisJS.

## Controllers

Un controller par ressource, méthodes RESTful (`index`, `show`, `create`,
`store`, `edit`, `update`, `destroy`). Les écrans publics vivent dans
`app/controllers/`, l'administration dans `app/controllers/admin/`.

Un controller :

- lit la locale (`i18n.locale`), valide l'entrée avec un validator VineJS ;
- charge ses données avec Lucid, ou appelle un service quand il y a une règle ;
- **traduit** : il compose l'objet `labels` que la page recevra ;
- construit ses métadonnées avec `SeoService.build` ;
- sérialise ses props à la main, en ne prenant que ce que la page affiche ;
- flashe un message et redirige après une écriture d'admin.

Un controller ne contient ni calcul métier réutilisable, ni écriture répartie sur
plusieurs tables. Dès qu'une écriture touche des traductions ou des relations,
elle passe par un service qui possède la transaction.

Les pages publiques existent en deux exemplaires de route (racine et `/en`) mais
en un seul controller : la locale vient du préfixe d'URL.

## Services

`app/services/` accueille deux formes, choisies selon l'usage :

- une **classe à méthodes statiques** quand le service a un nom métier et
  plusieurs points d'entrée (`ArticleService`, `MediaService`, `SeoService`,
  `PublicationService`) ;
- des **fonctions exportées** quand ce sont des transformations sans état
  (`content_service`, `translations_service`, `date_format`).

Règles constantes :

- un service qui écrit ouvre lui-même la transaction, le controller jamais ;
- le rendu Markdown se fait avant d'entrer dans la transaction ;
- les trois formats de date du site vivent dans `date_format`, nulle part
  ailleurs ;
- ce que les articles, projets et talks partagent vit dans `content_service`,
  paramétré par une interface structurelle plutôt que dupliqué trois fois.

## Modèles et base

- `database/schema.ts` est **généré** à chaque `migration:run` : chaque modèle
  étend sa classe `XxxSchema` et n'ajoute que relations, accesseurs et helpers.
- `withPublication` (mixin) porte le statut, la date, le scope `published`,
  `isPublished` et `hasBeenOnline`.
- Une entrée traduisible expose `translation(locale)`.
- Les migrations sont de l'historique : on en ajoute, on n'en modifie jamais.
- Les invariants durables sont dans les contraintes Postgres, pas seulement dans
  les validators.

## Validators

`app/validators/` regroupe les schémas VineJS par domaine, et `shared.ts` les
briques communes : `slug(table)`, `status()`, `translation()`, `publishedAt()`,
`relationId(table)`.

Les règles qui dépendent de la ligne éditée (slug figé, transitions de statut
interdites) lisent `field.meta`, que le controller remplit avec `EditedRow`. Un
formulaire d'édition qui oublie ce `meta` désactive silencieusement ces règles.

## Publication

Une seule mécanique, partagée par les trois familles de contenu :

- `PublicationService.preview` décide de ce que voit un visiteur : contenu,
  aperçu avec bandeau, 404 ou 410 ;
- la date de publication est posée à la première mise en ligne, sauf date
  explicite, qui peut programmer l'entrée ;
- une entrée déjà en ligne ne redevient pas brouillon, et son slug est figé.

## Bilinguisme

- Les libellés d'interface publique vivent dans `resources/lang/{fr,en}/`.
- **Le client n'appelle jamais `t()`** : il reçoit `labels` par page, plus
  `chrome` et `lightbox` en props partagées depuis `inertia_middleware`.
- Une chaîne visible en dur dans un composant public est un bug.
- L'administration est monolingue française : ses libellés sont écrits en clair
  dans les pages admin et les messages flash.
- Les URL passent par `localePath(locale, path)`, jamais par une concaténation.
- Les flèches d'interface appartiennent à `LinkArrow`, jamais aux traductions.

## Client Inertia

- Le SSR est actif partout sauf `admin/*` (`config/inertia.ts`), où `window` est
  donc toujours défini.
- Le compilateur React est actif : pas de `useMemo`, `useCallback` ni `memo`.
- `Link` et `Form` viennent de `@adonisjs/inertia/react`, dont la prop `route`
  est typée par le registre généré.
- Les composants partagés existent déjà : les chercher avant d'écrire un bloc,
  et les étendre par une prop plutôt que les dupliquer.

## Tests

- `tests/unit/` pour les services purs, `tests/functional/` pour tout ce qui
  passe par HTTP, avec les helpers de `tests/helpers/`.
- Les tests fonctionnels vérifient le HTML réellement servi, ce qui est la seule
  façon de voir un `<head>` cassé ou une balise mal sérialisée.
- `navigation.spec.ts` garde les invariants d'interface que le lint ne peut pas
  atteindre, comme l'absence de flèches dans les traductions.

## Checklists

### Ajouter une page publique

1. Route en double, racine et `/en`, dans `start/routes.ts`.
2. Méthode de controller qui lit la locale, charge les données, compose
   `labels`, `meta` (`SeoService.build`) et les props.
3. Traductions ajoutées dans les deux fichiers de `resources/lang/`.
4. Page dans `inertia/pages/`, bâtie sur `reading_layout` ou `page_header`.
5. Ajouter l'URL à la liste de `SeoController.sitemap` si elle doit être indexée.
6. Test fonctionnel : la page répond, et son `meta` porte le bon titre.

### Ajouter un écran d'administration

1. Routes CRUD dans le groupe `/admin`, protégé par `middleware.auth()`.
2. Validator dans `app/validators/`, en réutilisant les briques de `shared.ts`.
3. Controller `admin/` : `index`, `create`/`store`, `edit`/`update`, `destroy`,
   avec `EditedRow` en `meta` pour toute édition.
4. Écriture déléguée à un service qui possède la transaction.
5. Page admin construite sur `admin_page`, `content_list`, `slug_field`,
   `publication_actions` et `confirm_button`.
6. Test fonctionnel dans `admin_crud.spec.ts`.

### Ajouter un champ traduit

1. Migration sur la table `*_translations`, puis `migration:run` pour
   régénérer `database/schema.ts`.
2. Champ ajouté dans `translation()` du validator si le formulaire l'envoie.
3. Payload et service de sauvegarde étendus.
4. Formulaire admin : le champ vit dans `translation_fields`, pour exister dans
   les deux langues.
5. Page publique : le controller lit `article.translation(locale)`.

### Ajouter un composant partagé

1. Vérifier qu'aucun composant existant ne couvre le besoin par une prop.
2. Le placer dans `inertia/components/` (public) ou `inertia/components/admin/`.
3. Ne pas y appeler `t()` ni fabriquer de texte : les libellés arrivent en props.
4. Remplacer toutes les duplications repérées, pas seulement l'appelant courant.
