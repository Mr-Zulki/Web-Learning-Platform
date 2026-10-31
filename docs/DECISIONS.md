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

## 007 — Zod-Validated JSON Content

Why: Guarantees strict runtime schema validation of all lesson files at load time, failing loudly on corrupt JSON or missing fields with informative error messages while exporting a single source-of-truth TypeScript type.

## 008 — react-markdown & remark-gfm for Lesson Rendering

Why: Provides lightweight, safe, component-level markdown rendering for lesson instructions without requiring dangerous innerHTML injections. Enables custom semantic components for typography and code blocks.

## 009 — Vitest for Unit and Component Testing

Why: Fast, modern test runner with native Vite/ESM support, jsdom environment for React Testing Library component tests, and integrated v8 coverage reports.

## 010 — Static Site Generation (`generateStaticParams`) for Lessons

Why: All lesson content is static JSON known at build time. Generating static HTML eliminates database or filesystem overhead at request time and ensures instant page transitions.
