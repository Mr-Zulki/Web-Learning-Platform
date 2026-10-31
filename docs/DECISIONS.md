# Decisions (ADR)

## 001 — Next.js + TypeScript

Why: full-stack ek repo, SSR, API routes, Vercel deploy easy.

## 002 — PostgreSQL + Prisma

Why: relational data (users, progress), type-safe queries.

## 003 — Docker Compose + Nginx for LB demo

Why: teacher ko local load balancing dikhani ha. Vercel par Nginx nahi chalta.

## 004 — Lessons as JSON

Why: content DB ki zarurat nahi, easy to edit aur version control.

## 005 — Prettier + ESLint Configuration

Why: Consistent code formatting and automated linting across the codebase. Uses Prettier with `prettier-plugin-tailwindcss` for class ordering and `eslint-config-prettier` to eliminate rule collisions.

## 006 — Strict TypeScript Compiler Options

Why: Enabled `strict: true`, `noUncheckedIndexedAccess: true`, and `noImplicitOverride: true` in tsconfig.json to catch missing properties, undefined array indexing, and inheritance errors at compile time before runtime.
