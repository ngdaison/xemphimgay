# Backup & Restore Strategy

Ensuring data durability is critical for a production entertainment platform.

## 1. Database (PostgreSQL)

### A. Automated Backups
- **Daily:** Full dump using `pg_dump`.
- **Retention:** Keep daily backups for 7 days, weekly for 1 month, monthly for 1 year.
```bash
docker exec cinestream-db pg_dump -U admin webtruyenphim > backup_$(date +%F).sql
```

### B. Point-in-Time Recovery (PITR)
- Enable WAL (Write Ahead Logging) archiving to allow recovery to any specific second.

## 2. Media Files

### A. Original Assets
- Original raw videos and posters are the most valuable assets.
- **Sync:** Use `rclone` or `rsync` to mirror the `media/` directory to a secondary off-site server or cold storage.

### B. Transcoded Segments
- HLS segments are reproducible. In a disaster, they can be re-transcoded from original files.
- Backup of `media/videos/hls/` is optional if bandwidth is a concern, but recommended for fast recovery.

## 3. Configuration & Secrets

- **Back up `.env` files** and any custom Nginx/Docker configurations to a secure, encrypted storage (Vault or encrypted S3 bucket).

## 4. Restore Procedure

### A. Restore Database
```bash
cat backup.sql | docker exec -i cinestream-db psql -U admin webtruyenphim
```

### B. Restore Media
```bash
rsync -avz user@backup-server:/path/to/media/ /local/media/
```

## 5. Disaster Recovery Plan

1. **Service Interruption:** If a server fails, the Nginx load balancer redirects traffic to healthy nodes.
2. **Data Loss:** Restore the latest DB backup and sync media files.
3. **Recovery Time Objective (RTO):** Target < 4 hours for full platform restoration.
