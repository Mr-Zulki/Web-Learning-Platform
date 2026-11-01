# Load and Stress Testing Guide

This guide is designed for external examiners, performance engineers, and evaluators to stress-test the containerized HTML/CSS Learning Platform (`http://localhost:8080`).

---

## 1. Quick Start

Ensure the full Docker stack is running:

```powershell
# For normal production testing with strict abuse protection:
npm run docker:strict

# For unconstrained throughput and stress benchmarks (Examiner Mode):
npm run docker:demo
```

Verify service readiness before testing:

```bash
curl http://localhost:8080/api/health
# {"status":"ok","timestamp":"..."}

curl http://localhost:8080/api/ready
# {"status":"ready","database":"connected","timestamp":"..."}
```

---

## 2. Rate Limiting Profiles: Strict vs Demo

The platform includes two distinct traffic governance profiles. Because real-world automated testing tools run from a **single IP address**, strict security profiles will naturally throttle high-volume synthetic tests.

| Dimension               | Strict Profile (Default / Prod)                                | Demo Profile (Examiner Mode)                                   |
| ----------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Purpose**             | Production security, credential stuffing & brute-force defense | Synthetic load testing, capacity benchmarking, stress analysis |
| **Nginx Ingress Limit** | `10 req/s` (burst 20)                                          | `200 req/s` (burst 300)                                        |
| **Registration Rate**   | `5 / hour / IP`                                                | `1000 / hour / IP`                                             |
| **Login Rate**          | `10 / 15 min / IP & Email`                                     | `3000 / 15 min / IP & Email`                                   |
| **Progress Writes**     | `60 / min / user`                                              | `600 / min / user`                                             |
| **Expected on Stress**  | HTTP 429 Too Many Requests (by design)                         | Linear scaling, sub-100ms static response times                |

### How to Switch Profiles

```powershell
# Switch to Demo Mode (reloads Nginx and scales app instances)
npm run docker:demo

# Switch back to Strict Mode
npm run docker:strict
```

Or manually via environment variables:

```powershell
$env:RATE_LIMIT_PROFILE="demo"
$env:NGINX_CONF="nginx.demo.conf"
docker compose --env-file .env.docker up -d --build
```

---

## 3. Seed Pre-Existing Users for High-Volume Tests

To test concurrent logins and progress updates without bottlenecking on initial registration:

```bash
npm run db:seed:loadtest
```

This quickly provisions **200 pre-hashed test accounts** directly into PostgreSQL:

- Emails: `loaduser_1@example.com` through `loaduser_200@example.com`
- Password: `Password123!`

---

## 4. Ready-to-Run Load Scenarios

### A. Apache Bench (ab) — Fast Baseline Check

Test edge proxy caching and static page throughput:

```bash
# 1,000 requests, 50 concurrent connections to cached landing page
ab -n 1000 -c 50 http://localhost:8080/

# 1,000 requests, 50 concurrent connections to lesson curriculum
ab -n 1000 -c 50 http://localhost:8080/lessons/html-structure
```

### B. k6 (Containerized — No Local Install Required)

Run k6 test suites directly through Docker:

```powershell
# Browse scenario (200 Virtual Users, static + lesson routes)
docker run --rm -i --network=host grafana/k6 run - < tests/load/browse.js

# Auth scenario (50 Virtual Users, registration + credentials login)
docker run --rm -i --network=host grafana/k6 run - < tests/load/auth.js

# Progress scenario (30 Virtual Users, repeated code submissions)
docker run --rm -i --network=host grafana/k6 run - < tests/load/progress.js

# Mixed workload (80 Virtual Users, 70% browse, 20% login, 10% progress)
docker run --rm -i --network=host grafana/k6 run - < tests/load/mixed.js

# Sudden Traffic Spike (0 to 300 Virtual Users in 5s)
docker run --rm -i --network=host grafana/k6 run - < tests/load/spike.js
```

Or use the automated PowerShell runner that records live container metrics:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-load-test.ps1 -Scenario browse -VUs 200 -Duration "30s"
```

### C. Locust (Python)

If using Locust for interactive load generation:

```bash
pip install locust
locust -f tests/load/locust/locustfile.py --headless -u 50 -r 10 -t 1m --host http://localhost:8080
```

---

## 5. What to Look For in Results

1. **Static Throughput & Caching**:
   - Routes like `/`, `/lessons`, and `/lessons/html-structure` are cached by Nginx proxy (`X-Cache-Status: HIT`).
   - Expected latency: `p95 < 50ms` even under 200+ concurrent VUs.
2. **Auth & Asynchronous Scrypt**:
   - Password hashing uses non-blocking `crypto.scrypt` (libuv threadpool).
   - `/api/health` responsiveness remains sub-20ms during heavy login bursts.
3. **Database Connection Stability**:
   - Replicas are tuned with `connection_limit=10` per instance.
   - Total active Postgres connections will not exceed 45 across 4 replicas, well below the `max_connections=150` ceiling.
4. **HTTP Status Codes**:
   - `200 OK`: Successful response or cache hit.
   - `429 Too Many Requests`: Triggered when exceeding rate limits (expected in Strict profile).
   - `502 / 504`: Upstream errors. In Demo mode, this should be **0%** across standard scenarios.

---

## 6. Live Observability Tools

Run the live terminal dashboard in a separate PowerShell window during tests:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/stack-watch.ps1
```

This displays:

- CPU and memory consumption per container (`db`, `app-1`, `app-2`, `nginx`).
- Real-time active connection counts from `pg_stat_activity`.
- Health endpoint probe latencies.

---

## 7. Troubleshooting

| Symptom                          | Cause                                              | Solution                                                 |
| -------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Many `429 Too Many Requests`     | Stack is in `strict` mode with single-IP test tool | Run `npm run docker:demo` to apply relaxed limits        |
| `502 Bad Gateway`                | App replicas overwhelmed or restarting             | Check `docker compose logs app` for uncaught errors      |
| `Connection refused`             | Docker stack is down or starting up                | Check `docker compose ps` and verify ports 8080 and 5432 |
| Auth errors during progress test | Test accounts not present                          | Run `npm run db:seed:loadtest`                           |
