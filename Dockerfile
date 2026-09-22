# syntax=docker/dockerfile:1

# ---- Stage 1: build ---------------------------------------------------
# Installs deps and builds the static bundle. VITE_* build args are baked
# into the JS bundle at build time (Vite has no server-side runtime env),
# so the image must be rebuilt whenever one of these values changes.
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY postcss.config.js tailwind.config.js components.json ./
COPY index.html ./
COPY public ./public
COPY apis ./apis
COPY src ./src

ARG VITE_MIXZI_API_BASE
ARG VITE_APP_MODE
ARG VITE_APP_MOCKED_VALUES
ARG VITE_MIXZI_AUTH_BASE
ENV VITE_MIXZI_API_BASE=${VITE_MIXZI_API_BASE} \
    VITE_APP_MODE=${VITE_APP_MODE} \
    VITE_APP_MOCKED_VALUES=${VITE_APP_MOCKED_VALUES} \
    VITE_MIXZI_AUTH_BASE=${VITE_MIXZI_AUTH_BASE}

RUN npm run build

# ---- Stage 2: runtime ---------------------------------------------------
# Static files served by nginx. SPA fallback so client-side routes
# (react-router) resolve on refresh/direct hit.
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
