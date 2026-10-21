---
baseline_schema: "2.0"
pack: "frontdoor"
document: "roadmap"
status: "active"
updated: "2026-10-21"
code_ref: "uncommitted"
---

# Frontdoor: Roadmap

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| FR-P1 | signature and hero | - | complete |
| FR-P2 | body figures | FR-P1 | complete |
| FR-P3 | README text | FR-P2 | complete |
| FR-P4 | polish and hosted review | FR-P3 | active |
| FR-P5 | commit | FR-P4 | planned, needs explicit authorization |

## FR-P1: signature and hero

Acceptance criteria:

- a signature derived from the repository, chosen by the user from rough directions on the local board
- `hero.webp` and `hero-dark.webp` with the project name and the one-line promise

Verification gate: `render.py` no WARN; both themes viewed at full size.

Evidence: three rounds on `.frontdoor/directions.html`; round 3 variant 3C chosen with the title moved to the bottom left (FR-D1). `hero.webp` 127 KB, `hero-dark.webp` 117 KB, 2400x1200.

## FR-P2: body figures

Acceptance criteria:

- `workflow`, `contents`, `update` in light and dark, each label traced to `AGENT-GUIDE.md` or `template/`
- no body figure repeats the hero's isometric conveyor (FR-D2)

Verification gate: `render.py` no WARN; every image viewed in both themes; contrast of the smallest text pairs at least 4.5.

Evidence: `workflow` side elevation 21 KB each theme; `contents` 86 and 80 KB; `update` 69 and 68 KB; `hero` 127 and 117 KB. Contrast 5.78 to 12.31 via `contrast.py`. Polish per FR-D7 applied; every image viewed in both themes after the final render (FR-D8).

## FR-P3: README text

Acceptance criteria:

- ten sections per `introduction` Target, English, pitching tone (FR-D4)
- every command from the manifest, `AGENT-GUIDE.md` or CI; alt text narrates each figure

Verification gate: `uvx --from "pytest>=8,<10" --with pyyaml --with "copier>=9,<10" pytest tests/ -q`, ruff check and format check; every image path exists.

Evidence: 22 passed; ruff clean; all eight image paths resolve.

## FR-P4: polish and hosted review

Acceptance criteria:

- FR-Q1 closed by FR-D7 and applied
- README viewed on github.com in light and dark and at phone width

Verification gate: screenshots or a written note of what was seen on github.com.

## FR-P5: commit

Acceptance criteria:

- Conventional Commits, scope `skill-foundry`, no AI attribution trailer; README and assets in one `docs` commit, `.gitignore` in one `chore` commit
- no intermediate PNG and nothing from `.frontdoor/` committed

Verification gate: `git status` clean except `.frontdoor/`.

## Risks

- `gh:the-khiem7/skill-foundry` and the `v1.0.0` guide link resolve only after a pushed tag; the README promises both.
- Each re-render adds image bytes to git history.

## Next action

Wait for explicit authorization of FR-P5. The github.com review of FR-P4 needs a pushed commit, so it runs after FR-P5 and after the user pushes; until then FR-P4 stays active.
