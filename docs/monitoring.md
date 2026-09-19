# Monitoring & Logging

CineStream uses an open-source observability stack to maintain 100k CCU stability.

## 1. Metrics (Prometheus + Grafana)

We track:
- **API (NestJS):** Request latency (p95), RPS, Error rate (5xx), Connection pool status.
- **Worker:** Job processing time, Success/Failure rate, Queue backlog size.
- **Database (PostgreSQL):** Active connections, Slow queries, Disk I/O.
- **Redis:** Hit/Miss ratio, Memory usage, Eviction count.
- **Infrastructure:** CPU, RAM, Network Bandwidth (per node).
- **Nginx:** Connection count, Requests per second, Cache Hit ratio.

## 2. Logging (Loki / ELK)

- **Structured Logs:** All logs are in JSON format.
- **Levels:** `ERROR`, `WARN`, `INFO`, `DEBUG`.
- **Trace ID:** Every request has a unique `requestId` carried through API, Worker, and Logs.

## 3. Distributed Tracing (OpenTelemetry) - *Optional*
Used for debugging performance bottlenecks across services.

## 4. Health Checks
- `/health`: Liveness probe for Docker/K8s.
- `/health/ready`: Readiness probe (checks DB/Redis connectivity).

## 5. Alerts
- **High CPU/RAM:** Critical.
- **Queue Backlog > 1000:** Warning.
- **Bandwidth usage > 90%:** Urgent.
- **Database Connection Failure:** Critical.

## 6. Dashboards
- **Executive:** Users, CCU, Views, Revenue (if applicable).
- **Operations:** Service health, Error rates, Bandwidth logs.
- **Developer:** Slow queries, worker logs, cache performance.
