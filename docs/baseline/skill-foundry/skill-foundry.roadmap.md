---
baseline_schema: "2.0"
pack: "skill-foundry"
document: "roadmap"
status: "active"
updated: "2026-10-21"
code_ref: "unknown"
---

# Skill Foundry: Roadmap

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| SF-P1 | foundry skeleton and copier config | - | planned |
| SF-P2 | `template/` harness, scripts, example skill | SF-P1 | planned |
| SF-P3 | optional kit | SF-P2 | planned |
| SF-P4 | `AGENT-GUIDE.md`, foundry tests, release script | SF-P3 | planned |
| SF-P5 | end-to-end verification and initial commit | SF-P4 | planned |
| SF-P6 | ROI of making `Baselinedocs-Skills` and `commit-composer` copier-compatible | SF-P5 | planned |

## SF-P1: foundry skeleton and copier config

Acceptance criteria:

- `git init -b main`; `README.md`, `AGENTS.md`, `LICENSE` (MIT), `ruff.toml`, `.gitattributes`, `.gitignore`, `.editorconfig` at the root
- `copier.yml` with the five questions of `introduction` `Target`, validators on `repo_name` and `skill_prefix`, `_subdirectory: template`, `_min_copier_version` 9, no `_tasks`

Verification gate: `uvx --from "copier>=9,<10" copier copy --defaults --data repo_name=probe <scratch>` renders without prompting.

## SF-P2: `template/` harness, scripts, example skill

Acceptance criteria:

- `pytest.ini`, `.gitattributes` (LF), `.gitignore`, `.editorconfig`, `ruff.toml`, `LICENSE` from the `license` answer
- `tests/helpers.py` (`skill_dirs()` by prefix, frontmatter split, git file listing); `test_skill_shape.py` (folder shape, `name` equals folder, description at most 1024 characters, semver `version`, boolean `allow_implicit_invocation`); `test_conventions.py` (no en or em dash, hard-wrap warning, no sibling dependency); `test_version.py` (stamp behaviour, one shared version)
- `scripts/release.py` and `scripts/stamp_version.py` globbing `<prefix>-*`; `scripts/new_skill.py <name>` copying the example skill at the repository's current version
- `<prefix>-example/SKILL.md` as a user entrypoint at `version: "0.0.0"`, with `agents/openai.yaml` setting `allow_implicit_invocation: false`
- `.github/workflows/tests.yml` (pytest on Ubuntu, macOS and Windows, plus `uvx ruff check` and `uvx ruff format --check`) and `release.yml` (verify only, read-only)
- `AGENTS.md` and `README.md`, including one line: commits follow Conventional Commits with the skill name as scope

Verification gate: in a rendered repository, pytest, `ruff check` and `ruff format --check` pass; `new_skill.py demo` then pytest passes.

## SF-P3: optional kit

Acceptance criteria:

- `with_kit`: `contract/kit.sh` (read-only `hello` command, POSIX rules stated in its header), packaged copy at `<prefix>-example/scripts/kit.sh`, `test_packaged_copies.py`, `test_kit.py` with one case per rule; `new_skill.py` copies the kit as well
- `with_kit` off leaves no trace of the kit

Verification gate: render with `with_kit` on and off; each suite passes.

## SF-P4: `AGENT-GUIDE.md`, foundry tests, release script

Acceptance criteria:

- `AGENT-GUIDE.md` per SF-D3: when to use it, five labelled questions, the exact command without prompts, pre-checks, post-checks, prohibitions, `copier update`
- foundry `tests/`: render the kit-on and kit-off variants and run their suites; every `--data` key in the guide's command exists in `copier.yml` and every question appears in the command
- `scripts/release.py vX.Y.Z` per SF-D4
- foundry `.github/workflows/tests.yml`

Verification gate: `uvx --from "pytest>=8,<10" --with pyyaml --with "copier>=9,<10" pytest tests/ -q` and ruff pass on the foundry.

## SF-P5: end-to-end verification and initial commit

Acceptance criteria:

- the guide's command, run verbatim with the local path in place of `gh:`, produces a repository whose suite passes
- one initial commit on `main`; no push, no tag, no GitHub repository

Verification gate: `git status` clean and `git log` shows one commit.

## SF-P6: ROI of making `Baselinedocs-Skills` and `commit-composer` copier-compatible

Copier-compatible means the repository carries a `.copier-answers.yml` from applying the foundry to it, so `copier update` can later merge foundry changes into it.

Acceptance criteria:

- read-only: neither repository is edited or committed; any trial adoption runs on a scratch clone
- per repository, a trial adoption on a scratch clone (`copier copy` of the foundry into the clone, answers matching the repository), recording the files it overwrites or conflicts with and how many lines differ
- per repository, cost: the edits needed so the generated harness and the repository's own harness coexist (prefix, extra skill sets, extra kits, pinned tests, release history), and the files that must be excluded from updates with `_skip_if_exists` or similar
- per repository, benefit: which harness files would receive foundry fixes through `copier update`, and how often those files changed in the repository's own git history
- per repository, risk: what an update could overwrite or break, such as byte-identical packaged copies or pinned gate sentences
- an ROI verdict per repository, `adopt`, `adopt partially` (listing files), or `do not adopt`, with the reason
- the verdict is presented to the user; adoption is a separate decision and phase

Verification gate: each cost and benefit figure names the command or git query that produced it, and the scratch clones are deleted.

## Risks
