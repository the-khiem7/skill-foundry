---
baseline_schema: "2.0"
pack: "skill-foundry"
document: "hallucination"
status: "active"
updated: "2026-10-21"
code_ref: "unknown"
---

# Skill Foundry: Decisions and Open Questions

## Entry index

| Entry | About | Status | Related |
|---|---|---|---|
| SF-D1 | copier as the generator, pinned, with a `template/` subdirectory | current | SF-D2, SF-D3 |
| SF-D2 | what a generated repository contains, and what is optional | current, baselinedocs pack option removed | SF-D1 |
| SF-D3 | an agent guide read through a raw link, running copier without prompts | current | SF-D1, SF-D5 |
| SF-D4 | the foundry's own release script | current | SF-D3, SF-D6 |
| SF-D5 | foundry tests render the template and check the guide | current | SF-D3 |
| SF-D6 | `main` carries code and releases are semver tags | current | SF-D4 |

## SF-D1: copier generates repositories from a `template/` subdirectory, pinned to major 9

**Decided.** Generate with `uvx --from "copier>=9,<10" copier copy`. `copier.yml` sets `_subdirectory: template` and `_min_copier_version`. The GitHub "template repository" flag stays off.

**Why.** The prefix is a variable and the kit is optional, so a plain copy needs renaming in about ten places per new repository; copier fills them from answers and records them in `.copier-answers.yml`, which also lets `copier update` merge later foundry fixes into a generated repository.

**What breaks if ignored.** Unpinned, a copier major release can change template syntax and break generation with no foundry change. With the GitHub flag on, "Use this template" copies the unrendered template with its `{{ }}` placeholders.

**Rejected: GitHub template repository.** Renaming and option removal by hand, and no update path.

**Rejected: plain copy.** Same cost, and no answers recorded.

**Rejected: a repository that is both a working repo and a copier template.** Keeps the GitHub button, but every variable-bearing file carries `.jinja`; the user chose pure copier.

## SF-D2: a generated repository carries harness, scripts, rules, formatter and CI; the kit is optional

**Decided.** Always generated: `pytest.ini`, `tests/helpers.py`, shape, convention and version tests, `release.py`, `stamp_version.py`, `new_skill.py`, `.gitattributes`, `.editorconfig`, `ruff.toml`, `tests.yml` and `release.yml`, `AGENTS.md`, `README.md`, `LICENSE`, and `<prefix>-example` as a user entrypoint at `0.0.0`. `with_kit` (default on) adds `contract/kit.sh`, its packaged copy and its tests. No baselinedocs pack is generated. Skill folders are named `<prefix>-*`. Ruff checks and formats the Python in `tests/` and `scripts/`. `AGENTS.md` states Conventional Commits with the skill name as scope. Only `agents/openai.yaml` is generated as host metadata.

**Why.** Each part was proven in the two existing repositories, and their tests and version stamp find skills by folder prefix, so the prefix is a variable. A kit is common and its packaged-copy test is the costly part to rewrite. The example is an entrypoint because a skill whose job is not yet known should not fire on its own.

**What breaks if ignored.** Without the prefix variable, `skill_dirs()` and the stamp match nothing. Without the packaged-copy test, a kit copy drifts from its canonical file silently.

**Rejected: shellcheck.** Needs a binary install, which may hit the machine's privilege boundary.

**Rejected: the pack always on.** Baselinedocs is not required to build a skill.

**Rejected: an optional baselinedocs skeleton (`with_pack`).** Planned first, removed by the user; a repository that wants a pack runs `baselinedocs-init` itself.

**Rejected: version `1.0.0` for the example.** A new repository has had no release.

**Rejected: a kit named after the prefix.** `kit.sh` is renamed once the skill has a real job.

**Rejected: metadata for other hosts.** Claude Code reads only `SKILL.md` frontmatter, as in both existing repositories.

## SF-D3: `AGENT-GUIDE.md` tells an agent to run copier without prompts, read through a raw link pinned to a tag

**Decided.** `AGENT-GUIDE.md` sits at the foundry root, outside `template/`, and is read at `https://raw.githubusercontent.com/the-khiem7/skill-foundry/<tag>/AGENT-GUIDE.md`. It tells the agent to ask the five questions as labelled questions, then run `uvx --from "copier>=9,<10" copier copy --defaults --data <key>=<value> ... gh:the-khiem7/skill-foundry <dest>`, to check first that the destination is absent or empty, to run `git init`, pytest and ruff afterwards, and never to push, create a GitHub repository, or commit unasked. `copier.yml` has no `_tasks`, so `--trust` is not needed.

**Why.** An agent runs without an interactive terminal, so copier waiting on a prompt hangs or fails; `--defaults` with `--data` supplies every answer. `_tasks` require `--trust`, which lets the template run commands on the machine, and the only task needed was `git init`, which the agent can run itself.

**What breaks if ignored.** A link to `main` lets anyone who can push to `main` steer every agent that reads it. A guide relying on prompts stalls. `--trust` grants code execution from a remote template.

**Rejected: a link on `main`.** Not pinned, see above.

**Rejected: `_tasks` for `git init`.** Needs `--trust`.

## SF-D4: the foundry releases with its own `scripts/release.py`

**Decided.** `uv run scripts/release.py vX.Y.Z` refuses unless on `main` with a clean tree and an unused tag, runs the foundry tests, rewrites the tag in the raw links of `README.md` and `AGENT-GUIDE.md`, commits `release: vX.Y.Z`, tags that commit, and prints the push commands without running them.

**Why.** `gh:` resolves the latest tag and the guide link is pinned to a tag, so every release needs a tag and updated links; the template's `release.py` stamps `SKILL.md` files, which the foundry does not hold.

**What breaks if ignored.** A tag cut by hand leaves the guide link on the previous tag, so agents read stale instructions.

**Rejected: reuse the template's release script.** It stamps skills the foundry does not hold.

## SF-D5: foundry tests render the template with copier and check the guide against `copier.yml`

**Decided.** The foundry suite renders a repository with `with_kit` on and one with it off, runs each generated suite, and fails when a `--data` key in the guide's command is not a question in `copier.yml` or a question is missing from the command. Test command: `uvx --from "pytest>=8,<10" --with pyyaml --with "copier>=9,<10" pytest tests/ -q`.

**Why.** A template is proven only by rendering it, and the guide is a second description of the questions that drifts the first time a question is added.

**What breaks if ignored.** A template error ships until someone generates a repository; an agent passes answers copier no longer asks for, or misses one and silently gets a default.

## SF-D6: `main` carries code, and releases are semver tags

**Decided.** The foundry uses `main` with code and `vX.Y.Z` tags, as `commit-composer` does.

**Why.** It is a personal working repository, not a production distribution repository.

**What breaks if ignored.** Under an empty `main`, `gh:` without a tag and any raw link on `main` resolve to nothing.

**Rejected: the production-repository branch model (empty `main`, semver branches).** It does not govern a personal working repository.

## Open questions

No open question is recorded.
