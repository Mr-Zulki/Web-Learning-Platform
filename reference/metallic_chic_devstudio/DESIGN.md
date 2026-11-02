---
name: Metallic Chic DevStudio
colors:
  surface: '#fcf8ff'
  surface-dim: '#ddd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1fe'
  surface-container: '#f1ecf9'
  surface-container-high: '#ebe6f3'
  surface-container-highest: '#e5e0ed'
  on-surface: '#1c1a23'
  on-surface-variant: '#444651'
  inverse-surface: '#312f39'
  inverse-on-surface: '#f4effc'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4459a8'
  primary: '#233a87'
  on-primary: '#ffffff'
  primary-container: '#3d52a0'
  on-primary-container: '#c0cbff'
  inverse-primary: '#b7c4ff'
  secondary: '#385bac'
  on-secondary: '#ffffff'
  secondary-container: '#88a9ff'
  on-secondary-container: '#0e3a8b'
  tertiary: '#2e3f66'
  on-tertiary: '#ffffff'
  tertiary-container: '#45567f'
  on-tertiary-container: '#bbccfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001552'
  on-primary-fixed-variant: '#2b418e'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b2c5ff'
  on-secondary-fixed: '#001847'
  on-secondary-fixed-variant: '#1a4293'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b5c6f5'
  on-tertiary-fixed: '#051a40'
  on-tertiary-fixed-variant: '#35466e'
  background: '#fcf8ff'
  on-background: '#1c1a23'
  surface-variant: '#e5e0ed'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  label-pill:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for an interactive developer education platform bridging rigorous technical tooling with approachable, modern product craft. The brand personality blends developer-focused precision (reminiscent of modern code workspaces like Linear and modern IDE environments) with the motivating, structured clarity of premier EdTech platforms. 

The aesthetic is characterized by a "Metallic Chic" palette: chilled steel tones, rich cobalt blues, polished glassmorphism borders, and deep slate code surfaces contrasted against calm lavender-tinted light mode canvases. 

Key design attributes:
- **High Craft & Polish**: Crisp hairline borders with metallic micro-gradients, soft translucent glass plates, and tactile micro-interactions that reward continuous learning.
- **Dual-Surfaced Harmony**: Balanced integration of light editorial/tutorial workspaces alongside high-focus dark slate syntax environments.
- **Structured Precision**: Geometric typographic anchors balanced with monospaced data tags, keyboard hotkeys, and interactive live previews.
- **Encouraging Feedback**: Subtle glowing completion indicators, tactile lesson checkpoints, and high-legibility progress metrics that sustain momentum without visual clutter.

## Colors

The color system is anchored in a metallic cool-spectrum hierarchy supported by specialized surface layers for interactive coding workspaces.

### Primary & Accent Roles
- **Primary (`#3D52A0`)**: Structural focus, authoritative headers, active navigation pills, brand anchors, and prominent call-to-actions.
- **Secondary (`#7091E6`)**: Interactive state indicators, focus rings, active tab underlines, primary button gradients, and code selection markers.
- **Tertiary (`#8697C4`)**: Secondary iconography, contextual metadata, muted toggles, and border framing for passive elements.
- **Light Neutral Highlight (`#ADBBDA`)**: Secondary hover states, soft panel headers, subtle separators, and chip backdrops.
- **Neutral Canvas (`#EDE8F5`)**: Ambient background canvas for documentation, lessons, and workspace chrome in standard mode.

### Dark Workspace & Code Editor Surfaces
Interactive exercise environments and terminal viewports rely on dedicated dark slate tones to maximize syntax legibility:
- **Editor Canvas Base**: `#131722` (deep, immersive slate)
- **Editor Active Surface**: `#1B2236` (file trees, sidebar panels, input fields)
- **Editor Elevated Container**: `#252D4A` (floating inspector panels, breadcrumb toolbars, hover tooltips)

### Semantic & Feedback Colors
- **Success (`#10B981`)**: Test suite passes, completed modules, challenge streaks.
- **Error (`#EF4444`)**: Syntax exceptions, failing test assertions, compiler warnings.
- **Warning (`#F59E0B`)**: Deprecated HTML/CSS hints, performance alerts, run-time notices.

## Typography

The type hierarchy harmonizes three specialized families:
1. **Plus Jakarta Sans** delivers warm, contemporary geometric clarity for course titles, landing sections, modal headers, and motivational milestones.
2. **Inter** handles prose, curriculum instruction, theory explainers, and long-form feedback messages with high micro-legibility and balanced kerning.
3. **JetBrains Mono** powers inline code tokens, syntax snippets, terminal readouts, keyboard shortcuts (`kbd`), line numbers, and file tree directories.

All heading levels incorporate subtle negative tracking (`-0.01em` to `-0.03em`) to mimic polished developer tool headers. Body copy uses generous line heights (`1.5` to `1.625`) to minimize cognitive fatigue during multi-step coding exercises.

## Layout & Spacing

The layout architecture employs a hybrid split-screen modular grid engineered for side-by-side didactic content, live code editors, and live browser previews.

- **Split Workspace Model**: The default interactive learning canvas uses an asymmetrical split ratio (e.g., 40% instruction/theory panel, 60% code & execution console on large displays). Panel dividers support drag-resizing with an active hit-area gap of `space-xs`.
- **Responsive Adaptations**:
  - **Desktop (1024px+)**: 12-column system, standard dual/triple column IDE panels with fixed auxiliary gutters (`gutter-desktop`).
  - **Tablet (768px – 1023px)**: Vertically stacked or tabbed dual-view (Lesson view vs. Playground view), `1rem` gutters.
  - **Mobile (< 768px)**: Single column stack featuring swipeable segmented controls across `Instructions`, `HTML/CSS Editor`, and `Live Preview`, with compact `margin` (1rem).

## Elevation & Depth

Visual hierarchy uses a refined metallic glassmorphism combined with ambient tinted shadows and low-contrast perimeter hairlines.

- **Surface Layers & Glassmorphism**: Cards and panels sit on semi-translucent backdrops (`rgba(255, 255, 255, 0.75)` on light canvases; `rgba(27, 34, 54, 0.85)` on code canvases) paired with an 8px to 16px background blur (`backdrop-filter: blur(12px)`).
- **Subtle Metallic Borders**: Rather than harsh flat borders, cards and split panes utilize 1px solid or micro-gradient borders tinted with `#8697C4` at 25%–40% opacity, delivering an anodized aluminum feel.
- **Ambient Shadows**: Shadows are tinted with deep cobalt `#3D52A0` rather than pitch black, preventing visual mud:
  - *Resting Card*: `0 4px 20px -2px rgba(61, 82, 160, 0.08)`
  - *Floating / Hover Card*: `0 12px 32px -4px rgba(61, 82, 160, 0.16), 0 0 0 1px rgba(112, 145, 230, 0.3)`
  - *Modal & Dropdown*: `0 20px 48px -8px rgba(19, 23, 34, 0.28), 0 0 0 1px rgba(173, 187, 218, 0.35)`
- **Luminescent Accent Lights**: High-focus elements (active running code, challenge solved) utilize an internal top-edge highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.2)`).

## Shapes

The design system adopts a balanced roundedness tier (`roundedness: 2`), yielding 8px (`0.5rem`) base radii for smaller interactive controls, 16px (`1rem`) for primary cards and modular panels, and 24px (`1.5rem`) for major stage containers and modal dialogs.

- **Buttons & Input Controls**: 8px (`0.5rem`) for a tailored, tactile modern software feel.
- **Code Frames & Interactive Cards**: 14px–16px (`rounded-lg`) to soften dense technical interfaces without squandering internal viewport pixels.
- **Pills & Status Tags**: Fully rounded pill shapes (`9999px`) to distinguish categorical tags and completion chips from structural UI.
- **Progress Track Indicators**: Fully rounded capsules with inset progress fills.

## Components

### Buttons
- **Primary Action**: Subtle metallic gradient (`linear-gradient(135deg, #7091E6 0%, #3D52A0 100%)`), pure white typography, 1px highlight border (`rgba(255, 255, 255, 0.25)`). Hover triggers a gentle glow: `box-shadow: 0 4px 16px rgba(112, 145, 230, 0.4)`.
- **Secondary Action**: Surface background of `#EDE8F5`, text `#3D52A0`, bounded by a 1px border of `#8697C4` at 40% opacity.
- **Code Run Button**: Semantic emerald blend (`linear-gradient(135deg, #10B981, #059669)`), with monospaced keyboard hotkey badge (`⌘ Enter` or `Ctrl + Enter`).

### Code Editor & Syntax Containers
- **Container**: Dark Navy Slate background (`#131722`), framed by `#252D4A` borders. Includes an upper metadata tab bar displaying language badges, file names, reset code buttons, and auto-format toggles.
- **Inline Code Blocks**: JetBrains Mono set against `#252D4A` with 4px border radius, 2px horizontal padding, and `#ADBBDA` text tint.
- **Diff / Status Lines**: Subtle background flashes—`rgba(16, 185, 129, 0.15)` for test passes, `rgba(239, 68, 68, 0.15)` for assertion failures.

### Cards & Lesson Modules
- **Exercise Card**: Crisp glassmorphic panel on `#FFFFFF` with 80% opacity, bordered by `rgba(134, 151, 196, 0.3)`. Contains header title, completion ratio, and difficulty tag.
- **Active / Focused Lesson Card**: Elevated with an outer ring of `2px solid #7091E6` and an ambient glow.

### Chips & Badges
- **Skill Level Tags**: Upper-cased `label-pill` typography in pill containers. Steel-tinted (`#EDE8F5` background, `#3D52A0` text).
- **Test Feedback Badges**: Pill chips containing an icon indicator (check or cross) with low-saturation colored backdrops (`#10B9811A` background with `#10B981` text for passing states).

### Input Fields & Search Bars
- **Text Inputs**: Crisp background in `#FFFFFF` (or `#1B2236` in code contexts), 1px `#8697C4` border, 8px corner radius. Focused state transitions smoothly to `#7091E6` border with a 3px diffused outer halo (`rgba(112, 145, 230, 0.2)`).

### Checklists & Lesson Progression Steps
- **Step Item**: Horizontal card with circular numbered indicator. Incomplete steps use muted steel ring `#8697C4`; completed steps switch to `#10B981` with animated checkmark draw.
- **Progress Bars**: 6px height track in `#ADBBDA` (30% opacity) with a dual-tone `#7091E6` to `#3D52A0` rounded fill cap.