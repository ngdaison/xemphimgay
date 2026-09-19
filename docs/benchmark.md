# Benchmarking & Load Testing

To validate the 100,000 CCU goal, we perform rigorous load tests using **k6** and **autocannon**.

## 1. Test Tools
- **k6:** For scenario-based testing (API, Auth, Reading).
- **autocannon:** For high-RPS endpoint hammering.
- **wrk:** For static file serving performance (Nginx).

## 2. Test Scenarios

### A. API Home Page (JSON)
- **Goal:** 5,000 RPS with < 100ms latency.
- **Cache:** Redis enabled.

### B. Story Reading (Text)
- **Goal:** 50,000 CCU simulation.
- **Metrics:** Page load time, DB query time for chapters.

### C. Video Signed URL Generation
- **Goal:** Ensure signing logic doesn't bottleneck the API during high traffic.

## 3. Benchmark Reports

Reports are stored in the `benchmarks/` directory.

### Example k6 Script (`benchmarks/k6-api-home.js`):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 500 },  // scale to 500 users
    { duration: '3m', target: 5000 }, // scale to 5000 users
    { duration: '1m', target: 0 },    // scale down
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/v1/home');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

## 4. Pass Criteria
1. **p95 Latency:** < 200ms for all public APIs.
2. **Error Rate:** < 0.1% under peak load.
3. **Memory Leak:** No significant RSS growth over 24-hour soak test.

## 5. Load Test Command
```bash
pnpm --filter @webtruyenphim/benchmarks test:home
```
