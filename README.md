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
cp .env.test.example .env.test
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

Service **Compose** Dokploy branché sur ce dépôt : [docker-compose.yml](docker-compose.yml)
construit le [Dockerfile](Dockerfile) multi-stage (le `compose.yaml` de la
racine, lui, ne sert qu'au Postgres de développement). Les migrations sont
jouées au démarrage du conteneur ; endpoint de monitoring : `/health` ; les
uploads vivent dans le volume `storage` monté sur `/app/storage`.

Chaque variable doit figurer **à la fois** dans le compose en `${VAR}` et
dans l'onglet Environment de Dokploy — une variable posée d'un seul côté
n'arrive jamais dans le conteneur, sans avertissement. Liste et rôles :
[.env.example](.env.example). Mise en ligne pas à pas : `deploy/new-project.md`
du dépôt Homelab.

### Emails

Le formulaire de contact envoie une notification par SMTP au
**Proton Mail Bridge mutualisé** du VPS (service Dokploy `mailbridge`,
projet `infra`). Le compose attache le conteneur au réseau Docker externe
**`mail`**, seul chemin vers l'hôte `mailbridge` sur le port 25 : le bridge
n'est publié nulle part ailleurs. `SMTP_USERNAME` / `SMTP_PASSWORD`
sont les identifiants **Bridge** (pas ceux du compte Proton), relevés via
`protonmail-bridge --cli`. Détails et procédure de (re)login :
`deploy/mailbridge/README.md` du dépôt Homelab.

Sans `CONTACT_NOTIFICATION_EMAIL`, aucun mail n'est envoyé : c'est le mode
par défaut en développement et en test.
