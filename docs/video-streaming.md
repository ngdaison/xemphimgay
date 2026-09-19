# Video Streaming Implementation

CineStream uses **HLS (HTTP Live Streaming)** as the primary delivery protocol for 4K video.

## 1. Transcoding Pipeline

All uploaded videos must go through the `api/worker` for transcoding.

### FFmpeg Quality Ladder:
- **2160p (4K):** 3840x2160, 15000 kbps
- **1440p (2K):** 2560x1440, 9000 kbps
- **1080p (FHD):** 1920x1080, 5000 kbps
- **720p (HD):** 1280x720, 2500 kbps
- **480p (SD):** 854x480, 1000 kbps
- **360p (LD):** 640x360, 600 kbps

### Encoding Settings:
- **Codec:** H.264 (AVC) for compatibility or H.265 (HEVC) for 4K optimization.
- **Segment Length:** 6 seconds (`-hls_time 6`).
- **Profile:** High.
- **Preset:** medium (production) or fast (dev).

## 2. Playback Architecture

### A. Manifests
- **Master Playlist:** Contains URLs to variant playlists (one for each quality).
- **Variant Playlist:** Contains URLs to the actual `.ts` video segments.

### B. Adaptive Bitrate (ABR)
The frontend player (`HLS.js`) automatically detects the user's bandwidth and switches to the highest possible quality without buffering.

## 3. Storage Structure
```text
media/
  videos/
    {slug}/
      master.m3u8
      360p/
        playlist.m3u8
        segment_001.ts
        ...
      1080p/
        ...
      2160p/
        ...
```

## 4. Protection
- **Signed Manifests:** The master `.m3u8` is protected by a signed URL.
- **Signed Segments:** Individual `.ts` files are validated by Nginx using the token passed in the URI.

## 5. Metadata Track
- **Subtitles:** VTT files served separately or muxed into HLS.
- **Audio Tracks:** Support for multiple languages (e.g., Original, Vietnamese Dub).

## 6. Performance Tips
- **HLS Segment Duration:** 6 seconds is a good balance between player start time and caching efficiency.
- **I-Frame Playlists:** Used for scrubbing/fast-forwarding previews.
