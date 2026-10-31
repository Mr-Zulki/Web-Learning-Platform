# Deployment Guide & Production Architecture

This document describes the multi-container production deployment of the HTML/CSS interactive learning platform using Docker, Docker Compose, Next.js standalone servers, PostgreSQL 16, and Nginx reverse proxy load balancing.

---

## 1. Prerequisites

- **Docker Desktop** (version 24+ LTS, with WSL 2 on Windows or Linux daemon)
- **Docker Compose** (v2.20+)
- **Node.js** (>= 20 LTS) & **npm** (for local CLI scripts)
- Available host port: `8080` (Nginx reverse proxy entrypoint)

---

## 2. Environment Configuration

The production stack uses `.env.docker` (gitignored). A documented template is provided at `.env.docker.example`.

### Setup:

```bash
# Copy template to active configuration
cp .env.docker.example .env.docker
```

Key environment variables:

| Variable            | Description                                    | Example / Default                              |
| :------------------ | :--------------------------------------------- | :--------------------------------------------- |
| `POSTGRES_USER`     | PostgreSQL superuser username                  | `postgres`                                     |
| `POSTGRES_PASSWORD` | PostgreSQL secure password                     | Strong passphrase                              |
| `POSTGRES_DB`       | Production database name                       | `uni_prod`                                     |
| `DATABASE_URL`      | Internal connection URL for app replicas       | `postgresql://...:5432/uni_prod?schema=public` |
| `AUTH_SECRET`       | 32+ character key for JWT session encryption   | Random 32+ hex/base64 string                   |
| `AUTH_URL`          | Public base URL as seen by browser             | `http://localhost:8080`                        |
| `NEXTAUTH_URL`      | Legacy compatibility alias for NextAuth        | `http://localhost:8080`                        |
| `APP_REPLICAS`      | Default scale count for app container replicas | `2`                                            |

---

## 3. Operational Commands

All common lifecycle commands are codified as npm scripts:

| Command                    | Action                                                                                                                                |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run docker:up`        | Builds images and starts PostgreSQL, runs database migration, spins up 2 app replicas, and launches Nginx on `http://localhost:8080`. |
| `npm run docker:down`      | Stops and removes all containers, networks, and ephemeral mounts.                                                                     |
| `npm run docker:logs`      | Follows consolidated logs across all services.                                                                                        |
| `npm run docker:scale <N>` | Scales the Next.js app replicas to `N` instances without restarting the database.                                                     |
| `npm run lb:check`         | Fires 40 automated requests to `/api/health`, tracks `X-Served-By`, and verifies round-robin balance across instances.                |
| `npm run lb:failover`      | Simulates replica failure by stopping one instance and asserting zero-downtime passive failover.                                      |

---

## 4. Step-by-Step Load Balancing Demo (Teacher / Viva Evaluation)

Follow these steps to demonstrate horizontal scalability, reverse proxy routing, and fault tolerance:

### Step 1: Start Full Cluster

```powershell
npm run docker:up
```

Verify all services are healthy:

```powershell
docker compose --env-file .env.docker ps
```

Observe:

- `uni-project-db-1`: PostgreSQL 16 (internal only, healthy)
- `uni-project-migrate-1`: Completed migration deploy (exited 0)
- `uni-project-app-1`, `uni-project-app-2`: Next.js 16 standalone (healthy)
- `uni-project-nginx-1`: Nginx reverse proxy listening on `0.0.0.0:8080`

### Step 2: Verify Traffic Distribution across 2 Replicas

Run the automated verification script:

```powershell
npm run lb:check
```

**Recorded Output (2 Replicas):**

```
--- Load Balancing Distribution Summary ---

Instance ID  Requests Percentage
-----------  -------- ----------
88eb565152a8       20 50.0%
e6b3eb5d202f       20 50.0%

Failed Requests: 0
Unique instances detected: 2
Load balancing check PASSED: Traffic successfully distributed across 2 instances.
```

### Step 3: Dynamic Horizontal Scaling (Scale to 3 Replicas)

Scale up live without taking down the cluster:

```powershell
docker compose --env-file .env.docker up -d --scale app=3 --no-recreate
docker compose --env-file .env.docker exec -T nginx nginx -s reload
```

Verify traffic distribution across all 3 replicas:

```powershell
npm run lb:check
```

**Recorded Output (3 Replicas):**

```
--- Load Balancing Distribution Summary ---

Instance ID  Requests Percentage
-----------  -------- ----------
f163a546c909       13 32.5%
d9fa1c4ca304       14 35.0%
a2a5dd5c4002       13 32.5%

Failed Requests: 0
Unique instances detected: 3
Load balancing check PASSED: Traffic successfully distributed across 3 instances.
```

### Step 4: Passive Failover & Zero Downtime Verification

Demonstrate Nginx `proxy_next_upstream` behavior when an app replica abruptly crashes:

```powershell
npm run lb:failover
```

What this does:

1. Detects running app containers.
2. Stops one active replica with `docker stop`.
3. Sends continuous requests for 20 seconds.
4. Restarts the stopped replica.
5. Verifies 100% 2xx responses with 0 failed requests.

**Recorded Output:**

```
--- Failover Test Summary ---
Total Requests Sent: 39
Successful 2xx Responses: 39
Failed / Non-2xx Responses: 0
Active Responding Instances: f163a546c909, a2a5dd5c4002
Zero downtime during replica failure! Passive failover via proxy_next_upstream succeeded.
```

### Step 5: Stateless Multi-Replica Session & Progress Check

Show that user authentication and challenge submissions remain completely coherent regardless of which replica handles any individual request:

1. Register user `user@example.com` on replica A.
2. Authenticate session cookie on replica B.
3. Submit challenge completion to `/api/progress` on replica C.
4. Retrieve user dashboard progress across multiple round-robin requests.

All requests read and write state directly to PostgreSQL via Prisma, guaranteeing zero in-memory session pinning.

---

## 5. k6 Smoke Load Testing & Performance Benchmarks

The automated k6 smoke load test ramps up to 50 concurrent virtual users over 30 seconds hitting the home page, lessons catalog, lesson detail, and healthcheck.

### Command:

```powershell
Get-Content tests/load/smoke.js -Raw | docker run --rm -i --network uni-project_internal_net -e TARGET_URL=http://nginx:80 grafana/k6 run -
```

### Comparative Benchmark: 1 Replica vs. 3 Replicas

| Benchmark Metric          | 1 App Replica    | 3 App Replicas       | Delta / Impact                   |
| :------------------------ | :--------------- | :------------------- | :------------------------------- |
| **Total HTTP Requests**   | 2,408 reqs       | **3,280 reqs**       | **+36.2% total capacity**        |
| **Throughput (req/s)**    | 78.98 req/s      | **107.52 req/s**     | **+36.1% request throughput**    |
| **Completed Iterations**  | 602 iterations   | **820 iterations**   | **+36.2% simulated user flows**  |
| **Average Latency (avg)** | 201.02 ms        | **109.33 ms**        | **45.6% latency reduction**      |
| **Median Latency (med)**  | 145.70 ms        | **33.82 ms**         | **76.8% latency reduction**      |
| **95th Percentile (p95)** | 590.70 ms        | **374.64 ms**        | **36.6% lower tail latency**     |
| **Error Rate**            | 0.00% (0 errors) | **0.00% (0 errors)** | **100% success rate under load** |

---

## 6. Security & Container Hardening

1. **Non-Root Execution**:
   - The application container runs as user `nextjs` (UID: 1001, GID: 1001).
   - Confirmed via: `docker compose exec app id`.
2. **Read-Only Root Filesystem**:
   - App containers run with `read_only: true` and write-restricted tmpfs mounts (`/tmp`, `/app/.next/cache`).
3. **Zero Secrets in Docker Images**:
   - Multi-stage build isolates dependencies and source code.
   - Built images do not contain `.env` files or hardcoded credentials. Verified via `docker history uni-project-app`.
4. **Client IP Spoofing Prevention**:
   - Nginx overwrites `X-Forwarded-For` with `$remote_addr`. User-supplied IP headers are strictly discarded.
5. **Private Database Isolation**:
   - PostgreSQL 16 does not expose port 5432 to the host network in production; it is reachable only over Docker internal network `internal_net`.

---

## 7. Troubleshooting Guide

### Issue 1: Nginx routes to old IP after scaling or container restart

- **Cause**: Nginx caches DNS responses based on its internal resolver ttl.
- **Fix**: Run `docker compose --env-file .env.docker exec -T nginx nginx -s reload` to refresh DNS upstream resolution without downtime.

### Issue 2: Docker Engine connection error on Windows

- **Cause**: Docker Desktop background service (`com.docker.backend.exe`) is paused or WSL is restarting.
- **Fix**: Launch Docker Desktop from the Start menu or execute `Start-Process "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe"`.

### Issue 3: Port 8080 already in use

- **Cause**: Another service or test server is bound to port 8080.
- **Fix**: Identify the process using `Get-NetTCPConnection -LocalPort 8080` and stop it, or customize the port binding in `docker-compose.yml`.
