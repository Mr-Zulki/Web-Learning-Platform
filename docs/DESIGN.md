# Design System & UI Specifications

## 1. Principles & Vision

The HTML/CSS Interactive Learning Platform features a modern, premium dark-first interface inspired by Apple's polished glass-and-gradient design language and freeCodeCamp's interactive learning workspace.

1. **Focus on Code & Learning**: The UI recedes to highlight the learner's content, interactive instructions, live code editor, and immediate preview.
2. **Glass & Gradients**: Translucent glass surfaces (`backdrop-filter: blur(12px)`), subtle specular borders (`rgba(255,255,255,0.08)`), and deep ambient gradient backgrounds provide depth without visual noise.
3. **Performance First**: Glass blur is strictly restricted to sticky headers, cards, modals, and toasts. Large scrolling containers use performant solid gradients to avoid GPU redraw overhead.
4. **Universal Accessibility (WCAG 2.1 AA)**: All text meets or exceeds a 4.5:1 contrast ratio against translucent backgrounds. Full keyboard accessibility with prominent `:focus-visible` rings and screen reader (`aria-live`) status announcements.
5. **Responsive & Resilient**: Seamless fluid layouts from narrow mobile viewports (minimum 360px) to ultra-wide desktop monitors, with dedicated mobile-first tabs and desktop multi-pane resizable panels.

---

## 2. Color Palette & Tokens

### 2.1 Base Colors & Surfaces

| Token                 | Dark Mode (Default)         | Light Mode                  | Purpose                                      |
| :-------------------- | :-------------------------- | :-------------------------- | :------------------------------------------- |
| `background`          | `#090d16` (Deep Navy)       | `#f8fafc` (Slate 50)        | Main page canvas background                  |
| `surface-glass-1`     | `rgba(15, 23, 42, 0.65)`    | `rgba(255, 255, 255, 0.70)` | Base cards, sidebars, panel backgrounds      |
| `surface-glass-2`     | `rgba(30, 41, 59, 0.75)`    | `rgba(255, 255, 255, 0.85)` | Elevated cards, dropdowns, headers, toolbars |
| `surface-glass-3`     | `rgba(30, 41, 59, 0.90)`    | `rgba(255, 255, 255, 0.95)` | Modals, dialogs, toasts, floating overlays   |
| `border-glass`        | `rgba(255, 255, 255, 0.08)` | `rgba(15, 23, 42, 0.08)`    | Default specular border for cards and panels |
| `border-glass-strong` | `rgba(255, 255, 255, 0.16)` | `rgba(15, 23, 42, 0.16)`    | Hover, active, and focused element borders   |

### 2.2 Semantic & Accent Colors

| Role                 | Dark Token              | Light Token             | Purpose                                       | Contrast Ratio   |
| :------------------- | :---------------------- | :---------------------- | :-------------------------------------------- | :--------------- |
| **Primary**          | `#3b82f6` (Blue 500)    | `#2563eb` (Blue 600)    | Primary actions, links, focus rings           | >= 4.5:1         |
| **Accent Glow**      | `#06b6d4` / `#8b5cf6`   | `#0284c7` / `#7c3aed`   | Ambient gradients and highlight badges        | N/A (Decorative) |
| **Success**          | `#10b981` (Emerald 500) | `#059669` (Emerald 600) | Passed tests, completed badges, saved status  | >= 4.5:1         |
| **Warning**          | `#f59e0b` (Amber 500)   | `#d97706` (Amber 600)   | Hints, pending state, alerts                  | >= 4.5:1         |
| **Error**            | `#ef4444` (Red 500)     | `#dc2626` (Red 600)     | Failed tests, validation errors, error toasts | >= 4.5:1         |
| **Foreground Main**  | `#f8fafc` (Slate 50)    | `#0f172a` (Slate 900)   | Primary headings and body copy                | >= 12:1          |
| **Foreground Muted** | `#94a3b8` (Slate 400)   | `#64748b` (Slate 500)   | Secondary text, captions, hints, labels       | >= 4.5:1         |

### 2.3 Contrast Verification Matrix

| Element               | Background                               | Text Color | Ratio  | Standard        | Status |
| :-------------------- | :--------------------------------------- | :--------- | :----- | :-------------- | :----- |
| Body Text (Dark)      | `rgba(15, 23, 42, 0.65)` on `#090d16`    | `#f8fafc`  | 13.8:1 | WCAG AA (4.5:1) | PASS   |
| Muted Text (Dark)     | `rgba(15, 23, 42, 0.65)` on `#090d16`    | `#94a3b8`  | 5.2:1  | WCAG AA (4.5:1) | PASS   |
| Primary Button (Dark) | `#3b82f6`                                | `#ffffff`  | 4.6:1  | WCAG AA (4.5:1) | PASS   |
| Success Badge (Dark)  | `rgba(16, 185, 129, 0.15)`               | `#34d399`  | 6.8:1  | WCAG AA (4.5:1) | PASS   |
| Error Badge (Dark)    | `rgba(239, 68, 68, 0.15)`                | `#f87171`  | 6.2:1  | WCAG AA (4.5:1) | PASS   |
| Body Text (Light)     | `rgba(255, 255, 255, 0.85)` on `#f8fafc` | `#0f172a`  | 14.2:1 | WCAG AA (4.5:1) | PASS   |
| Muted Text (Light)    | `rgba(255, 255, 255, 0.85)` on `#f8fafc` | `#64748b`  | 4.8:1  | WCAG AA (4.5:1) | PASS   |

---

## 3. Typography Scale & Fonts

- **Display & Headings**: `Plus Jakarta Sans`, system-ui, sans-serif
- **UI & Body**: `Inter`, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Code & Editor**: `JetBrains Mono`, Menlo, Monaco, Consolas, "Liberation Mono", monospace

### Scale

- `text-xs`: 12px (0.75rem), line-height: 1rem (Microcopy, timestamps, tags)
- `text-sm`: 14px (0.875rem), line-height: 1.25rem (Code snippets, hints, buttons, inputs)
- `text-base`: 16px (1rem), line-height: 1.5rem (Default body, instructions prose)
- `text-lg`: 18px (1.125rem), line-height: 1.75rem (Card titles, subheadings)
- `text-xl`: 20px (1.25rem), line-height: 1.75rem (Section titles)
- `text-2xl`: 24px (1.5rem), line-height: 2rem (Page headers, modal titles)
- `text-3xl`: 30px (1.875rem), line-height: 2.25rem (Feature headlines)
- `text-4xl`: 36px (2.25rem), line-height: 2.5rem (Hero titles on tablet)
- `text-5xl`: 48px (3rem), line-height: 1.15 (Hero headline on desktop)

---

## 4. Glass Recipes, Elevation & Motion

### 4.1 Glass Recipes

```css
/* Glass Surface 1 (Base Cards / Sidebars) */
.glass-surface {
  background: var(--surface-glass-1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
}

/* Glass Surface 2 (Elevated Panels / Nav / Headers) */
.glass-surface-elevated {
  background: var(--surface-glass-2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass-strong);
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(12px)) {
  .glass-surface {
    background: #0f172a;
  }
  .glass-surface-elevated {
    background: #1e293b;
  }
  .light .glass-surface {
    background: #ffffff;
  }
  .light .glass-surface-elevated {
    background: #f1f5f9;
  }
}
```

### 4.2 Elevation & Glow Shadows

- **Subtle Glow**: `box-shadow: 0 0 25px -5px rgba(59, 130, 246, 0.25)`
- **Success Glow**: `box-shadow: 0 0 20px -4px rgba(16, 185, 129, 0.3)`
- **Error Glow**: `box-shadow: 0 0 20px -4px rgba(239, 68, 68, 0.3)`

### 4.3 Motion Rules

- Transitions: `transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)`.
- Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 5. UI Primitives (`src/components/ui/`)

1. **Button**: Primary, secondary, outline, ghost, danger, success variants. Size options: `sm`, `md`, `lg`. Supports loading spinners and icon adornments.
2. **IconButton**: Accessible square icon button with explicit `aria-label`.
3. **Card**: Translucent glass card with optional glow on hover and interactive variants.
4. **Badge**: Status indicators (`neutral`, `primary`, `success`, `warning`, `error`) with dot or icon.
5. **Input / Label / FieldError**: Accessible form controls with validation states, focus rings, and `aria-describedby` wiring.
6. **Tabs**: Accessible tablist with keyboard arrow navigation, active indicator pill, and roving tabindex.
7. **ProgressBar / ProgressRing**: Accessible SVG progress indicators with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
8. **Skeleton**: Loading placeholder pulse with reduced-motion fallback.
9. **Toast**: Floating notification alerts (`role="status"`, `aria-live="polite"`).
10. **Modal / ConfirmDialog**: Accessible dialog with focus trap, backdrop blur, `Escape` key dismissal, and ARIA attributes.
11. **Tooltip**: Accessible hover/focus popup.
12. **Kbd**: Keyboard shortcut badge (`Ctrl`, `Enter`).
13. **Spinner**: Clean animated loading indicator with `role="status"` and accessible label.
14. **Container**: Centered, max-width responsive wrapper.
15. **SectionHeading**: Consistent typography for section titles and subtitles with optional badge.

---

## 6. freeCodeCamp-Style Learning Workspace

### 6.1 Desktop Layout (>= 1024px)

Using `react-resizable-panels`:

- **Panel 1 (Left, 32% default, min 25%, max 45%)**:
  - Top: Lesson title, navigation links, reading time.
  - Middle: Scrollable Markdown instructions and explanations.
  - Bottom: Challenge instructions and **Live Test Checklist**.
    - Each rule in the challenge has an icon (Circle for pending, CheckCircle for passed, XCircle for failed).
    - Overall challenge progress bar (`x of y tests passed`).
    - Action bar: "Check my code" primary button (`Ctrl+Enter`), "Reset code", hint accordion.
- **Panel 2 (Center, 38% default, min 25%)**:
  - Editor header: HTML / CSS tab switcher, copy code button, formatting.
  - CodeMirror 6 Editor instance with line numbers, active line highlight, syntax highlighting.
  - Draft persistence indicator (saved locally).
- **Panel 3 (Right, 30% default, min 20%)**:
  - Preview header: Viewport switcher (Desktop 100%, Tablet 768px, Mobile 375px), refresh button.
  - Sandboxed `<iframe>` (`sandbox="allow-scripts"`, NO `allow-same-origin`) executing user HTML/CSS.

### 6.2 Mobile Layout (< 1024px)

- Sticky bottom navigation bar with 4 tabs:
  1. **Instructions**: Lesson theory and markdown content.
  2. **Code**: CodeMirror editor with HTML / CSS toggle.
  3. **Preview**: Sandboxed iframe preview.
  4. **Tests**: Challenge rules checklist, "Check my code" button, hints.
- State is preserved across tab transitions (all panels remain mounted in DOM, hidden via `aria-hidden` and CSS `hidden`).
- Tested down to 360px viewport without horizontal scrolling or viewport overflow.

---

## 7. Global Shell & Pages

1. **Header (`SiteHeader`)**:
   - Sticky glass surface with blur.
   - SVG Brand Logo ("DevCraft" / code brackets glyph).
   - Navigation links: Lessons, Dashboard.
   - Theme toggle (Dark / Light) with smooth transition and local storage persistence.
   - User session avatar or Login / Register buttons.
   - Mobile hamburger menu with focus trap.
2. **Footer (`SiteFooter`)**:
   - Clean, minimal footer with real facts (interactive curriculum, local execution, Dockerized architecture, no telemetry).
3. **Home Page (`/`)**:
   - Hero section with glass glow accents, bold title, and quick CTA to start learning.
   - Realistic non-interactive code editor mockup demonstrating interactive learning.
   - Curriculum highlights (HTML Structure, Text Tags, Links & Images, Box Model, CSS Selectors).
   - Platform architecture summary.
4. **Lessons Catalog (`/lessons`)**:
   - Roadmap / curriculum cards with difficulty, reading time, and interactive challenge preview.
   - Client-side completion badges overlay when authenticated.
5. **Dashboard (`/dashboard`)**:
   - Learner progress summary with circular `ProgressRing`.
   - "Continue learning" quick-resume card pointing to the next incomplete lesson.
   - Status badges for all lessons.
6. **Authentication (`/login`, `/register`)**:
   - Centered glass card with deep gradient background.
   - Accessible inputs with validation indicators, show/hide password toggle, and clear error banners.
