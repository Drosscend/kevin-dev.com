import { DateTime } from 'luxon'

/**
 * Demo fixtures rendered by DemoContentSeeder. Kept apart from the
 * seeding logic so the content can be reworked without touching the
 * insertion order or the relations wiring.
 */

/** Gradient endpoints of a generated cover image. */
export type Cover = { name: string; from: string; to: string }

/** Days before today, as an ISO timestamp. */
function daysAgo(days: number) {
  return DateTime.now().minus({ days }).toISO()!
}

/** Days after today, as an ISO timestamp (scheduled entries). */
function inDays(days: number) {
  return DateTime.now().plus({ days }).toISO()!
}

/** Calendar date offset from today, negative for the past. */
function isoDate(days: number) {
  return DateTime.now().plus({ days }).toISODate()!
}

export const TECHNOLOGIES = [
  {
    slug: 'typescript',
    name: 'TypeScript',
    category: 'langage' as const,
    fr: "Typage statique sur toute la stack, du contrôleur AdonisJS jusqu'aux composants React.",
    en: 'Static typing across the whole stack, from AdonisJS controllers down to React components.',
  },
  {
    slug: 'python',
    name: 'Python',
    category: 'langage' as const,
    fr: "Scripts d'ingestion, traitement de données et prototypage rapide de modèles.",
    en: 'Ingestion scripts, data processing and quick model prototyping.',
  },
  {
    slug: 'go',
    name: 'Go',
    category: 'langage' as const,
    fr: 'Services réseau à faible latence et binaires autonomes faciles à déployer.',
    en: 'Low-latency network services and self-contained binaries that are easy to deploy.',
  },
  {
    slug: 'adonisjs',
    name: 'AdonisJS',
    category: 'framework' as const,
    fr: "Framework Node.js complet : ORM, validation, sessions et files d'attente sans assemblage manuel.",
    en: 'Full-featured Node.js framework: ORM, validation, sessions and queues without manual wiring.',
  },
  {
    slug: 'react',
    name: 'React',
    category: 'framework' as const,
    fr: "Interfaces déclaratives, aujourd'hui compilées par le React Compiler pour éviter la mémoïsation manuelle.",
    en: 'Declarative interfaces, now compiled by the React Compiler to avoid manual memoization.',
  },
  {
    slug: 'inertia',
    name: 'Inertia.js',
    category: 'framework' as const,
    fr: 'Le confort du monolithe avec le rendu client : pas de couche API à maintenir en double.',
    en: 'Monolith ergonomics with client-side rendering: no duplicate API layer to maintain.',
  },
  {
    slug: 'tailwind-css',
    name: 'Tailwind CSS',
    category: 'framework' as const,
    fr: 'Design system exprimé en tokens utilitaires, cohérent entre thème clair et sombre.',
    en: 'A design system expressed as utility tokens, consistent across light and dark themes.',
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    category: 'infra' as const,
    fr: 'Base relationnelle principale : contraintes strictes, index partiels et recherche plein texte.',
    en: 'The primary relational store: strict constraints, partial indexes and full-text search.',
  },
  {
    slug: 'redis',
    name: 'Redis',
    category: 'infra' as const,
    fr: "Cache applicatif, limitation de débit et files d'attente légères.",
    en: 'Application cache, rate limiting and lightweight queues.',
  },
  {
    slug: 'docker',
    name: 'Docker',
    category: 'infra' as const,
    fr: 'Images multi-étages reproductibles, identiques du poste de dev à la production.',
    en: 'Reproducible multi-stage images, identical from the dev machine to production.',
  },
  {
    slug: 'kubernetes',
    name: 'Kubernetes',
    category: 'infra' as const,
    fr: 'Orchestration des services de production, avec montées de version progressives.',
    en: 'Production service orchestration, with progressive rollouts.',
  },
  {
    slug: 'vite',
    name: 'Vite',
    category: 'outil' as const,
    fr: 'Build des assets et rechargement à chaud quasi instantané en développement.',
    en: 'Asset bundling and near-instant hot reload during development.',
  },
  {
    slug: 'playwright',
    name: 'Playwright',
    category: 'outil' as const,
    fr: 'Tests de bout en bout sur navigateurs réels, exécutés à chaque pull request.',
    en: 'End-to-end tests on real browsers, run on every pull request.',
  },
  {
    slug: 'grafana',
    name: 'Grafana',
    category: 'outil' as const,
    fr: 'Tableaux de bord de métriques et alertes branchées sur les traces OpenTelemetry.',
    en: 'Metric dashboards and alerts wired to OpenTelemetry traces.',
  },
]

export const CATEGORIES = [
  { slug: 'backend', fr: 'Backend', en: 'Backend' },
  { slug: 'frontend', fr: 'Frontend', en: 'Frontend' },
  { slug: 'devops', fr: 'DevOps', en: 'DevOps' },
  {
    slug: 'intelligence-artificielle',
    fr: 'Intelligence artificielle',
    en: 'Artificial intelligence',
  },
]

export const TAGS = [
  { slug: 'adonisjs', fr: 'AdonisJS', en: 'AdonisJS' },
  { slug: 'react', fr: 'React', en: 'React' },
  { slug: 'postgresql', fr: 'PostgreSQL', en: 'PostgreSQL' },
  { slug: 'performance', fr: 'Performance', en: 'Performance' },
  { slug: 'architecture', fr: 'Architecture', en: 'Architecture' },
  { slug: 'tests', fr: 'Tests', en: 'Testing' },
  { slug: 'docker', fr: 'Docker', en: 'Docker' },
  { slug: 'llm', fr: 'LLM', en: 'LLM' },
]

export const ARTICLES = [
  {
    slug: 'inertia-sans-couche-api',
    category: 'backend',
    tags: ['adonisjs', 'react', 'architecture'],
    publishedAt: daysAgo(6),
    status: 'published' as const,
    cover: { name: 'inertia', from: '#9e2430', to: '#2b1013' },
    fr: {
      title: 'Inertia, ou comment supprimer sa couche API',
      summary:
        "Sur un monolithe rendu côté client, la moitié du code d'API existe uniquement pour transporter des données vers le front. Inertia le rend inutile.",
      contentMarkdown: `## Le coût caché d'une API interne

Une application dont le seul consommateur est son propre front-end paie
deux fois le prix de son API : une fois pour la sérialisation côté
serveur, une fois pour le client HTTP, les types et le cache côté
navigateur. Ce code ne sert aucun tiers.

Inertia remplace ce transport par une convention : le contrôleur renvoie
un nom de page et un objet de props, le client monte le composant React
correspondant.

\`\`\`ts
export default class ProjectsController {
  async index({ inertia }: HttpContext) {
    const projects = await Project.query()
      .withScopes((scopes) => scopes.published())
      .preload('translations')
      .orderBy('published_at', 'desc')

    return inertia.render('projects/index', {
      projects: projects.map((project) => ({
        slug: project.slug,
        title: project.translation('fr')!.title,
      })),
    })
  }
}
\`\`\`

## Le cycle d'une requête

\`\`\`mermaid
flowchart LR
  A[Clic sur un lien] --> B[Requête XHR Inertia]
  B --> C[Contrôleur AdonisJS]
  C --> D[Props JSON]
  D --> E[Montage du composant React]
\`\`\`

## Ce qu'on gagne, ce qu'on perd

| Aspect | API REST interne | Inertia |
| --- | --- | --- |
| Couche de transport | À écrire et versionner | Fournie |
| Typage bout en bout | Duplication des schémas | Props du contrôleur |
| Client mobile natif | Prêt | À ajouter plus tard |

Le compromis est net : tant qu'aucun tiers ne consomme les données, la
couche API est un poids mort. Le jour où un client mobile arrive, rien
n'empêche d'exposer un sous-ensemble en REST à côté.

## En pratique

Trois règles suffisent à garder les pages lisibles :

1. Une page Inertia par route, jamais de composant partagé qui devine
   son contexte.
2. Les props sont mises en forme dans le contrôleur, pas dans le
   composant.
3. Tout ce qui n'est pas affiché n'est pas envoyé — les requêtes
   sélectionnent les colonnes utiles.`,
    },
    en: {
      title: 'Inertia, or how to delete your API layer',
      summary:
        'In a client-rendered monolith, half of the API exists purely to move data to the front-end. Inertia makes it unnecessary.',
      contentMarkdown: `## The hidden cost of an internal API

An application whose only consumer is its own front-end pays for its API
twice: once for server-side serialization, once for the HTTP client,
types and caching in the browser. None of that code serves a third party.

Inertia replaces that transport with a convention: the controller
returns a page name and a props object, and the client mounts the
matching React component.

\`\`\`ts
return inertia.render('projects/index', { projects })
\`\`\`

## What you gain, what you give up

| Aspect | Internal REST API | Inertia |
| --- | --- | --- |
| Transport layer | Write and version it | Provided |
| End-to-end typing | Duplicated schemas | Controller props |
| Native mobile client | Ready | Add later |

The trade-off is clear: as long as no third party consumes the data, the
API layer is dead weight.`,
    },
  },
  {
    slug: 'index-partiels-postgresql',
    category: 'backend',
    tags: ['postgresql', 'performance'],
    publishedAt: daysAgo(19),
    status: 'published' as const,
    cover: { name: 'postgres', from: '#1f4e79', to: '#0d1b2a' },
    fr: {
      title: 'Index partiels : diviser par dix la taille de ses index',
      summary:
        "La plupart des requêtes d'un site filtrent sur un statut publié. Indexer les brouillons ne sert alors strictement à rien.",
      contentMarkdown: `## Le constat

Sur une table d'articles, environ 15 % des lignes sont des brouillons.
Elles ne sont jamais lues par le site public, et pourtant chaque index
sur \`published_at\` les contient.

\`\`\`sql
CREATE INDEX articles_published_at_idx
  ON articles (published_at DESC)
  WHERE status = 'published';
\`\`\`

## Mesurer avant de conclure

\`\`\`sql
EXPLAIN ANALYZE
SELECT id, slug FROM articles
WHERE status = 'published' AND published_at <= now()
ORDER BY published_at DESC
LIMIT 10;
\`\`\`

Le planificateur n'utilise l'index partiel que si la clause \`WHERE\` de
la requête implique logiquement celle de l'index. Un \`status = $1\`
paramétré ne suffit pas toujours : la constante doit être visible au
moment de la planification.

## Résultats

| Index | Taille | Temps médian |
| --- | --- | --- |
| Complet | 41 Mo | 3,2 ms |
| Partiel | 4 Mo | 0,9 ms |

Le gain vient moins du temps de parcours que du taux de présence en
cache : un index dix fois plus petit reste en mémoire.`,
    },
    en: null,
  },
  {
    slug: 'react-compiler-en-production',
    category: 'frontend',
    tags: ['react', 'performance'],
    publishedAt: daysAgo(33),
    status: 'published' as const,
    cover: { name: 'react-compiler', from: '#0f766e', to: '#052e2b' },
    fr: {
      title: 'Le React Compiler en production : six mois plus tard',
      summary:
        "Retirer tous les useMemo et useCallback d'une base de code fait peur. Le résultat est plus lisible, et mesurablement plus rapide.",
      contentMarkdown: `## Ce que le compilateur fait à votre place

Le React Compiler analyse les composants et insère la mémoïsation là où
elle est nécessaire. La contrepartie : le code doit respecter les règles
de React, sans mutation d'état pendant le rendu.

\`\`\`tsx
// Avant
export const sorted = useMemo(
  () => [...items].sort((a, b) => a.position - b.position),
  [items]
)

// Après : le compilateur s'en charge
export const sorted = [...items].sort((a, b) => a.position - b.position)
\`\`\`

## La migration, étape par étape

1. Activer \`eslint-plugin-react-hooks\` en mode strict et corriger les
   violations restantes.
2. Activer le compilateur sur un seul dossier, mesurer.
3. Supprimer la mémoïsation manuelle par petits lots.

## Ce qui a réellement changé

Les rendus inutiles ont baissé d'environ 40 % sur les écrans de
formulaire, où la mémoïsation manuelle était la plus incomplète. Sur les
pages statiques, aucune différence mesurable — et c'est normal.

Le vrai bénéfice est ailleurs : les revues de code ne discutent plus des
tableaux de dépendances.`,
    },
    en: {
      title: 'The React Compiler in production: six months on',
      summary:
        'Removing every useMemo and useCallback from a codebase sounds reckless. The result is more readable, and measurably faster.',
      contentMarkdown: `## What the compiler does for you

The React Compiler analyzes components and inserts memoization where it
is actually needed. The catch: your code has to follow the rules of
React, with no state mutation during render.

## What actually changed

Wasted renders dropped by roughly 40% on form-heavy screens, where
manual memoization was the most incomplete. On static pages, no
measurable difference — as expected.`,
    },
  },
  {
    slug: 'pipeline-ci-monorepo',
    category: 'devops',
    tags: ['docker', 'tests', 'performance'],
    publishedAt: daysAgo(52),
    status: 'published' as const,
    cover: { name: 'ci', from: '#7c3aed', to: '#241155' },
    fr: {
      title: 'Une CI de monorepo qui reste sous les cinq minutes',
      summary:
        'Le temps de CI est un budget. Voici comment il a été dépensé, et les trois décisions qui ont divisé la facture par trois.',
      contentMarkdown: `## Le budget de départ

Dix-sept minutes par pull request, dont onze passées à réinstaller des
dépendances déjà installées la veille.

\`\`\`mermaid
flowchart TD
  A[Push] --> B{Fichiers modifiés}
  B -->|app/| C[Tests serveur]
  B -->|inertia/| D[Tests client]
  B -->|database/| C
  C --> E[Build image]
  D --> E
\`\`\`

## Trois décisions

### 1. Ne construire que ce qui a changé

Le graphe de dépendances du monorepo détermine les tâches à relancer.
Une modification de documentation ne déclenche plus de build Docker.

### 2. Un cache de couches partagé

\`\`\`dockerfile
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
\`\`\`

### 3. Paralléliser sans saturer

Au-delà de six exécuteurs, le temps total remontait : les conteneurs se
disputaient le même serveur PostgreSQL de test. Un schéma par exécuteur
a réglé le problème.

## Où en est le budget

| Étape | Avant | Après |
| --- | --- | --- |
| Installation | 11 min | 40 s |
| Tests | 4 min | 2 min 10 |
| Build image | 2 min | 1 min 05 |`,
    },
    en: null,
  },
  {
    slug: 'rag-maison-pgvector',
    category: 'intelligence-artificielle',
    tags: ['llm', 'postgresql', 'architecture'],
    publishedAt: daysAgo(78),
    status: 'published' as const,
    cover: { name: 'rag', from: '#b45309', to: '#3b1d02' },
    fr: {
      title: 'Un RAG maison avec pgvector, sans base vectorielle dédiée',
      summary:
        'Pour quelques dizaines de milliers de documents, PostgreSQL suffit largement. Ajouter une base vectorielle serait un service de plus à exploiter.',
      contentMarkdown: `## Poser le problème avant l'outil

La question n'est pas « quelle base vectorielle choisir » mais « combien
de vecteurs, pour quelle latence ». À 50 000 documents et 200 ms de
budget, l'extension \`pgvector\` répond sans introduire de nouveau
service à sauvegarder, surveiller et mettre à jour.

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE documents ADD COLUMN embedding vector(1536);

CREATE INDEX documents_embedding_idx
  ON documents USING hnsw (embedding vector_cosine_ops);
\`\`\`

## Le découpage compte plus que le modèle

Les gains les plus nets ne sont pas venus du modèle d'embedding, mais du
découpage : des blocs de 400 à 600 tokens alignés sur les titres de
section, avec un chevauchement d'un paragraphe.

\`\`\`ts
export const results = await db
  .from('documents')
  .select('id', 'title', 'body')
  .orderByRaw('embedding <=> ?', [queryEmbedding])
  .limit(8)
\`\`\`

## Le rerank change tout

Récupérer huit blocs puis les reclasser avec un modèle de rerank a fait
plus pour la qualité des réponses que doubler la taille du corpus
indexé. La recherche vectorielle sert à réduire l'espace, pas à choisir.

## Quand migrer

Trois signaux : un temps de réponse au 95e centile qui dépasse le
budget, une table de vecteurs qui ne tient plus en mémoire, ou un besoin
de filtrage par métadonnées trop complexe pour un \`WHERE\`.`,
    },
    en: {
      title: 'A home-grown RAG on pgvector, without a dedicated vector store',
      summary:
        'For a few tens of thousands of documents, PostgreSQL is plenty. A vector database would just be one more service to operate.',
      contentMarkdown: `## Frame the problem before picking a tool

The question is not "which vector database" but "how many vectors, at
what latency". At 50,000 documents and a 200 ms budget, the \`pgvector\`
extension answers without adding a service to back up, monitor and
upgrade.

## Chunking matters more than the model

The clearest wins came from chunking, not from the embedding model:
400-to-600-token blocks aligned on section headings, with one paragraph
of overlap.`,
    },
  },
  {
    slug: 'tests-e2e-qui-ne-mentent-pas',
    category: 'devops',
    tags: ['tests', 'performance'],
    publishedAt: daysAgo(104),
    status: 'published' as const,
    cover: { name: 'e2e', from: '#0369a1', to: '#052236' },
    fr: {
      title: 'Des tests end-to-end qui ne mentent pas',
      summary:
        "Un test instable est pire qu'un test absent : il apprend à l'équipe à ignorer le rouge.",
      contentMarkdown: `## L'instabilité n'est pas une fatalité

Presque toutes les instabilités observées se ramenaient à trois causes :
une attente basée sur le temps, un état partagé entre tests, ou un
sélecteur lié à la mise en page.

\`\`\`ts
// Fragile : dépend du temps de rendu
await page.waitForTimeout(500)
await page.click('.btn-primary')

// Stable : dépend de l'état observable
await page.getByRole('button', { name: 'Publier' }).click()
await expect(page.getByText('Article publié')).toBeVisible()
\`\`\`

## Isoler l'état

Chaque test s'exécute dans sa propre transaction, annulée à la fin. Le
coût d'exécution est négligeable devant celui d'une journée passée à
chercher pourquoi le test 12 échoue seulement après le test 7.

## Le bon nombre de tests

Une dizaine de parcours critiques couverts de bout en bout, le reste en
tests fonctionnels sur les contrôleurs. Au-delà, le temps de CI grimpe
plus vite que la confiance.`,
    },
    en: null,
  },
  {
    slug: 'observabilite-opentelemetry',
    category: 'devops',
    tags: ['architecture', 'docker'],
    publishedAt: null,
    status: 'draft' as const,
    cover: null,
    fr: {
      title: 'Instrumenter une application AdonisJS avec OpenTelemetry',
      summary:
        "Notes de travail sur la mise en place des traces distribuées, du contexte de requête jusqu'aux requêtes SQL.",
      contentMarkdown: `## Brouillon

Plan prévu :

- Le contexte de trace propagé par le middleware HTTP
- L'instrumentation automatique de Lucid, et ses angles morts
- Les attributs à ne surtout pas enregistrer (jetons, en-têtes d'auth)
- Le coût réel de l'échantillonnage à 100 %

À compléter après la mise en production du collecteur.`,
    },
    en: null,
  },
  {
    slug: 'edge-rendering-2027',
    category: 'frontend',
    tags: ['react', 'performance', 'architecture'],
    publishedAt: inDays(9),
    status: 'published' as const,
    cover: { name: 'edge', from: '#be123c', to: '#3f0715' },
    fr: {
      title: 'Le rendu en périphérie a-t-il encore un sens en 2027 ?',
      summary:
        'Article programmé : bilan de trois ans de rendu en périphérie, et des cas où un simple serveur bien placé fait mieux.',
      contentMarkdown: `## Programmé

Cet article est planifié : il n'apparaîtra sur le site public qu'à sa
date de publication.

## Plan

1. Ce que la latence réseau coûte réellement
2. Les bases de données, angle mort du rendu en périphérie
3. Le cas d'un serveur unique bien placé et d'un CDN devant`,
    },
    en: null,
  },
]

export const PROJECTS = [
  {
    slug: 'atlas-cms',
    featured: true,
    status: 'published' as const,
    startedAt: '2024-02-01',
    endedAt: null,
    publishedAt: daysAgo(11),
    technologies: ['adonisjs', 'typescript', 'postgresql', 'react', 'inertia'],
    articles: ['inertia-sans-couche-api', 'index-partiels-postgresql'],
    cover: { name: 'atlas', from: '#9e2430', to: '#2b1013' },
    links: [
      {
        label: 'Code source',
        url: 'https://github.com/exemple/atlas-cms',
        type: 'github' as const,
      },
      { label: 'Démo', url: 'https://atlas.exemple.dev', type: 'demo' as const },
    ],
    fr: {
      title: 'Atlas CMS',
      summary:
        "Un CMS bilingue sans compromis sur les performances : contenus versionnés, rendu Markdown à l'écriture, aucune requête de rendu à la lecture.",
      contentMarkdown: `## Le problème

Les CMS génériques rendent le Markdown à chaque affichage de page. Sur
un site de contenu, c'est du travail répété des milliers de fois pour un
résultat identique.

## L'approche

Atlas rend le Markdown une seule fois, au moment de l'enregistrement, et
stocke le HTML nettoyé. La page publique ne fait plus qu'une lecture.

- Traductions françaises et anglaises par entité, jamais dupliquées
- Coloration syntaxique et diagrammes Mermaid rendus à l'écriture
- Médias ré-encodés en WebP avec variantes responsives

## Résultat

| Métrique | Avant | Après |
| --- | --- | --- |
| Temps serveur (p95) | 180 ms | 24 ms |
| Requêtes SQL par page | 14 | 3 |`,
    },
    en: {
      title: 'Atlas CMS',
      summary:
        'A bilingual CMS with no performance compromise: versioned content, Markdown rendered on write, zero rendering work on read.',
      contentMarkdown: `## The problem

Generic CMSes render Markdown on every page view. On a content site,
that is the same work repeated thousands of times for an identical
result.

## The approach

Atlas renders Markdown once, on save, and stores sanitized HTML. The
public page is a plain read.`,
    },
  },
  {
    slug: 'flux-analytics',
    featured: true,
    status: 'published' as const,
    startedAt: '2023-09-15',
    endedAt: '2025-04-30',
    publishedAt: daysAgo(46),
    technologies: ['go', 'postgresql', 'redis', 'grafana', 'docker'],
    articles: ['pipeline-ci-monorepo'],
    cover: { name: 'flux', from: '#1f4e79', to: '#0d1b2a' },
    links: [
      { label: 'Code source', url: 'https://github.com/exemple/flux', type: 'github' as const },
      {
        label: 'Version 2.0',
        url: 'https://github.com/exemple/flux/releases',
        type: 'release' as const,
      },
    ],
    fr: {
      title: 'Flux Analytics',
      summary:
        "Mesure d'audience sans cookie ni donnée personnelle, conçue pour tenir sur un seul serveur jusqu'à cinq millions d'événements par jour.",
      contentMarkdown: `## Contrainte de départ

Aucun identifiant persistant, aucune donnée personnelle stockée, et une
facture d'infrastructure qui tient sur un seul serveur.

## Architecture

\`\`\`mermaid
flowchart LR
  A[Script client] --> B[Collecteur Go]
  B --> C[(Redis)]
  C --> D[Agrégateur]
  D --> E[(PostgreSQL)]
  E --> F[Tableaux de bord]
\`\`\`

Les événements sont agrégés en fenêtres d'une minute avant écriture :
PostgreSQL ne voit jamais l'événement unitaire, seulement des compteurs.

## Ce que ça a coûté

Deux mois de développement, et une leçon : l'agrégation en amont rend
impossible toute analyse rétrospective non prévue. C'est un choix
assumé, pas un oubli.`,
    },
    en: null,
  },
  {
    slug: 'mnemo',
    featured: true,
    status: 'published' as const,
    startedAt: '2025-01-10',
    endedAt: null,
    publishedAt: daysAgo(88),
    technologies: ['python', 'postgresql', 'typescript', 'docker'],
    articles: ['rag-maison-pgvector'],
    cover: { name: 'mnemo', from: '#b45309', to: '#3b1d02' },
    links: [
      { label: 'Code source', url: 'https://github.com/exemple/mnemo', type: 'github' as const },
    ],
    fr: {
      title: 'Mnemo',
      summary:
        "Assistant de recherche documentaire sur base privée : indexation incrémentale, citations vérifiables, aucune donnée envoyée à un tiers pour l'indexation.",
      contentMarkdown: `## Objectif

Répondre à des questions sur un corpus interne de plusieurs milliers de
documents, en citant systématiquement les passages utilisés.

## Choix techniques

- Embeddings calculés localement, stockés dans PostgreSQL via pgvector
- Découpage aligné sur la structure des documents, pas sur un nombre
  fixe de caractères
- Reclassement des huit meilleurs blocs avant génération

## Limite connue

Sur les questions qui demandent de croiser plus de trois documents, le
taux de réponse correcte chute nettement. Le système annonce alors son
incertitude plutôt que de deviner.`,
    },
    en: {
      title: 'Mnemo',
      summary:
        'A document research assistant over a private corpus: incremental indexing, verifiable citations, no data sent to third parties for indexing.',
      contentMarkdown: `## Goal

Answer questions over an internal corpus of several thousand documents,
always citing the passages used.

## Known limitation

On questions that require cross-referencing more than three documents,
accuracy drops sharply. The system reports its uncertainty instead of
guessing.`,
    },
  },
  {
    slug: 'orbite-design-system',
    featured: false,
    status: 'published' as const,
    startedAt: '2024-06-01',
    endedAt: '2025-02-28',
    publishedAt: daysAgo(140),
    technologies: ['react', 'typescript', 'tailwind-css', 'vite', 'playwright'],
    articles: ['react-compiler-en-production'],
    cover: { name: 'orbite', from: '#0f766e', to: '#052e2b' },
    links: [
      { label: 'Documentation', url: 'https://orbite.exemple.dev', type: 'demo' as const },
      { label: 'Code source', url: 'https://github.com/exemple/orbite', type: 'github' as const },
    ],
    fr: {
      title: 'Orbite',
      summary:
        'Design system de 40 composants accessibles, thème clair et sombre, distribué en un seul paquet sans dépendance runtime.',
      contentMarkdown: `## Pourquoi un de plus

Les bibliothèques existantes imposaient soit un moteur de style
propriétaire, soit un poids de bundle disproportionné pour la douzaine
de composants réellement utilisés.

## Principes

1. Aucune dépendance runtime en dehors de React
2. Chaque composant testé au clavier et au lecteur d'écran
3. Les tokens de couleur sont la seule source de vérité du thème

## État

Quarante composants, 96 % de couverture sur les interactions clavier,
et une taille de bundle de 18 ko compressés pour l'ensemble.`,
    },
    en: null,
  },
  {
    slug: 'relais',
    featured: false,
    status: 'published' as const,
    startedAt: '2023-03-01',
    endedAt: '2023-11-30',
    publishedAt: daysAgo(210),
    technologies: ['go', 'kubernetes', 'docker', 'grafana'],
    articles: [],
    cover: { name: 'relais', from: '#7c3aed', to: '#241155' },
    links: [
      { label: 'Code source', url: 'https://github.com/exemple/relais', type: 'github' as const },
    ],
    fr: {
      title: 'Relais',
      summary:
        'Passerelle de déploiement pour environnements éphémères : une branche poussée devient une URL de prévisualisation en moins de quarante secondes.',
      contentMarkdown: `## Le besoin

Faire relire une modification d'interface sans demander à la personne
qui relit d'installer quoi que ce soit.

## Fonctionnement

Chaque branche déclenche la construction d'une image et le déploiement
d'un espace isolé, détruit automatiquement sept jours après le dernier
commit.

## Bilan

Le projet est archivé : la fonctionnalité existe désormais nativement
dans la plateforme utilisée. Le code reste public à titre de référence.`,
    },
    en: null,
  },
  {
    slug: 'sentinelle',
    featured: false,
    status: 'draft' as const,
    startedAt: '2026-05-01',
    endedAt: null,
    publishedAt: null,
    technologies: ['typescript', 'postgresql', 'redis'],
    articles: [],
    cover: null,
    links: [],
    fr: {
      title: 'Sentinelle',
      summary:
        'Surveillance de disponibilité auto-hébergée, avec alertes contextuelles et historique de disponibilité public. Projet en cours.',
      contentMarkdown: `## En cours d'écriture

Ce projet n'est pas encore publié. Les points à documenter :

- Le format des sondes et leur planification
- La déduplication des alertes pendant un incident
- La page d'état publique et son cache`,
    },
    en: null,
  },
]

export const TALKS = [
  {
    slug: 'postgres-suffit-souvent',
    status: 'published' as const,
    eventDate: isoDate(-38),
    eventName: 'DevFest Lyon',
    city: 'Lyon',
    publishedAt: daysAgo(60),
    technologies: ['postgresql', 'python'],
    cover: { name: 'talk-postgres', from: '#1f4e79', to: '#0d1b2a' },
    links: [
      {
        label: 'Slides',
        url: 'https://slides.exemple.dev/postgres-suffit',
        type: 'slides' as const,
      },
      {
        label: 'Rediffusion',
        url: 'https://videos.exemple.dev/devfest-postgres',
        type: 'video' as const,
      },
      {
        label: 'Page de l’événement',
        url: 'https://devfest.exemple.dev/2026',
        type: 'event' as const,
      },
    ],
    fr: {
      title: 'PostgreSQL suffit (bien plus longtemps qu’on ne le croit)',
      summary:
        'Recherche plein texte, file d’attente, vecteurs, cache : quatre besoins pour lesquels on ajoute un service, et ce que PostgreSQL fait déjà.',
      contentMarkdown: `## Le point de départ

Une architecture accumule les services au rythme des besoins ponctuels.
Chacun se justifie isolément ; l’ensemble devient impossible à exploiter
à deux personnes.

## Les quatre cas passés en revue

| Besoin | Le réflexe | Ce que fait Postgres |
| --- | --- | --- |
| Recherche | Elasticsearch | \`tsvector\` et index GIN |
| File d’attente | Redis, RabbitMQ | \`SELECT … FOR UPDATE SKIP LOCKED\` |
| Vecteurs | Base vectorielle | \`pgvector\` et index HNSW |
| Cache | Redis | Table \`UNLOGGED\` |

## Où est la limite

La question n’est pas idéologique : chaque cas a un seuil chiffré à
partir duquel le service dédié gagne. Le propos de l’intervention est
d’expliciter ces seuils plutôt que de choisir par défaut.`,
    },
    en: {
      title: 'PostgreSQL is enough (for far longer than you think)',
      summary:
        'Full-text search, queues, vectors, caching: four needs that usually add a service, and what PostgreSQL already does.',
      contentMarkdown: `## The starting point

Architectures accumulate services one ad-hoc need at a time. Each is
justified on its own; the result is impossible for a two-person team to
operate.

## Where the limit is

The point is not ideological: every case has a measurable threshold past
which the dedicated service wins. The talk makes those thresholds
explicit instead of picking by default.`,
    },
  },
  {
    slug: 'inertia-monolithe-moderne',
    status: 'published' as const,
    eventDate: isoDate(-96),
    eventName: 'Meetup Lyon JS',
    city: 'Lyon',
    publishedAt: daysAgo(120),
    technologies: ['adonisjs', 'react', 'inertia', 'typescript'],
    cover: { name: 'talk-inertia', from: '#9e2430', to: '#2b1013' },
    links: [
      {
        label: 'Slides',
        url: 'https://slides.exemple.dev/inertia-monolithe',
        type: 'slides' as const,
      },
      {
        label: 'Code de démonstration',
        url: 'https://github.com/exemple/demo-inertia',
        type: 'code' as const,
      },
    ],
    fr: {
      title: 'Le monolithe moderne : AdonisJS, Inertia et React',
      summary:
        'Démonstration en direct : partir d’une page blanche et arriver à un CRUD bilingue typé de bout en bout, sans écrire une seule route d’API.',
      contentMarkdown: `## Format

Quarante minutes de code en direct, sans diapositive au-delà de la
première. Le dépôt de démonstration est utilisable tel quel.

## Ce qui est construit

1. Une ressource avec ses traductions
2. Le formulaire d’édition et sa validation partagée
3. La page publique, rendue côté serveur au premier chargement

## La question qui revient toujours

« Et si demain il me faut une application mobile ? » — la réponse tient
en une phrase : exposer alors les trois endpoints nécessaires, pas les
quarante qu’on aurait écrits par anticipation.`,
    },
    en: null,
  },
  {
    slug: 'atelier-observabilite',
    status: 'published' as const,
    eventDate: isoDate(-210),
    eventName: 'Cloud Native Days',
    city: 'Marseille',
    publishedAt: daysAgo(230),
    technologies: ['docker', 'kubernetes', 'grafana', 'go'],
    cover: null,
    links: [
      {
        label: 'Support de l’atelier',
        url: 'https://github.com/exemple/atelier-otel',
        type: 'code' as const,
      },
    ],
    fr: {
      title: 'Atelier : instrumenter une application de zéro',
      summary:
        'Trois heures, une application volontairement mal instrumentée, et un incident à diagnostiquer à la fin. Format atelier, vingt participants.',
      contentMarkdown: `## Déroulé

L’atelier part d’une application qui journalise beaucoup et n’explique
rien. Les participants ajoutent traces, métriques et corrélation
d’identifiants de requête, puis diagnostiquent une panne injectée.

## Ce que les participants repartent avec

- Un fil de trace complet, du navigateur jusqu’à la requête SQL
- Trois métriques qui valent mieux que trente tableaux de bord
- La liste des attributs à ne jamais enregistrer`,
    },
    en: null,
  },
  {
    slug: 'rag-sans-magie',
    status: 'published' as const,
    eventDate: isoDate(34),
    eventName: 'Devoxx France',
    city: 'Paris',
    publishedAt: daysAgo(12),
    technologies: ['python', 'postgresql'],
    cover: { name: 'talk-rag', from: '#b45309', to: '#3b1d02' },
    links: [
      {
        label: 'Page de l’événement',
        url: 'https://devoxx.exemple.fr/2026',
        type: 'event' as const,
      },
    ],
    fr: {
      title: 'RAG sans magie : mesurer avant d’ajouter',
      summary:
        'Intervention à venir : ce que le découpage, le rerank et l’évaluation apportent réellement, chiffres à l’appui.',
      contentMarkdown: `## Intervention à venir

Le support sera publié ici le jour de la conférence.

## Plan annoncé

1. Construire un jeu d’évaluation avant d’écrire la première requête
2. Découpage, rerank, fenêtre de contexte : ce que chacun rapporte
3. Les questions auxquelles un RAG ne répondra pas, quoi qu’on fasse`,
    },
    en: {
      title: 'RAG without magic: measure before you add',
      summary:
        'Upcoming talk: what chunking, reranking and evaluation actually contribute, with numbers.',
      contentMarkdown: `## Upcoming

Slides will be published here on the day of the conference.`,
    },
  },
  {
    slug: 'ci-qui-ne-ment-pas',
    status: 'draft' as const,
    eventDate: isoDate(75),
    eventName: 'Meetup Craft Toulouse',
    city: 'Toulouse',
    publishedAt: null,
    technologies: ['docker', 'playwright'],
    cover: null,
    links: [],
    fr: {
      title: 'Une CI en laquelle l’équipe a confiance',
      summary:
        'Proposition en cours de rédaction : ce qu’il faut mesurer pour qu’un échec de CI redevienne un signal.',
      contentMarkdown: `## Brouillon

Points à développer :

- Le taux d’échecs instables, la seule métrique qui compte
- Pourquoi relancer un job est un aveu
- Le budget de temps par pull request, et comment le tenir`,
    },
    en: null,
  },
]

export const TIMELINE = [
  {
    fr: {
      period: "2024 — aujourd'hui",
      title: 'Développeur full-stack indépendant',
      place: 'Lyon, France',
    },
    en: {
      period: '2024 — present',
      title: 'Freelance full-stack developer',
      place: 'Lyon, France',
    },
  },
  {
    fr: {
      period: '2021 — 2024',
      title: 'Lead développeur, plateforme SaaS',
      place: 'Nova Systems',
    },
    en: { period: '2021 — 2024', title: 'Lead developer, SaaS platform', place: 'Nova Systems' },
  },
  {
    fr: { period: '2019 — 2021', title: 'Développeur back-end', place: 'Groupe Meridian' },
    en: { period: '2019 — 2021', title: 'Back-end developer', place: 'Meridian Group' },
  },
  {
    fr: { period: '2018 — 2019', title: 'Alternance, équipe infrastructure', place: 'Cortex Labs' },
    en: {
      period: '2018 — 2019',
      title: 'Apprenticeship, infrastructure team',
      place: 'Cortex Labs',
    },
  },
  {
    fr: {
      period: '2016 — 2019',
      title: 'Master informatique, spécialité génie logiciel',
      place: 'Université Lyon 1',
    },
    en: {
      period: '2016 — 2019',
      title: "Master's in computer science, software engineering",
      place: 'Université Lyon 1',
    },
  },
]

export const CONTACT_MESSAGES = [
  {
    name: 'Camille Fournier',
    email: 'camille.fournier@exemple.fr',
    body: 'Bonjour, nous cherchons un renfort de trois mois sur une application AdonisJS existante (migration v6 vers v7). Auriez-vous des disponibilités à partir de septembre ?',
    readAt: null,
    createdAt: daysAgo(1),
  },
  {
    name: 'Thomas Berger',
    email: 't.berger@nova-systems.example',
    body: 'Votre article sur les index partiels nous a fait gagner une semaine de tuning. Merci. Petite question : comment gérez-vous le cas des requêtes avec statut paramétré ?',
    readAt: null,
    createdAt: daysAgo(3),
  },
  {
    name: 'Laura Mendes',
    email: 'laura@studio-halo.example',
    body: 'Nous préparons une refonte de site vitrine avec un back-office bilingue. Le projet Atlas ressemble beaucoup à ce que nous cherchons. Pouvons-nous en discuter ?',
    readAt: daysAgo(4),
    createdAt: daysAgo(9),
  },
  {
    name: 'Julien Ferrand',
    email: 'j.ferrand@exemple.com',
    body: "Bonjour, seriez-vous intéressé par une intervention d'une heure sur le RAG lors de notre meetup de novembre ? Format retour d'expérience, une trentaine de personnes.",
    readAt: daysAgo(15),
    createdAt: daysAgo(21),
  },
  {
    name: 'Sofia Rinaldi',
    email: 'sofia.rinaldi@exemple.eu',
    body: 'Question rapide sur Orbite : les composants sont-ils utilisables avec un routeur autre que celui montré dans la documentation ?',
    readAt: daysAgo(30),
    createdAt: daysAgo(34),
  },
]

export const CV_FR = `## Profil

Développeur full-stack, huit ans d'expérience sur des applications web
de contenu et des plateformes SaaS. Je conçois des systèmes que l'on
peut exploiter à deux, pas seulement construire à dix.

## Expérience

### Développeur indépendant — depuis 2024

Conception et développement d'applications sur mesure : CMS bilingues,
outils internes, intégration de modèles de langage sur données privées.
Accompagnement d'équipes sur la performance back-end et la CI.

### Lead développeur — Nova Systems, 2021 à 2024

Encadrement technique d'une équipe de cinq personnes sur une plateforme
SaaS multi-tenant. Division par sept du temps de réponse au 95e centile,
et passage d'un déploiement mensuel à un déploiement quotidien.

### Développeur back-end — Groupe Meridian, 2019 à 2021

Services de facturation et d'export de données, migration progressive
d'un monolithe PHP vers des services Node.js.

## Compétences

- **Langages** : TypeScript, Python, Go, SQL
- **Back-end** : AdonisJS, PostgreSQL, Redis, conception d'API
- **Front-end** : React, Inertia.js, Tailwind CSS
- **Infrastructure** : Docker, Kubernetes, CI/CD, observabilité

## Formation

Master informatique, spécialité génie logiciel — Université Lyon 1, 2019.

## Langues

Français (langue maternelle), anglais (professionnel courant).
`

export const CV_EN = `## Profile

Full-stack developer with eight years of experience on content-heavy web
applications and SaaS platforms. I design systems that two people can
operate, not just that ten people can build.

## Experience

### Freelance developer — since 2024

Custom application design and development: bilingual CMSes, internal
tools, language-model integration over private data. Consulting on
back-end performance and CI.

### Lead developer — Nova Systems, 2021 to 2024

Technical lead for a team of five on a multi-tenant SaaS platform. Cut
95th-percentile response time by a factor of seven and moved from
monthly to daily deployments.

### Back-end developer — Meridian Group, 2019 to 2021

Billing and data export services, progressive migration from a PHP
monolith to Node.js services.

## Skills

- **Languages**: TypeScript, Python, Go, SQL
- **Back-end**: AdonisJS, PostgreSQL, Redis, API design
- **Front-end**: React, Inertia.js, Tailwind CSS
- **Infrastructure**: Docker, Kubernetes, CI/CD, observability

## Education

MSc in computer science, software engineering — Université Lyon 1, 2019.

## Languages

French (native), English (professional working proficiency).
`
