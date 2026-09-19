# Linux Server Tuning for High Performance

To serve 100,000 concurrent users and 750 Gbps of video traffic, the underlying Linux OS must be tuned.

## 1. System Limits (`/etc/security/limits.conf`)
Increase the number of open files and process limits.
```text
* soft nofile 1048576
* hard nofile 1048576
* soft nproc 65535
* hard nproc 65535
```

## 2. Kernel Tuning (`/etc/sysctl.conf`)
Optimize the network stack for high-throughput and low-latency.
```bash
# Network backlog
net.core.netdev_max_backlog = 65536
net.core.somaxconn = 65535

# TCP Memory
net.ipv4.tcp_mem = 4096 87380 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# Connection reuse
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# Ports
net.ipv4.ip_local_port_range = 1024 65535

# Max trackable connections
net.nf_conntrack_max = 2000000
```
Apply with `sysctl -p`.

## 3. Reverse Proxy Tuning
```nginx
worker_processes auto;
worker_rlimit_nofile 1048576;

events {
    worker_connections 100000;
    use epoll;
    multi_accept on;
}
```

## 4. Disk I/O
- Use `deadline` or `noop` scheduler for NVMe drives.
- Mount media partitions with `noatime` to reduce write overhead.

## 5. Node.js Production
- Use `NODE_ENV=production`.
- Set `--max-old-space-size` to ~75-80% of total RAM.
- Use a process manager (like PM2 or Docker restart policies).

## 6. PostgreSQL Optimization
- `max_connections`: ~1000 (with PgBouncer).
- `shared_buffers`: 25% of RAM.
- `effective_cache_size`: 75% of RAM.
- `work_mem`: Increased for complex queries.
