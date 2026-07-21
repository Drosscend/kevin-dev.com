# kevin-dev.com

Site personnel de Kévin Véronési : blog, portfolio, CV et formulaire de
contact, avec administration intégrée.

## Stack

AdonisJS 7 · Inertia + React 19 (SSR) · Tailwind CSS 4 + shadcn/ui ·
PostgreSQL (Lucid) · Japa. Déployé via Dokploy (Dockerfile) sur VPS Hetzner.

## Développement

Prérequis : Node ≥ 24, Docker (pour Postgres local).

```sh
docker compose up -d       # Postgres local (localhost:5432)
npm install
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
| `npm run lint` / `npm run format` | ESLint / Prettier                                  |
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

Build Docker multi-stage ([Dockerfile](Dockerfile)) ; les migrations sont
jouées au démarrage du conteneur. Endpoint de monitoring : `/health`.
Le dossier `/app/storage` doit être monté en volume persistant (uploads).
Variables d'environnement : voir [.env.example](.env.example) (configurées
dans l'onglet Environment de Dokploy, jamais commitées).
