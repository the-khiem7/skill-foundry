---
baseline_schema: "2.0"
pack: "frontdoor"
document: "introduction"
status: "active"
updated: "2026-10-21"
code_ref: "uncommitted"
---

# Frontdoor: README and illustrations for skill-foundry

## Scope

The public front door of the foundry: `README.md`, its illustrations in light and dark, and the HTML sources that render them. Built with the `frontdoor-readme` and `frontdoor-illustrate` skills.

Out of scope: the template, `AGENT-GUIDE.md` content, `copier.yml`, a landing page, pushing or publishing.

## Current truth

| Area | State |
|---|---|
| `README.md` | rewritten in English, pitching tone, ten sections (FR-D4); staged, not committed |
| Images | `hero`, `workflow`, `contents`, `update`, each with a `-dark` pair, in `assets/`; staged, not committed |
| Sources | `assets/source/`: `hero.html`, `figures.html`, `iso.js`, `figures.js`, `shared.css`, `shared.js` |
| Design rounds | three rounds on the local board `.frontdoor/directions.html`, git-ignored (FR-D3) |
| Verification | foundry suite 22 passed, ruff clean, `render.py` no WARN; not viewed on github.com |

## Target

| Section of `README.md` | Form |
|---|---|
| Hero and bold one-liner | `hero` image, isometric factory hall (FR-D1) |
| Why | three bullets |
| How it works | `workflow` image, side elevation of the line, shown directly (FR-D2) |
| What you get | `contents` image and a table |
| Quick start, The five questions | copyable commands and the question table |
| Let an agent do it | tag-pinned raw link to `AGENT-GUIDE.md` (FR-D5) |
| Stay in sync | `update` image, warehouse rack and forklift (FR-D2) |
| Guardrails | four bullets |
| Working on the foundry | layout table, dev commands, release |

Signature (also in the header comment of `assets/source/hero.html`):

| Line | Value |
|---|---|
| Concept | a factory hall where copier is a production line; answers in, tested repo out |
| Shape language | flat isometric blocks from `iso.js`, three tones per material, no outlines, dotted leader lines to chip signs |
| Typeface | Chakra Petch display, JetBrains Mono signs, ligatures off (FR-D6) |
| Palette | steel greys plant, safety yellow input, pass green tests, cardboard product; dark mode is the hall at night |
| Presentation | one scene per figure, stations named with the exact command or file |
| Not | gradients, blue-purple SaaS glow, stock icons, rounded card stacks |

## Constraints

- `tests/test_guide.py` requires a tag-pinned raw link to `AGENT-GUIDE.md` in `README.md` and forbids `skill-foundry/main/`; `scripts/release.py` rewrites that tag on release.
- `tests/test_conventions.py` scans every tracked file, including image sources, for en and em dashes.
- Image text states only what the code or `AGENT-GUIDE.md` states; the only count drawn is five, the number of questions in `copier.yml`.
- Install and usage commands stay as text, never inside an image or `<details>`.
- Render needs Edge or Chrome and network access for Google Fonts; `uvx --from playwright --with pillow`.
