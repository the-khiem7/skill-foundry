---
baseline_schema: "2.0"
pack: "frontdoor"
document: "hallucination"
status: "active"
updated: "2026-10-21"
code_ref: "uncommitted"
---

# Frontdoor: Decisions and Open Questions

## Entry index

| Entry | About | Status | Related |
|---|---|---|---|
| FR-D1 | isometric factory hall as the signature and hero | current | FR-D2 |
| FR-D2 | body figures use a different view or factory component than the hero | current | FR-D1 |
| FR-D3 | image file locations and the git-ignored design board | current | - |
| FR-D4 | README language, tone and figure policy | current | FR-D2 |
| FR-D5 | relative image paths and the tag-pinned guide link | current | - |
| FR-D6 | lesson: mono ligatures and unescaped `<` in SVG text | current | - |
| FR-D7 | polish applied to the `update` and `workflow` figures | current | FR-D2, FR-Q1 |
| FR-D8 | lesson: a web font can fall back without a WARN | current | FR-D6 |
| FR-D9 | landing page structure, hero and interactive figures | current | FR-D1, FR-D5 |

## Closed decisions

### FR-D1: the signature is an isometric factory hall; copier is a production line

**Decided.** Hero 3C: floor slab, back wall with sawtooth roof and windows, conveyor from a yellow hopper (`five answers`) through a press (`copier copy`) and a green gate (`pytest + ruff`) to a crate `<repo_name>` on a pallet (`tested repo`); title block bottom left. Drawn with `assets/source/iso.js`.

**Why.** Each station is a real step of `AGENT-GUIDE.md`, so the picture carries the product's story; the user chose it after three rounds.

**What breaks if ignored.** A new figure in another style makes the page read as two projects; a station not in the guide is an invented claim.

**Rejected, round 1:** casting crucible pouring into a `copier.yml` mold, type-foundry sorts in a didone, mint coin with the prefix on its face. User disliked all three and asked for a foundry or factory scene.

**Rejected, round 2:** cutaway foundry at night (atmospheric, detail too small at README width), two-ink risograph poster (says nothing about the copier steps). Round 2 isometric line chosen but judged badly drawn, redrawn in round 3.

**Rejected, round 3:** 3A bare line (no place), 3B floor slab without wall (user preferred the hall).

### FR-D2: body figures must not repeat the hero's isometric conveyor

**Decided.** `workflow` is a side elevation of the line with numbered steps 1 to 4 (`ask the five questions`, `copier copy --defaults`, `git init -b main`, `pytest + ruff`). `update` is a warehouse corner: rack holding `repo + .copier-answers.yml`, forklift `copier update --defaults` lifting `newer template`, clipboard `review the diff, then commit`. `contents` is crates on pallets, one per part of a generated repository, the kit as a dashed ghost crate.

**Why.** The user rejected isometric conveyors in the body as a duplicate of the hero; a changed view angle or another factory component was the stated fix.

**What breaks if ignored.** The page repeats one picture three times and the body figures add nothing the hero did not show.

**Rejected: isometric conveyor for `workflow` and `update`.** Duplicates the hero. **Rejected: top-down floor plan for `workflow`.** User asked for a side view instead.

### FR-D3: images in `assets/`, sources in `assets/source/`, board in `.frontdoor/`

**Decided.** WebP pairs in `assets/`, HTML sources and `iso.js` in `assets/source/`, rough rounds and `directions.html` in `.frontdoor/`, which `board.py` added to `.gitignore`. No intermediate PNG is kept.

**Why.** Ruff covers only Python and no docs site publishes a folder, so `assets/` is neither linted nor published; the board holds unreleased sketches.

**What breaks if ignored.** Committed sketches bloat history; sources outside the repo make the images unrepeatable.

### FR-D4: README in English, pitching tone, workflow shown directly, alt text only

**Decided.** English; marketing pitch tone for readers new to agent skills; the workflow figure is never inside `<details>`; no text or Mermaid form of a diagram, alt text narrates each figure; the `Working on the foundry` section stays at the end.

**Why.** User answers to the content questions; `AGENT-GUIDE.md` is English and agents read it.

**What breaks if ignored.** A hidden workflow loses the one figure that explains the product; a missing alt text leaves the diagrams unreadable without images.

**Rejected: bilingual README.** Two copies to keep in sync. **Rejected: dropping the foundry section for a link to `AGENTS.md`.** Contributors need to know how `tests/` renders the template.

### FR-D5: images use relative paths; the guide link stays tag-pinned

**Decided.** Every image is `assets/<name>.webp` in a `<picture>` with a `-dark` source; the raw link to `AGENT-GUIDE.md` keeps the `v1.0.0` form.

**Why.** `tests/test_guide.py` fails on any `skill-foundry/main/` link and requires the tag link; `scripts/release.py` rewrites only that tag pattern.

**What breaks if ignored.** Raw image links on `main` fail the suite; a changed guide link escapes the release rewrite.

### FR-D6: lesson - JetBrains Mono ligatures and raw `<` in SVG text

**Decided.** `shared.css` sets `font-variant-ligatures: none` and `calt` off on every item; text passed into SVG writes `&lt;` and `&gt;`, and `Iso.sign` measures width after replacing entities.

**Why it looked fine.** The source text was correct and the browser showed no error.

**What disproved it.** The render showed `<prefix>-example` with `>-` drawn as one long dash glyph, and an empty sign where `<prefix>` had been parsed as an unknown SVG element.

**What breaks if ignored.** Labels render as a typographic dash the repo bans, or vanish silently; `render.py` reports neither.

### FR-D7: forklift without overhead guard, taller rack, lighter dark press tokens

**Decided.** `update`: the forklift guard is removed and the upper rack shelf moves from z 2.3 to 3.0 with posts at 4.5, so the repo crate is unobstructed. Dark theme press tokens become `--press-t:#4d5b6b; --press-l:#36414e; --press-r:#56636f`. Closes FR-Q1.

**Why.** The guard overlapped the mast, the shelf hid the crate the leader line points at, and the dark press head vanished against the ground.

**What breaks if ignored.** The scene reads as a jumble of steel, and the `workflow` press head is invisible in dark mode.

**Rejected: keep as is.** User chose to fix all three.

### FR-D8: lesson - a web font can fall back with no WARN from `render.py`

**Decided.** Look at every rendered image for the signature faces after each run; re-render when a serif fallback appears.

**Why it looked fine.** `render.py` printed no WARN and listed both families as found.

**What disproved it.** `hero-dark.webp` came out in a serif fallback after the FR-D7 run; the same command a moment later rendered Chakra Petch and JetBrains Mono.

**What breaks if ignored.** A fallback image is committed and every reader sees the wrong typeface.

### FR-D9: landing page is a stack of blueprint sheets with visitor-driven machines

**Decided.** Root `index.html`, single file, no kicker line on any sheet. Sheets in order: hero (title `The blueprint for every agent-skill repository.`, press that stamps a `<repo_name>` crate once on load and on click, `See how it works` scroll button; nothing else), work order (five switches rewrite the `--data` command from `AGENT-GUIDE.md`, centered run and reset, copy button inside the terminal, run stamps each part, `pytest + ruff` lamp), agent (short: title, tag-pinned guide link, copy button, robot head reading the guide card, then watching the switches flip), why (bench checklist races the press), stay in sync (crate under `copier update`, diff sheet), `Open the foundry.` (GitHub call, hall door opens on hover or focus). Same signature as FR-D1; README banner not reused. Social preview `assets/og.png` from `assets/source/og.html`; favicon `assets/favicon.svg`. At 700 px and below the work order, why and stay in sync figures switch to a vertical layout (viewBox 400 wide, rebuilt when the width class changes), the hero crops its margins and hides `click the press`, and below 600 px the header hides the How / Why / Update links.

**Why.** User chose round 5 direction 5A, with 5B's race as the explanation and 5C's update sheet; the hero title is a pitch and the interactive guide sits in its own sheet.

**What breaks if ignored.** A guide as the hero title reads as instructions, not a pitch; a closing sheet that tells the visitor what to do reads as an order and loses the GitHub click.

**Rejected, round 4:** control room alone (dashboard, not factory), press shop alone (parts, not steps), blueprint flowchart alone (generic); user kept their button style, colors, three actions, blueprint background and floating sheet, press shapes and switch interaction. **Rejected, round 5:** 5A sheet 3 `Read every part first.` (an order, not marketing); 5B and 5C as whole pages. **Rejected after review:** copy command and buttons in the hero (the hero is the pitch; commands live in the work order); agent step chain and description (made the sheet long). **Rejected for phones:** shrinking the wide figures to fit (labels near 4 px) and keeping a sideways scroll with auto-scroll (the visitor sees one part of the machine at a time).

## Open questions

No open question is recorded.
