# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

# Toutes les dépendances (build)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Dépendances de production uniquement
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build de l'application (serveur + assets Vite + bundle SSR)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

# Image finale
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- http://127.0.0.1:3333/health || exit 1

# Les migrations sont jouées au démarrage du conteneur
CMD ["sh", "-c", "node ace migration:run --force && node bin/server.js"]
