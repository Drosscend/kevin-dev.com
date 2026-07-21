# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

# All dependencies (build stage)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Production dependencies only
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Application build (server + Vite assets + SSR bundle)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

# Final image
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0
ENV DRIVE_DISK=fs
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./
# Uploads directory, mounted as a persistent volume in Dokploy
RUN mkdir -p storage/media && chown -R node:node /app/storage
USER node
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- http://127.0.0.1:3333/health || exit 1

# Migrations run on container start, before the HTTP server
CMD ["sh", "-c", "node ace migration:run --force && node bin/server.js"]
