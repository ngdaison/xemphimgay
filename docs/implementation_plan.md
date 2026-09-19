# Implementation Plan - CineStream Completion

This plan outlines the steps to complete the CineStream Entertainment Platform according to the high-performance and "production-ready" requirements.

## 1. Backend Extensions (api)
Add missing modules and features to the NestJS API:
- [ ] **Search Module**: Implement PostgreSQL Full-Text Search with sign-normalization for Vietnamese.
- [ ] **Interaction Module**: Centralize Comment, Rating, Favorite, Follow, and Like logic.
- [ ] **History Module**: Detailed tracking for watch (video) and read (manga/story) progress.
- [ ] **Notification Module**: In-app notification system with BullMQ integration.
- [ ] **Monitoring & Analytics**: Implement view tracking (Redis-buffered), bandwidth logging, and audit logs.
- [ ] **Security Enhancements**: MFA (TOTP) setup, Passkey registration/login flow, and security event logging.
- [ ] **Media Signing**: Implement Signed URL generation for Nginx `secure_link` module compatibility.

## 2. Worker Enhancements (api/worker)
- [ ] **Image Processor**: Convert uploaded images to WebP/AVIF and generate thumbnails.
- [ ] **Resumable Upload Support**: Integration for large video files.
- [ ] **Cleanup Job**: Automated removal of temporary files and orphaned media.

## 3. Frontend Refinement (web)
- [ ] **Auth Pages**: Login, Register, MFA, and Passkey management.
- [ ] **Manga Reader**: Implementation of vertical and page-by-page reading modes with preloading.
- [ ] **Story Reader**: Text customization (font, size, background) and scroll progress tracking.
- [ ] **Admin Dashboard**: Full CRUD for all content types, monitoring charts, and job management.
- [ ] **SEO Optimization**: Proper meta tags, JSON-LD, and sitemap generation.

## 4. Infrastructure & DevOps
- [ ] **Dockerization**: Refine Dockerfiles for production (multi-stage builds).
- [ ] **Monitoring Stack**: Prometheus and Grafana configuration for system-wide observability.
- [ ] **Benchmark Suite**: k6 scripts for home page, video manifest, and reading APIs.
- [ ] **Documentation**: Complete all required `.md` files in the `docs/` folder.

## 5. Implementation Strategy
1. **Database Update**: Apply any missing indexes or tables via Prisma.
2. **Shared Package**: Update shared types and validation schemas.
3. **API Implementation**: Sequential development of missing modules.
4. **Worker Tasks**: Implementation of background processing logic.
5. **UI Assembly**: Building the frontend pages and admin dashboard.
6. **Final Polish**: Performance tuning, linting, and build verification.

> [!NOTE]
> All developments will follow the strict rule of NOT using 3rd party services (Firebase, AWS, etc.).
