# Xemphimgay

Xemphimgay is a full-stack entertainment platform for streaming movies, watching anime, reading manga, and reading text stories. It is designed as a self-hosted system with a separated API, frontend application, background worker, and shared internal packages.

The codebase is organized as a TypeScript monorepo so the web app, backend services, validation logic, database schema, and shared types can evolve together while still keeping clear boundaries between each part of the system.

## Features

- Movie and anime content pages
- Manga and story reading flows
- Video playback support
- User-facing pages for browsing, search, history, notifications, profile, and settings
- Admin pages for managing users, content, movies, manga, stories, and system settings
- Shared validation and database packages for consistent backend and frontend behavior
- Background worker foundation for queue-based media and processing jobs

## Project Structure

```text
.
|-- api/              # Backend API built with NestJS
|   `-- worker/       # Queue worker for background and media jobs
|-- web/              # Frontend application built with Next.js
|-- packages/         # Shared database, validation, config, and utility packages
|-- docs/             # Technical documentation
|-- docker-compose.yml
|-- package.json
`-- pnpm-workspace.yaml
```

## Architecture Overview

The platform is split into three main runtime areas:

- `web` serves the user interface and admin dashboard.
- `api` exposes backend endpoints for content, users, authentication, media, history, search, and interactions.
- `api/worker` handles long-running or background tasks through queues.

Shared packages live under `packages/` and are used to keep schemas, types, configuration, and database access consistent across the application.

## Main Modules

- `api`: REST API, authentication, content management, search, history, media, and user features.
- `api/worker`: background queue processing for media-related tasks.
- `web`: user interface, admin pages, content browsing, readers, and video playback.
- `packages/database`: Prisma schema, Prisma Client exports, and seed logic.
- `packages/validation`: shared validation schemas.
- `packages/shared`: shared types, constants, and DTOs.

## Technology

- Frontend: Next.js, React, Tailwind CSS
- Backend: NestJS, Fastify, Prisma
- Database: PostgreSQL
- Queue and cache: Redis, BullMQ
- Media processing: FFmpeg
- Workspace: pnpm, Turborepo

## Repository Notes

- The root workspace manages `api`, `api/worker`, `web`, and all shared packages.
- Prisma schema and database-related code live in `packages/database`.
- Frontend source code lives in `web/src`.
- Backend source code lives in `api/src`.
- Worker source code lives in `api/worker/src`.
- Runtime files, local environment files, dependency folders, and build output are intentionally ignored by Git.

## Documentation

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)
- [Performance](docs/performance.md)
- [Video Streaming](docs/video-streaming.md)

## Status

This repository contains the application source code, shared packages, database schema, Docker Compose configuration, and technical documentation for the Xemphimgay platform.
