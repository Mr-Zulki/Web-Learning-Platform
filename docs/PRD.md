# PRD

## Goal

Students ko HTML/CSS interactive tareeqe se seekhne ka platform dena.

## Users

- Student (main)
- Admin (lessons add karta ha — optional, Phase 5)

## Must have (MVP)

- Lessons list + detail
- Live editor with preview
- 1 challenge per lesson with auto-check
- Register/login
- Progress save

## Should have

- Hints, quizzes, progress bar

## Out of scope

- Payments, certificates, real-time chat

## Supported Selector Grammar (Phase 3 Checker)

The challenge evaluation engine statically parses HTML and CSS using a simplified, deterministic selector grammar:

- **Element / Tag**: `tag` (e.g., `p`, `h1`, `ul`, `img`, `section`, `header`)
- **Class**: `.class` (e.g., `.container`, `.card`, `.highlight`)
- **ID**: `#id` (e.g., `#hero`, `#banner`, `#main-content`)
- **Tag with Class**: `tag.class` (e.g., `p.lead`, `h2.subtitle`)
- **Hierarchy (`child-of`)**: Evaluates ancestor-descendant relationships between any two supported selectors.
- Complex combinators (`>`, `+`, `~`, `:nth-child`, pseudo-elements) are intentionally excluded from the basic challenge engine to keep verification predictable and beginner-focused.
