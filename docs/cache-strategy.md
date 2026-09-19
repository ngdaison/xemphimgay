# Caching Strategy

Caching is essential to meet the 100k CCU target. We use **Redis** and **Nginx Cache**.

## 1. Redis Cache Levels

### A. API Level
- **Content Metadata:** Cache home page, content details, and episode lists.
- **TTL:** 5-15 minutes (Dynamic).
- **Invalidation:** Purge key on admin update or new content publish.

### B. Session Level
- **Auth Tokens:** Store session metadata and refresh token hashes.
- **Rate Limiting:** Track request counts per IP/User.

### C. Logic Level
- **Ranking:** Daily/Weekly/Monthly leaderboards recalculated periodically.
- **Search:** Popular search suggestions.

## 2. Nginx Edge Cache

### A. HLS Manifests (`.m3u8`)
- **TTL:** 2-5 seconds.
- Manifests change rarely but need to be fresh for "Ongoing" content.

### B. Video Segments (`.ts`)
- **TTL:** 1 year.
- Segments are immutable. Once cached, they never expire until the video is deleted.

### C. Images
- **TTL:** 30 days.

## 3. Cache Stampede Protection
- **Stale-While-Revalidate:** Return old data while background refresh is happening.
- **Distributed Locks:** Only one worker node can rebuild a specific cache key at a time.

## 4. Cache Purging
- API provides a `/internal/purge-cache` endpoint for Admin or Workers.
- Supports wildcard purging (e.g., `content:slug:*`).

## 5. Memory Management
- **Eviction Policy:** `allkeys-lru` for metadata, `noeviction` for critical auth data.
- **Compression:** Use Brotli/Gzip for large JSON payloads stored in Redis.
