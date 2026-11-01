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

## 011 — CodeMirror 6 for In-Browser Code Editing

Why: Lightweight, modular, modern editor architecture supporting modular extensions (`@codemirror/lang-html`, `@codemirror/lang-css`), accessible keyboard trap releases, line wrapping, and customizable themes (`oneDark`).

## 012 — iframe `sandbox="allow-scripts"` Without `allow-same-origin`

Why: Strict sandbox separation. Omitting `allow-same-origin` ensures that user code runs under an opaque `null` origin, completely preventing access to the parent application's DOM, cookies, local storage, and session tokens.

## 013 — Content Security Policy (CSP) Injected into `srcDoc`

Why: Prohibits outbound network communication (`connect-src 'none'`), form submission (`form-action 'none'`), and base URI modification (`base-uri 'none'`). Ensures scripts cannot exfiltrate data or initiate requests back to the application origin.

## 014 — LocalStorage for Draft Persistence

Why: Seamless learner experience preserving uncommitted work across page reloads under `uni:draft:<lessonId>`. All accesses are safely wrapped in try/catch to protect against storage quota failures or incognito restrictions.

## 015 — Static AST Parsing over Code Execution

Why: Executing student code or inspecting live preview DOM/styles introduces severe security vulnerabilities, potential infinite loop hangs, race conditions with iframe rendering, and environment mismatches. Parsing HTML and CSS statically as pure data structures ensures zero arbitrary code execution, deterministic evaluation, and identical execution across browser client and server runtime.

## 016 — parse5 and css-tree for Static Parsing

Why: `parse5` is a fast, spec-compliant HTML5 parser that constructs an AST without requiring browser DOM emulation (such as jsdom or DOMParser), allowing universal execution across Node.js server, client components, and Vitest. `css-tree` delivers precise CSS AST parsing, declaration walking, and serialization without running stylesheets.

## 017 — Declarative Rule-Based Challenge Definitions

Why: Expressing challenge criteria as structured, declarative rules (`element-exists`, `element-count`, `text-contains`, `attribute-equals`, `attribute-exists`, `css-property`, `child-of`) provides granular per-requirement feedback to students, clean separation between logic and content, strict schema validation via Zod, and straightforward challenge authoring in JSON.

## 018 — Client-Side Instant Feedback with Planned Phase 4 Server Re-Check

Why: Instant feedback is critical for the learning experience, so the pure static checker runs client-side inside `ChallengePanel` without network round-trip delay. To prevent progress tampering or client spoofing, the same pure checker function will be invoked on the server in Phase 4 prior to writing verified completions to PostgreSQL.

## 019 — Stateless JWT Sessions over Database Sessions

Why: In Phase 5, the application runs multiple Next.js container replicas behind an Nginx load balancer. Database-backed sessions require a database query on every single request or sticky sessions on the load balancer. Stateless, signed and encrypted JWT tokens stored in `httpOnly`, `SameSite=Lax` cookies allow any replica to authenticate incoming requests independently using `AUTH_SECRET`, with zero inter-replica state or shared cache needed.

## 020 — Bcryptjs with Cost Factor 12 and Constant-Time Verification

Why: Cost 12 provides a strong defense against offline brute-force attacks (~250-300ms compute time per hash). To eliminate user enumeration via timing attacks, a constant-time dummy bcrypt verification (`bcrypt.compare(password, DUMMY_HASH)`) is executed whenever an unrecognized email attempts to log in, ensuring identical latency profiles regardless of account existence.

## 021 — PostgreSQL-Backed Atomic Rate Limiting

Why: In-memory rate limiting (e.g. Map or LRU cache) leaks between restarts and is completely bypassed when requests are distributed across multiple independent Next.js replicas. Storing fixed-window counters directly in PostgreSQL using atomic upserts (`INSERT ... ON CONFLICT DO UPDATE`) ensures consistent, globally enforced rate limiting across all instances without requiring an external Redis deployment.

## 022 — Server-Side Static Re-Check on Challenge Submission

Why: Client-side verification provides instant UI feedback to learners, but client requests can be intercepted or spoofed. The `/api/progress` endpoint enforces a mandatory server-side re-evaluation using the same pure Phase 3 `checkSubmission` static analysis engine before persisting a `COMPLETED` record. A submission that fails static check rules is rejected with `422 Unprocessable Content`.

## 023 — Progress Model: Non-Nullable `challengeId`

Why: Every lesson in the curriculum is paired 1:1 with an interactive challenge (`challengeId` is a required field in `Lesson`). Making `challengeId` non-nullable on the `Progress` table ensures data integrity, simplifies unique constraints (`@@unique([userId, challengeId])`), and prevents orphaned or ambiguous progress states.

## 024 — Standalone Next.js Output for Containers

Why: Next.js `output: "standalone"` traces node_modules and dependencies automatically during build time, creating a self-contained `server.js` and bundling only imported packages. This reduces the final container image content size from over 1.2 GB down to 151 MB (well below the 400 MB requirement) and speeds up horizontal replica scaling.

## 025 — Dedicated Migrate Target in Multi-Stage Dockerfile

Why: Bundling the Prisma CLI inside the minimal production `runner` image bloats runtime size and introduces permission issues when running as non-root. Creating an isolated `AS migrate` build target runs `prisma migrate deploy` as a deterministic one-off initialization container that exits with code 0 before app replicas launch.

## 026 — Docker DNS Round-Robin & Seamless Nginx Reload

Why: Docker's embedded DNS server (`127.0.0.11`) resolves the service hostname `app` across all running container replica IPs. By setting `valid=5s` on the Nginx resolver and configuring `proxy_next_upstream`, Nginx automatically distributes traffic round-robin and fails over passively without downtime. Scaling events refresh DNS instantly via `nginx -s reload`.

## 027 — Overwriting `X-Forwarded-For` with `$remote_addr`

Why: Using `$proxy_add_x_forwarded_for` appends the incoming client header, allowing malicious actors to spoof client IP addresses by prepending arbitrary IP chains. By explicitly configuring `proxy_set_header X-Forwarded-For $remote_addr;` at the Nginx reverse proxy perimeter, upstream Next.js replicas can securely trust the client IP for audit logging and DB-backed rate limiting.

## 028 — Two-Layer Defense-in-Depth Rate Limiting

Why: High-frequency denial-of-service and brute-force attacks on auth endpoints are intercepted at the Nginx perimeter (`limit_req_zone` with 10r/m and burst=5) before hitting application workers. Legitimate traffic is further protected inside the application layer via atomic PostgreSQL fixed-window rate limiting, guaranteeing consistent rate limits even across dynamically scaled app replicas.

## 029 — Automated Load Testing via k6

Why: k6 provides scriptable, lightweight JavaScript scenarios capable of running both natively or in ephemeral Docker containers without JVM overhead. It offers granular metrics (avg, med, p95 latencies, throughput, error rates) and automated threshold assertions (`p(95)<800`, `rate<0.01`) ideal for validating cluster performance and multi-replica efficiency.

## 030 — Password Hashing with Asynchronous crypto.scrypt via libuv Threadpool

Why: Synchronous password hashing with `bcryptjs` runs entirely on Node's single-threaded JavaScript event loop. Under concurrent login spikes, CPU starvation from bcrypt caused `/api/health` latencies to skyrocket over 4 seconds. Replacing bcrypt with native `crypto.scrypt` delegates cryptographic computation to libuv worker threads (`UV_THREADPOOL_SIZE=16`), keeping the JavaScript event loop free to serve health probes and I/O in <10ms. Parameters (`N: 16384, r: 8, p: 1, keyLength: 64, saltLength: 16`) are calibrated to ~90ms execution, providing robust offline brute-force resistance while remaining responsive. Legacy bcrypt hashes are transparently verified and upgraded in PostgreSQL upon successful login.

## 031 — Dual Rate Limiting Profiles: Strict vs Demo

Why: Production security requires aggressive per-IP rate limiting (5 registrations/hr/IP, 10 logins/15min) to stop credential stuffing. However, automated stress tools (JMeter, k6, Locust, Apache Bench) used by external examiners originate from a single IP address, triggering 99.7% HTTP 429 rejections in baseline tests. Introducing two explicit profiles (`strict` for production by default, and `demo` for stress benchmarks) decouples capacity evaluation from abuse prevention. Switching requires explicit opt-in via environment variables (`RATE_LIMIT_PROFILE=demo` and `NGINX_CONF=nginx.demo.conf`), preventing security from ever being weakened silently.

## 032 — Nginx Micro-Caching for Static Content and Upstream Connection Pooling

Why: Under 200–300 VU traffic spikes, uncached Next.js static page rendering overwhelmed container CPU limits, producing 502 Bad Gateway and 504 Gateway Timeout errors. Configuring an Nginx edge micro-cache (`proxy_cache page_cache; proxy_cache_valid 200 60s;`) for static routes (`/`, `/lessons`, `/lessons/html-structure`) slashed browse p95 latency from 6.95s to 8.96ms (~775x improvement) and eliminated all 502/504 errors. Configuring upstream `keepalive 64` eliminates TCP socket teardown and handshake overhead during high-concurrency bursts.

## 033 — Playwright E2E and Multi-Stage CI Pipeline

Why: Validating user journeys across multiple container replicas requires real browser interaction. Playwright tests the full happy path against the containerized stack: user registration, credentials authentication, CodeMirror solution entry, client submission, server-side static rule re-verification, and dashboard reflection. GitHub Actions automates linting, strict typechecks, Prettier format verification, Vitest unit coverage, PostgreSQL integration tests, Docker build, Playwright E2E against the container stack, and npm production security audit on every push.

## 034 — react-resizable-panels & lucide-react for Workspace UI

Why: In Phase 7, the lesson experience requires a 3-pane freeCodeCamp-style layout (Instructions/Tests, Code Editor, Sandboxed Preview). Hand-rolling drag handles introduces browser-specific resize bugs, pointer capture glitches, and layout thrashing. `react-resizable-panels` provides accessible, zero-dependency, keyboard-navigable (`Home`, `End`, `Arrow` keys), and flicker-free flexbox resizing with minimum and maximum constraints and persistent panel layouts. `lucide-react` provides lightweight, consistent, stroke-based SVG icons with tree-shaking support for test checklists, navigation, and theme switches without icon font bloat.

## 035 — @axe-core/playwright for Automated Accessibility Auditing

Why: The Phase 7 redesign adopts glass surfaces and subtle gradient backgrounds. To guarantee strict adherence to WCAG 2.1 AA accessibility guidelines (color contrast, aria roles, accessible labels, semantic landmarks), `@axe-core/playwright` automates comprehensive accessibility audits across all major pages (`/`, `/lessons`, `/lessons/[id]`, `/login`, `/register`, `/dashboard`) across both dark and light modes during the E2E test suite.
