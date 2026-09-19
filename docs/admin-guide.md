# Admin Guide

This guide provides instructions for administrators managing the CineStream platform.

## 1. Content Management

### A. Adding a Movie
1. Go to **Admin > Movies > Add New**.
2. Upload Poster and Background.
3. Fill in metadata (Title, Slug, Genres).
4. Upload the raw video file.
5. The system will automatically queue a **Transcoding Job**.
6. Once completed, the movie will be available for publishing.

### B. Managing Anime
- Anime is organized by **Anime -> Seasons -> Episodes**.
- You can upload multiple episodes at once using the batch uploader.

### C. Managing Manga
- Upload a ZIP of images or individual files for each chapter.
- The worker will convert them to WebP/AVIF and optimize for web.

## 2. User & Moderation

- **Banning Users:** You can ban users from the Admin Panel, which revokes all their active sessions.
- **Moderating Comments:** Review reported comments in **Admin > Reports**.

## 3. System Settings

- **Site Config:** Update Logo, Site Name, and SEO settings.
- **Banner/Slider:** Manage the hero slider on the home page.

## 4. Monitoring Dashboard

The Admin Panel includes a real-time monitoring view:
- **CCU Count:** Online users.
- **Bandwidth:** Real-time throughput (Gbps).
- **Transcode Queue:** Pending jobs status.
- **Server Health:** CPU/RAM per node.

## 5. Security Actions

- **Revoke All Sessions:** In case of a suspected breach.
- **Rotate Signing Keys:** For Signed URLs and JWTs.
