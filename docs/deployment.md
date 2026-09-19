# Deployment Guide

CineStream is designed to be deployed using **Docker** and **Docker Compose** on self-hosted Linux servers.

## 1. Production Hardware Requirements

To support 100k CCU, you need a cluster of servers:
- **API Server:** 16+ Cores, 32GB+ RAM.
- **Worker Cluster:** High CPU (AMD EPYC/Threadripper) for transcoding.
- **Database:** High-speed NVMe, 64GB+ RAM.
- **Edge Nodes:** High bandwidth (10Gbps+ NICs), NVMe for caching.

## 2. Infrastructure Setup

### A. OS Tuning
Apply the settings in `docs/server-tuning.md` to all nodes.

### B. Directory Permissions
Ensure the `media/` directory is writable by the Docker user.
```bash
mkdir -p media/{uploads,videos/hls,manga,posters,backgrounds,thumbnails}
chmod -R 755 media
chown -R 1000:1000 media
```

## 3. Deployment Steps

### 1. Clone & Configure
```bash
git clone ...
cp .env.example .env
# Edit .env with production credentials
```

### 2. Build Images
```bash
docker-compose build --pull
```

### 3. Initialize Database
```bash
docker-compose run --rm api npx prisma migrate deploy
docker-compose run --rm api npx prisma db seed
```

### 4. Start Services
```bash
docker-compose up -d
```

## 4. Multi-Node Deployment (Swarm / K8s)

For 750Gbps traffic, Docker Compose on a single machine is not enough.
1. **API & Worker:** Use **Kubernetes** or **Docker Swarm** to scale containers across multiple CPU-heavy nodes.
2. **Media Delivery:** Deploy **Nginx Edge Nodes** independently as a distributed cluster.
3. **Storage:** Use a high-performance distributed storage system like **MinIO** or **Ceph**.

## 5. Reverse Proxy & SSL
Use a dedicated Nginx or HAProxy instance to handle SSL termination (Let's Encrypt) and load balance traffic to the API and Frontend containers.

## 6. Continuous Integration (CI)
- Use GitHub Actions or GitLab CI to build and push images to a private registry.
- Use `docker stack deploy` or `kubectl apply` for zero-downtime updates.
