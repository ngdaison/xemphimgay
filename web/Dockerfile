FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY web/package.json ./web/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY web ./web

RUN pnpm --filter web build

EXPOSE 3001

CMD ["pnpm", "--filter", "web", "start"]
