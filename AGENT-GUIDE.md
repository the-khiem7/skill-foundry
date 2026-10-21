# Agent guide: create a skill repository with skill-foundry

You are an agent asked to create a new agent-skill repository. Follow these steps in order. copier generates the repository from the template at `gh:the-khiem7/skill-foundry`; you run it without prompts, because copier waiting on an interactive prompt hangs in an agent terminal.

## When to use this guide

- The user wants a new repository for a family of agent skills, with tests, release scripts, rules, formatter and CI.
- Not for adding a skill to an existing generated repository: run `uv run scripts/new_skill.py <name>` there instead.
- Not for updating a generated repository: see `Updating later` below.

## 1. Ask the five questions

Ask the user these as labelled questions, each with its default, and wait for the answers. Never guess `repo_name`.

| Key | What it sets | Default |
|---|---|---|
| `repo_name` | repository name; lowercase letters, digits and single hyphens | none, required |
| `skill_prefix` | folder prefix of every skill, `<prefix>-<name>` | the value of `repo_name` |
| `github_owner` | GitHub user or organization in the install command | `the-khiem7` |
| `license` | `MIT`, `Apache-2.0` or `none` | `MIT` |
| `with_kit` | `true` adds a read-only POSIX shell kit with its packaged copy and tests | `true` |

Also ask for the destination folder.

## 2. Check before running

- `uvx` is on PATH. Without it, stop and tell the user to install `uv`; do not install it yourself.
- The destination folder does not exist, or exists and is empty. Otherwise stop: copier would write over the files there.

## 3. Generate

Run this command with every answer filled in. Pass every key, even when the answer is the default, so nothing is decided silently.

```bash
uvx --from "copier>=9,<10" copier copy --defaults \
  --data repo_name=<repo_name> \
  --data skill_prefix=<skill_prefix> \
  --data github_owner=<github_owner> \
  --data license=<license> \
  --data with_kit=<with_kit> \
  gh:the-khiem7/skill-foundry <destination>
```

Never add `--trust`. The template has no tasks, and `--trust` would let a remote template run commands on this machine.

## 4. Check after running

Inside the destination:

```bash
git init -b main
uvx --from "pytest>=8,<10" --with pyyaml pytest tests/ -q
uvx --from "ruff>=0.6,<1" ruff check
uvx --from "ruff>=0.6,<1" ruff format --check
```

Report the result of each command to the user. A failure here is a template defect: report it as one and do not edit the generated files to hide it.

## 5. Never

- Never push, never create a GitHub repository, and never commit, unless the user asks for that specific action.
- Never edit `.copier-answers.yml` by hand; `copier update` depends on it.

## Updating later

Inside a generated repository with a clean working tree:

```bash
uvx --from "copier>=9,<10" copier update --defaults
```

copier merges the template changes since the recorded version into the repository. Show the user the resulting diff and any conflict before anything is committed.
