# Self-Hosted CDN Architecture

To serve 50,000 concurrent 4K viewers (750 Gbps), a standard single-server setup is insufficient. We implement a **Self-Hosted Multi-Edge CDN**.

## 1. Logic Flow
1. **User requests content** via `web`.
2. **Frontend calls `api`** to get a `manifest.m3u8` URL.
3. **API generates a Signed URL** pointing to a specific **Media Edge Node**.
4. **Client fetches segments** from the Edge Node.

## 2. Component Breakdown

### A. Origin Media Server
- **Role:** Master storage.
- **Content:** Raw uploads and full HLS segment folders.
- **Security:** Only accessible by Edge Nodes or internal Workers.

### B. Media Edge Nodes (Nginx)
- **Role:** Traffic delivery.
- **Strategy:**
  - **Pull Cache:** Edge node requests segments from Origin only on the first request (cache miss).
  - **Local SSD Cache:** Popular segments are kept on fast NVMe drives.
  - **Signed URL Validation:** Uses Nginx `secure_link` module to prevent hotlinking.
- **Tuning:**
  ```nginx
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  aio threads;
  directio 512;
  open_file_cache max=10000 inactive=30s;
  ```

## 3. Anti-Hotlink Strategy
- **Tokenized URLs:** Every HLS segment request must include a `token` and `expires` timestamp.
- **IP Binding:** (Optional) Tokens can be bound to the user's IP address.
- **Referer Check:** Nginx validates the `Referer` header to ensure requests come from `cinestream.com`.

## 4. Bandwidth Load Balancing
- The `api` service acts as a **Global Load Balancer**.
- It tracks Edge Node health and bandwidth usage.
- When a user starts a video, the API selects the "best" Edge Node (nearest or least loaded) and returns its specific URL.

## 5. Storage Hierarchy
- **Level 1 (RAM):** Frequently accessed `.m3u8` manifest files.
- **Level 2 (NVMe):** Hot segments (`.ts`) on Edge nodes.
- **Level 3 (SATA SSD/HDD):** Cold storage on Origin nodes.

## 6. Global Scale (Planned)
- Multiple regions (North, Central, South Vietnam) each with its own Edge Cluster to minimize latency.
