# kevin-dev.com

Invariants du dépôt. Ce qu'est le site, comment l'installer, les commandes et le
déploiement : [README.md](README.md).

## À lire avant d'écrire

- [Architecture de l'application](docs/architecture/application.md) : direction
  des dépendances, controllers, services, publication, bilinguisme, et les
  checklists par type de changement.
- [CONTEXT.md](CONTEXT.md) : vocabulaire du domaine, à employer tel quel.
- [docs/adr/](docs/adr) : les décisions déjà tranchées, à ne pas rouvrir en
  passant.
- `app/CLAUDE.md`, `src/CLAUDE.md` et `inertia/CLAUDE.md` : les règles propres
  à chaque couche.

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
- **anti-slop** (`dmmulroy/anti-slop`) : `tools/oxlint/anti-slop/`, vendoré tel quel et
  donc exclu du lint comme du format. Une règle se remplace en la resynchronisant avec
  l'amont, pas en l'éditant sur place.
- **Migrations** : de l'historique. On en ajoute, on n'en modifie pas.

## Contenu et données

Les seeds de démo ne disent rien du contenu réel : avant de retirer un affichage parce
qu'il paraît vide ou inutile, le mesurer sur la base de production.

## Vérifier un changement de rendu

Sur le HTML réellement servi (`curl`), pas seulement dans le DOM du navigateur, qui répare
silencieusement les structures invalides. C'est ainsi qu'un `<head>` cassé ou une balise
mal sérialisée se voit.

## Vérifier avant de committer

```bash
npm run lint && npm run format && npm run typecheck && npm test
```

Le lint porte les conventions que ce fichier énonce : elles vivent comme règles
dans `tools/oxlint/project-style/`, et une nouvelle convention durable s'y écrit
plutôt que de rester en prose. À côté, `tools/oxlint/anti-slop/` refuse les
contrats à faible évidence : `unknown` en entrée ou en sortie, dictionnaires sans
type de valeur, assertions non justifiées. Une exception se pose en override
motivé dans `oxlint.config.ts`, jamais en désactivant la règle partout.
