# kevin-dev.com

Site personnel de Kévin Véronési : blog, portfolio, CV et formulaire de
contact, avec administration intégrée.

## Stack

AdonisJS 7 · Inertia + React 19 (SSR) · Tailwind CSS 4 + shadcn/ui ·
PostgreSQL (Lucid) · Japa. Déployé en conteneur Docker sur un VPS.

## Développement

Prérequis : Node ≥ 24, Docker (pour Postgres local).

```sh
docker compose up -d       # Postgres local (localhost:5432)
npm install
cp .env.test.example .env.test
docker compose exec postgres createdb -U kevin_dev kevin_dev_test
node ace migration:run
npm run dev                # http://localhost:3333
```

Les composants shadcn s'ajoutent avec `npx shadcn@latest add <composant>`
(ils sont créés dans `inertia/components/ui/`).

## Commandes

| Commande                          | Effet                                              |
| --------------------------------- | -------------------------------------------------- |
| `npm run dev`                     | Serveur de dev avec HMR                            |
| `npm run build`                   | Build de production (dans `build/`)                |
| `npm run lint` / `npm run format` | oxlint / oxfmt                                     |
| `npm run typecheck`               | TypeScript serveur + front                         |
| `node ace test unit functional`   | Tests Japa (la suite functional requiert Postgres) |

## Administration

Interface privée sur `/admin` (utilisateur unique, pas d'inscription
publique). Le compte est créé par seed à partir des variables
`ADMIN_EMAIL` / `ADMIN_PASSWORD` :

```sh
node ace db:seed
```

La double authentification TOTP s'active depuis `/admin/security`
(QR code à scanner, confirmation par code). La bibliothèque média
réencode les images en webp (variantes 320/640/1280) dans
`storage/media/`, servies sous `/uploads/…`.

## Production

[docker-compose.yml](docker-compose.yml) décrit la pile déployée : l'image
issue du [Dockerfile](Dockerfile) multi-stage et son Postgres (service `db`,
réseau `internal` que seule l'app atteint, volume `postgres_data`). Le
`compose.yaml` de la racine, lui, ne sert qu'au Postgres de développement.
Les migrations sont jouées au démarrage du conteneur ; endpoint de
monitoring : `/health` ; les uploads vivent dans le volume `storage` monté
sur `/app/storage`.

Aucun secret dans le dépôt : chaque variable est référencée en `${VAR}`
dans le compose et renseignée côté plateforme de déploiement. Liste et
rôles : [.env.example](.env.example).

### Emails

Le formulaire de contact envoie une notification par SMTP à un relais joint
sur un réseau Docker privé, jamais exposé publiquement (`SMTP_HOST`,
`SMTP_PORT` et les identifiants `SMTP_USERNAME` / `SMTP_PASSWORD`).

Sans `CONTACT_NOTIFICATION_EMAIL`, aucun mail n'est envoyé : c'est le mode
par défaut en développement et en test.
