# Media Storage & Organization

CineStream follows a strict directory structure for managing multi-terabyte media libraries.

## 1. Directory Structure

```text
media/
├── uploads/            # Temporary incoming files
├── tmp/                # Working directory for FFmpeg
├── videos/             # Transcoded HLS video files
│   ├── original/       # Archive of raw high-quality uploads
│   └── hls/            # Playable segments organized by slug
├── manga/              # Manga page images
├── stories/            # Story assets (covers)
├── posters/            # Content posters
├── backgrounds/        # Content hero backgrounds
└── thumbnails/         # Episode/Chapter previews
```

## 2. Storage Strategy

### A. Local Storage (Initial)
Directly attached NVMe/SATA SSDs.

### B. Scaled Storage (Advanced)
- **Object Storage (Self-Hosted):** MinIO or OpenStack Swift.
- **NAS/SAN:** High-performance shared storage for origin servers.

## 3. Image Optimization
- **WebP/AVIF:** Preferred formats for all UI assets and Manga pages.
- **Resizing:** Automatic resizing on upload to generate Thumbnails, Small, and Large versions.

## 4. Video Archive
- **Originals:** We keep the highest quality source file in `videos/original/` for future re-transcoding (e.g., when adding AV1 support).

## 5. Security & Isolation
- The `media/` directory is **NOT** directly exposed by NestJS.
- It is served exclusively by **Nginx** nodes.
- Access to certain folders (e.g., `original/`) is strictly forbidden for public users.

## 6. Cleanup
- `media/tmp/` is cleared periodically by `api/worker`.
- Failed uploads are automatically purged.
