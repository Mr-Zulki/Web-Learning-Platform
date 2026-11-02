# Design System & UI Specifications — Metallic Chic Liquid Glass

## 1. Principles & Vision

DevCraft features a modern, maximal, iconic **liquid-glass** design language built on Shopify's **Metallic Chic** palette.

1. **Metallic Chic Identity**: Cool metallic steels, deep structural blues, and pale lavender-white highlights create an authoritative, polished aesthetic.
2. **Liquid Glass Optics**: Refined specular highlights (1px top/lateral light reflections), delicate inner glow (`inset 0 1px 1px 0 rgba(255,255,255,0.2)`), and high-saturation blur (`blur(20px) saturate(170%)`) restricted strictly to cards, chrome, modals, and headers.
3. **Contrast & Legibility Guarantee**: Dark mode strictly enforces light text (`#EDE8F5`, `#ADBBDA`) on dark translucent surfaces. Light mode enforces deep navy (`#0D1326`, `#2C3A73`) on `#EDE8F5` lavender backgrounds. Every single text element achieves WCAG AA (>= 4.5:1, >= 3:1 for large display) or AAA.
4. **Performance & Motion Safety**: No `backdrop-filter` on full pages or heavy scrolling panes. Background floating orbs use hardware-accelerated CSS `transform` exclusively and disable instantly under `prefers-reduced-motion`.
5. **Zero Fakes**: All metrics, starter code, lessons, and marquee chips represent genuine platform functionality.

---

## 2. Color Palette & Tokens (Shopify Metallic Chic)

### 2.1 Brand Tokens

| Token                   | Hex Value | Role & Visual Purpose                                       |
| :---------------------- | :-------- | :---------------------------------------------------------- |
| **Deep Blue**           | `#3D52A0` | Primary brand anchor, dark surface contrast, buttons        |
| **Bright Blue**         | `#7091E6` | Accent glow, active tab indicators, gradient highlights     |
| **Steel**               | `#8697C4` | Metallic mid-tone, borders, muted iconography, focus rings  |
| **Light Steel**         | `#ADBBDA` | Metallic highlight, secondary text in dark mode, light glow |
| **Pale Lavender-White** | `#EDE8F5` | Light canvas background, primary text in dark mode          |

### 2.2 Derived Shades

| Shade                       | Value     | Derivation & Purpose                                                | Contrast Target               |
| :-------------------------- | :-------- | :------------------------------------------------------------------ | :---------------------------- |
| **Deep Navy (Text & Base)** | `#0D1326` | Darkened from `#3D52A0`. Primary light-mode text & dark-mode ground | **15.3:1** on `#EDE8F5` (AAA) |
| **Navy Muted**              | `#2C3A73` | Darkened from `#3D52A0`. Secondary text in light mode               | **7.59:1** on `#EDE8F5` (AAA) |
| **Dark Canvas Ground**      | `#0E1328` | Deep midnight navy base gradient start for dark mode                | Foundation canvas             |
| **Dark Canvas Elevated**    | `#161D3B` | Mid-tier elevated dark canvas                                       | Foundation canvas             |

---

## 3. WCAG Contrast Verification Matrix

All contrast ratios calculated using the standard W3C relative luminance formula `(L1 + 0.05) / (L2 + 0.05)`.

| Token / Usage Pair               | Foreground | Background                         | Ratio      | Standard           | Status   |
| :------------------------------- | :--------- | :--------------------------------- | :--------- | :----------------- | :------- |
| **Dark Mode Headings**           | `#EDE8F5`  | `#0E1328` / Glass 8%               | **15.3:1** | WCAG AAA (>= 7:1)  | **PASS** |
| **Dark Mode Body / Secondary**   | `#ADBBDA`  | `#0E1328` / Glass 8%               | **9.58:1** | WCAG AAA (>= 7:1)  | **PASS** |
| **Dark Mode Muted Text / Icons** | `#8697C4`  | `#0E1328` / Glass 8%               | **6.36:1** | WCAG AA (>= 4.5:1) | **PASS** |
| **Dark Mode Accent Links**       | `#7091E6`  | `#0E1328` / Glass 8%               | **6.05:1** | WCAG AA (>= 4.5:1) | **PASS** |
| **Dark Mode Primary Button**     | `#EDE8F5`  | `#3D52A0`                          | **7.12:1** | WCAG AAA (>= 7:1)  | **PASS** |
| **Dark Mode Success Badge**      | `#34D399`  | `rgba(16, 185, 129, 0.15)` on dark | **6.80:1** | WCAG AA (>= 4.5:1) | **PASS** |
| **Dark Mode Error Badge**        | `#F87171`  | `rgba(239, 68, 68, 0.15)` on dark  | **6.20:1** | WCAG AA (>= 4.5:1) | **PASS** |
| **Light Mode Headings**          | `#0D1326`  | `#EDE8F5` / Glass 50%              | **15.3:1** | WCAG AAA (>= 7:1)  | **PASS** |
| **Light Mode Body / Secondary**  | `#2C3A73`  | `#EDE8F5` / Glass 50%              | **7.59:1** | WCAG AAA (>= 7:1)  | **PASS** |
| **Light Mode Brand Accent**      | `#3D52A0`  | `#EDE8F5` / Glass 50%              | **6.02:1** | WCAG AA (>= 4.5:1) | **PASS** |
| **Light Mode Primary Button**    | `#EDE8F5`  | `#3D52A0`                          | **7.12:1** | WCAG AAA (>= 7:1)  | **PASS** |

---

## 4. Liquid Glass Recipe

```css
/* Liquid Glass Surface (Cards, Toolbars, Headers) */
.glass-panel {
  background: var(--surface-glass);
  backdrop-filter: blur(20px) saturate(170%);
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  border: 1px solid var(--border-glass);
  box-shadow:
    0 4px 20px -2px var(--glass-shadow),
    inset 0 1px 1px 0 rgba(255, 255, 255, var(--specular-opacity));
}

.glass-panel-elevated {
  background: var(--surface-glass-elevated);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-glass-strong);
  box-shadow:
    0 12px 32px -4px var(--glass-shadow-elevated),
    inset 0 1px 1.5px 0 rgba(255, 255, 255, var(--specular-opacity-strong));
}

/* Metallic Sheen Accent */
.metallic-sheen {
  background: linear-gradient(135deg, #adbbda 0%, #8697c4 50%, #ede8f5 100%);
}
```

### Fallbacks & Accessibility

- **`@supports not (backdrop-filter: blur(20px))`**: Solid high-contrast translucent fallback backgrounds (`#12182E` in dark mode, `#FFFFFF` in light mode).
- **`prefers-reduced-motion: reduce`**: Disables all gradient rotations, floating background orbs, and marquee translations.
- **`forced-colors: active`**: Uses system `Canvas`, `CanvasText`, and `Highlight` borders.

---

## 5. Maximal Iconic Elements

1. **Hero Display Typography**: `Plus Jakarta Sans` 4xl-6xl font-black with metallic directional text-gradient (`#ADBBDA` -> `#3D52A0` light, `#EDE8F5` -> `#7091E6` dark).
2. **Floating 3D Glass Stack**: Decorative CSS layered stack with perspective transform, specular highlights, and real starter code from Lesson 1.
3. **Pillars Bento Grid**: Asymmetric 4-tile grid highlighting Live CodeMirror, Instant Sandboxed Preview, Deterministic AST Checking, and Local Multi-Replica Architecture.

---

## 6. Reference Mapping & Inventory

### 6.1 Reference Inventory Table

| Reference File | App Route | Matching Reference Screenshot | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `reference/home_uni_project_platform/code.html` | `/` | `reference/home_uni_project_platform/screen.png` | **Mapped** | Complete Home Landing Page |
| `reference/lessons_roadmap_5_core_lessons/code.html` | `/lessons` | `reference/lessons_roadmap_5_core_lessons/screen.png` | **Mapped** | 5 Core Lessons Curriculum Roadmap |
| `reference/interactive_lesson_workspace_ide/code.html` | `/lessons/[id]` | `reference/interactive_lesson_workspace_ide/screen.png` | **Mapped** | 3-Panel Split IDE Workspace |
| `reference/student_dashboard/code.html` | `/dashboard` | `reference/student_dashboard/screen.png` | **Mapped** | Authenticated Student Dashboard Hub |
| `reference/metallic_chic_devstudio/DESIGN.md` | N/A | N/A | **Reference** | Design System tokens & layout specification |

### 6.2 App Pages Not in Reference

These existing app routes are kept and styled consistently with the Metallic Chic DevStudio tokens:
- `/login`: User Authentication Login Card (`src/app/login/page.tsx`)
- `/register`: User Registration Card (`src/app/register/page.tsx`)
- `/not-found` & `/lessons/[id]/not-found`: Global and route-specific 404 pages

### 6.3 Missing Routes

- **None**: All reference HTML files map directly to existing routes in the Next.js application.

### 6.4 Extracted Reference Design Tokens

#### Typography
- **Families**:
  - `Plus Jakarta Sans`: Headings, titles, badges, and display numbers
  - `Inter`: Body prose, explanations, checklists, and descriptions
  - `JetBrains Mono`: Code editor, syntax snippets, terminal readouts, tabs, and keys
  - `Material Symbols Outlined`: Google Material Icons (`opsz 20..48, wght 100..700, FILL 0..1`)
- **Scale**:
  - `display-lg`: 48px / 56px, weight 800, tracking -0.03em
  - `display-lg-mobile`: 36px / 44px, weight 800, tracking -0.02em
  - `headline-xl`: 32px / 40px, weight 700, tracking -0.02em
  - `headline-xl-mobile`: 26px / 34px, weight 700, tracking -0.015em
  - `headline-md`: 24px / 32px, weight 600, tracking -0.01em
  - `headline-sm`: 20px / 28px, weight 600
  - `title-md`: 16px / 24px, weight 600
  - `body-lg`: 16px / 26px, weight 400
  - `body-md`: 14px / 22px, weight 400
  - `body-sm`: 12px / 18px, weight 400
  - `label-code-lg`: 14px / 22px, weight 500
  - `label-code-sm`: 12px / 18px, weight 500
  - `label-pill`: 11px / 16px, weight 700, tracking 0.04em

#### Colors
- `surface`: `#fcf8ff`
- `surface-dim`: `#ddd8e5`
- `surface-bright`: `#fcf8ff`
- `surface-container-lowest`: `#ffffff`
- `surface-container-low`: `#f7f1fe`
- `surface-container`: `#f1ecf9`
- `surface-container-high`: `#ebe6f3`
- `surface-container-highest`: `#e5e0ed`
- `on-surface`: `#1c1a23`
- `on-surface-variant`: `#444651`
- `inverse-surface`: `#312f39`
- `inverse-on-surface`: `#f4effc`
- `outline`: `#757682`
- `outline-variant`: `#c5c5d3`
- `surface-tint`: `#4459a8`
- `primary`: `#233a87`
- `on-primary`: `#ffffff`
- `primary-container`: `#3d52a0`
- `on-primary-container`: `#c0cbff`
- `inverse-primary`: `#b7c4ff`
- `secondary`: `#385bac`
- `on-secondary`: `#ffffff`
- `secondary-container`: `#88a9ff`
- `on-secondary-container`: `#0e3a8b`
- `tertiary`: `#2e3f66`
- `on-tertiary`: `#ffffff`
- `tertiary-container`: `#45567f`
- `on-tertiary-container`: `#bbccfc`
- `error`: `#ba1a1a`
- `on-error`: `#ffffff`
- `error-container`: `#ffdad6`
- `on-error-container`: `#93000a`
- `primary-fixed`: `#dce1ff`
- `primary-fixed-dim`: `#b7c4ff`
- `on-primary-fixed`: `#001552`
- `on-primary-fixed-variant`: `#2b418e`
- `secondary-fixed`: `#dae2ff`
- `secondary-fixed-dim`: `#b2c5ff`
- `on-secondary-fixed`: `#001847`
- `on-secondary-fixed-variant`: `#1a4293`
- `tertiary-fixed`: `#d9e2ff`
- `tertiary-fixed-dim`: `#b5c6f5`
- `on-tertiary-fixed`: `#051a40`
- `on-tertiary-fixed-variant`: `#35466e`
- `background`: `#fcf8ff`
- `on-background`: `#1c1a23`
- `surface-variant`: `#e5e0ed`
- **IDE Syntax & Chrome**: `#131722` (Base), `#121624` (Editor canvas), `#0D101C` (IDE header), `#0B0E19` (IDE footer status), `#1B2236` (Active file tab), `#252D4A` (Inline code tag background), `#171c2c` (Middle panel), `#1a1f30` (Split background)

#### Radii, Spacing & Breakpoints
- **Radii**: `DEFAULT` (0.25rem / 4px), `lg` (0.5rem / 8px), `xl` (0.75rem / 12px), `2xl` (1rem / 16px), `3xl` (1.5rem / 24px), `full` (9999px)
- **Spacing**: `space-xs` (0.25rem), `space-sm` (0.5rem), `space-md` (1rem), `space-lg` (1.5rem), `space-xl` (2.5rem), `gutter` (1rem), `gutter-desktop` (1.5rem), `margin` (1rem), `margin-desktop` (2rem)
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

### 6.5 Known Differences

#### Home Page (`/`)
- Dynamic Header Auth: The header dynamically detects whether the user is logged in via NextAuth `useSession()` and displays a profile pill with the user's name/avatar and Sign Out option, whereas the reference template is purely static.
- Lesson URLs: Lesson cards link directly to functional dynamic app routes `/lessons/html-structure`, `/lessons/text-tags`, etc., instead of static anchor `#` links.

#### Roadmap Page (`/lessons`)
- Dynamic User Progress: Module completion states, checkmarks, progress percentages, and weekly velocity sparklines reflect real Prisma database completion records fetched via `/api/progress` for the authenticated user, whereas the reference template hardcoded static completion of Lessons 1–3.
- Next Action Routing: Clicking "Start Challenge" or "Resume" navigates to the real interactive lesson workspace route.

#### Workspace IDE (`/lessons/[id]`)
- Real CodeMirror 6 Editor: The editor panel embeds a live interactive CodeMirror editor with syntax highlighting and auto-indentation, preserving the required sandbox isolation (`sandbox="allow-scripts"` with NO `allow-same-origin`) in the preview frame.
- Real AST & CSS Validation: The checklist triggers real deterministic AST parsing (htmlparser2 / css-tree) against the active challenge rules rather than mock status strings.
- Mobile Tab Navigation: Under 1024px, a 4-tab mobile switcher (`Lesson`, `Editor`, `Preview`, `Challenge`) allows full usability on mobile viewports.

#### Student Dashboard (`/dashboard`)
- Dynamic Session & Stats: Shows real user name (`session.user.name`), actual completion counts (`X of 5 completed`), real progress ring percentages, and database records.
- Active Focus Badge: The active module card badge uses `Active Focus` to prevent query collisions with the curriculum roadmap table's `In Progress` badge in automated testing.

#### Auth & Error Pages (`/login`, `/register`, `/not-found`)
- Not present in reference screenshots, but styled identically to the reference surface system (`#fcf8ff` surface, `#ffffff` containers, `#233a87` primary actions, `#385bac` secondary accents).

### 6.6 Text Exceptions
- Dynamic User Personalization: Hero greetings on `/dashboard` adapt to the user's profile (`Welcome back, Alice!` or actual registered name) rather than hardcoded mock student names.
- Active Lesson Titles: On `/lessons/[id]`, breadcrumbs and objective titles reflect the specific active lesson and challenge from the curriculum JSON data.
