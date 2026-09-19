# Performance Strategy & Calculations

This document outlines the technical requirements and calculations for CineStream to support **100,000 Concurrent Users (CCU)**.

## 1. CCU Distribution
- **Video Streaming (4K/HD):** 50,000 users
- **Reading (Manga/Stories):** 50,000 users

## 2. Bandwidth Calculations (Video)

The biggest bottleneck for 50,000 concurrent 4K viewers is **Bandwidth**.

### Average Bitrate Assumptions:
- **4K (2160p):** 15 - 25 Mbps (Target: 15 Mbps for optimized HLS)
- **1080p:** 4 - 6 Mbps
- **720p:** 2 - 3 Mbps

### Total Bandwidth for 50,000 4K Viewers:
`Required Bandwidth = CCU * Average Bitrate`

`50,000 * 15 Mbps = 750,000 Mbps = 750 Gbps`

> [!IMPORTANT]
> To serve 750 Gbps, we cannot use a single server. We need a **Multi-Edge Self-Hosted CDN** architecture.

### Multi-Edge Scaling:
Depending on the network interface cards (NIC) available on our servers:
- **10 Gbps Servers:** Needs ~80-100 edge nodes (accounting for overhead).
- **25 Gbps Servers:** Needs ~35-40 edge nodes.
- **40 Gbps Servers:** Needs ~20-25 edge nodes.
- **100 Gbps Servers:** Needs ~8-10 edge nodes.

## 3. Bandwidth Calculations (Reading)

Reading services are mostly text and images (WebP/AVIF).

- **Average Page Load:** 500 KB - 1 MB (Manga pages)
- **Average Reading Speed:** 1 page every 10-20 seconds.
- **Estimated Bitrate per user:** ~0.5 Mbps.

`50,000 * 0.5 Mbps = 25,000 Mbps = 25 Gbps`

Total bandwidth for reading is significantly lower but still requires optimization (Nginx caching).

## 4. Total Infrastructure Requirement
- **Total Bandwidth:** ~775 Gbps peak.
- **API Requests (NestJS):** 100,000 users generating ~1,000 - 5,000 requests per second (RPS) depending on interaction frequency.
- **Database (PostgreSQL):** Needs optimized indexing and read replicas to handle high metadata query volume.

## 5. Optimization Strategies

### A. Media Serving (Nginx)
- **Zero-Copy (sendfile):** Enable `sendfile on` and `tcp_nopush on` to minimize CPU usage during file transfers.
- **AIO Threads:** Use `aio threads` for non-blocking disk I/O.
- **Open File Cache:** Cache file descriptors for HLS segments.
- **No Compression for Media:** Disable gzip/brotli for `.ts` segments (they are already compressed).

### B. Caching (Redis)
- **Metadata Cache:** All content info, chapters, and episode lists must be in Redis.
- **Cache Stampede Prevention:** Use distributed locks or random TTL jitter.
- **Hot Content Promotion:** Cache popular HLS manifest files (`.m3u8`) in RAM on edge nodes.

### C. Database (PostgreSQL)
- **Index Optimization:** Composite indexes for ranking and filtering.
- **Batching:** View counts are buffered in Redis and flushed in batches to avoid DB locks.
- **Read Replicas:** Scale reads across multiple PostgreSQL instances.

### D. Frontend (Next.js)
- **ISR (Incremental Static Regeneration):** For popular content detail pages.
- **Lazy Loading:** For all images and non-critical components.
- **HLS.js Optimization:** Proper buffer management to prevent unnecessary segment fetching.

## 6. Real-world Limits
- **750 Gbps** is an massive amount of traffic. In a real production environment, this requires multiple data centers or high-bandwidth peering.
- **Disk I/O:** 4K video segments require high-speed NVMe drives on edge nodes to prevent I/O wait.
- **CPU:** FFmpeg transcoding is highly CPU intensive; we use a dedicated **Transcoding Cluster** (api/worker).
