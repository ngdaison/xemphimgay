FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY api/package.json ./api/package.json
COPY api/worker/package.json ./api/worker/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY api ./api

RUN pnpm --filter @webtruyenphim/database db:generate && pnpm --filter worker build

CMD ["pnpm", "--filter", "worker", "start:prod"]
