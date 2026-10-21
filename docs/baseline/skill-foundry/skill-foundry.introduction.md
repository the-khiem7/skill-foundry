---
baseline_schema: "2.0"
pack: "skill-foundry"
document: "introduction"
status: "active"
updated: "2026-10-21"
code_ref: "481f987"
---

# Skill Foundry

## Scope

A copier template that creates a new agent-skill repository with the harness, support scripts, rules, formatter, and CI already in place. It is a starting point for a new skill family.

Out of scope: adding a skill to an existing repository (the generated repository's own `scripts/new_skill.py` does that), pushing, creating GitHub repositories, and any baselinedocs pack.

## Current truth

| Area | State |
|---|---|
| Repository | `C:\.repos\Personal\skill-foundry`, git on `main`, one commit set per phase, no remote, no tag |
| Template, scripts, tests, guide | built; foundry suite and both rendered variants pass locally; no CI run yet |
| Copier | 9.x renders the template from the working tree without prompts (SF-D1) |

## Target

| Surface | What it is |
|---|---|
| `copier.yml` | five questions, `_subdirectory: template`, `_min_copier_version`, no `_tasks` (SF-D1, SF-D3) |
| `template/` | what a generated repository holds (SF-D2) |
| `AGENT-GUIDE.md` | instructions an agent reads through a raw GitHub link pinned to a tag, to run copier without prompts (SF-D3) |
| `README.md`, `AGENTS.md`, `LICENSE` | human usage page, rules for editing the foundry, MIT |
| `scripts/release.py` | the foundry's own release: test, rewrite tag links, commit, tag, never push (SF-D4) |
| `tests/` | renders the template with copier and runs the generated suite; checks the guide's command against `copier.yml` (SF-D5) |
| `ruff.toml`, `.github/workflows/tests.yml` | ruff and pytest for the foundry itself |

Copier questions:

| Variable | Default |
|---|---|
| `repo_name` | none; lowercase and hyphen |
| `skill_prefix` | `repo_name` |
| `github_owner` | `the-khiem7` |
| `license` | `MIT`; choices MIT, Apache-2.0, none |
| `with_kit` | true |

## Constraints

- Branch model: `main` carries code and releases are semver tags `vX.Y.Z` (SF-D6).
- Every command runs as a standard Windows user: `uv` and `uvx` only, nothing that needs elevation; shellcheck is excluded for that reason (SF-D2).
- ASCII hyphen only and no hard-wrapped paragraphs, in the foundry and in every file the template generates.
- A kit script is POSIX sh and POSIX awk, never writes, never touches the network.
- No AI attribution trailer in any commit.
