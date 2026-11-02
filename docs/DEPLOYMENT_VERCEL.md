# Vercel Deployment Guide

This guide walks through deploying this project to Vercel with Neon Serverless Postgres and NextAuth.

---

## 1. Push Code to GitHub

Ensure your latest changes are committed and pushed to your GitHub repository:

```bash
git checkout master
git add .
git commit -m "vercel: deploy readiness"
git push origin master
```

---

## 2. Neon Database Connection Strings

Neon provides two distinct connection strings:
- **Pooled Connection (`DATABASE_URL`)**: Uses PgBouncer (`-pooler` subdomain). This is designed for serverless functions to handle many short-lived connections without exhausting Postgres connection limits.
- **Direct Connection (`DIRECT_URL`)**: Connects directly to the compute endpoint (without `-pooler`). Required by Prisma for schema migrations and advisory locks (`npx prisma migrate`).

---

## 3. Apply Database Migrations Locally

Before or alongside deploying to Vercel, apply pending database migrations to your remote Neon database from your local machine using the **direct unpooled** connection string:

```bash
# Set both DATABASE_URL and DIRECT_URL to your unpooled/direct Neon connection string
DATABASE_URL="postgresql://<user>:<password>@<ep-direct>.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
DIRECT_URL="postgresql://<user>:<password>@<ep-direct>.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
npx prisma migrate deploy
```

*(On Windows PowerShell, set `$env:DATABASE_URL` and `$env:DIRECT_URL` prior to running `npx prisma migrate deploy`).*

---

## 4. Vercel Environment Variables

In your Vercel Project Settings under **Settings > Environment Variables**, configure the following variables for **Production** and **Preview**:

| Variable Name | Description / Recommended Value |
| :--- | :--- |
| `DATABASE_URL` | Neon pooled connection string with `pgbouncer=true` (required for Prisma prepared statements through PgBouncer) and pool tuning: `postgresql://<user>:<password>@<endpoint>-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1&pool_timeout=10` |
| `DIRECT_URL` | Neon unpooled / direct connection string: `postgresql://<user>:<password>@<endpoint>.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32+ character random string (generated via `openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | Canonical URL of your application (e.g. `https://your-app.vercel.app` or custom domain) |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL (e.g. `https://your-app.vercel.app` or custom domain) |

---

## 5. Custom Domain Configuration (Optional)

1. In the Vercel Dashboard, go to **Settings > Domains**.
2. Add your custom domain (e.g., `app.yourdomain.com`).
3. Configure the DNS records at your DNS registrar:
   - For an apex domain: `A` record pointing to `76.76.21.21`.
   - For a subdomain: `CNAME` record pointing to `cname.vercel-dns.com`.
4. Once DNS propagates and SSL is provisioned by Vercel, update `AUTH_URL` and `NEXT_PUBLIC_APP_URL` in your environment variables to match your custom domain.

---

## 6. Post-Deploy Smoke Checklist

After deployment completes on Vercel, verify:
- [ ] **Liveness**: Visit `/api/health` — returns `{ "status": "ok", ... }` with HTTP 200.
- [ ] **Readiness & DB Connectivity**: Visit `/api/ready` — executes `SELECT 1` against Neon and returns `{ "status": "ready" }` with HTTP 200.
- [ ] **User Registration**: Register a new user on `/register` — user record created in Neon and session token issued.
- [ ] **User Authentication**: Log in on `/login` with credentials — successful redirect to `/dashboard`.
- [ ] **Progress Persistence**: Complete or start a lesson/challenge — progress record correctly persisted in `progress` table.
- [ ] **User Logout**: Log out from the application — session cleared and redirected to `/login`.

