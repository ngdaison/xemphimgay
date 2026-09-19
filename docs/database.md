# Database Design & Optimization

CineStream uses **PostgreSQL** with **Prisma ORM** for its primary data store.

## 1. Schema Overview

The database is divided into several logical modules:
- **Core:** Users, Roles, Permissions, Auth.
- **Content:** Generic Content metadata (Movies, Anime, Story, Manga).
- **Media:** Video episodes, Sources, Manga pages.
- **Interactions:** Comments, Ratings, Favorites, Follows.
- **Tracking:** Watch History, Read History, Views.
- **Ops:** Settings, Banners, Logs.

## 2. Relationships

- **One-to-One:** `Content` <-> `Movie`, `Content` <-> `Anime`, etc. (Table-per-type pattern).
- **One-to-Many:** `Anime` -> `Episodes`, `Story` -> `Chapters`.
- **Many-to-Many:** `Content` <-> `Genres`, `Content` <-> `Tags`.

## 3. Indexing Strategy

Critical indexes for performance:
- **Slug (Unique):** For fast content lookup.
- **Status + PublishedAt:** For listing pages (e.g., "Latest Published").
- **UserId + ContentId:** For interaction checks (Like, Favorite).
- **Composite Index:** `(contentType, status, viewCount)` for ranking lists.

## 4. Scaling for 100k CCU

### A. View Tracking
Updating `viewCount` on every request is a performance killer.
- **Solution:** View events are pushed to **Redis** (buffered).
- **Flush:** A background worker (api/worker) flushes counts in batches every minute.

### B. Read-Write Splitting
- **Primary:** Handles all writes (Admin actions, new comments).
- **Read Replicas:** Handle all content listing and detail queries.

### C. Large Tables
- `WatchHistory` and `ReadHistory` can grow to millions of rows.
- **Solution:** Use **PostgreSQL Partitioning** by `userId` hash if necessary.

## 5. Soft Deletes
- Critical tables like `User`, `Content`, `Comment` use a `deletedAt` field.
- Prisma middleware or extension is used to automatically filter out deleted records.

## 6. Migration Policy
- All changes must be made via `prisma migrate dev`.
- Migrations are committed to version control.
- `prisma db seed` is used for essential data (Roles, Genres).
