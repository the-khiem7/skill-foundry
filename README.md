# skill-foundry

A [copier](https://copier.readthedocs.io/) template that creates a new agent-skill repository with the test harness, release scripts, rules, formatter and CI already in place.

## Create a repository

```bash
uvx --from "copier>=9,<10" copier copy gh:the-khiem7/skill-foundry <destination>
```

copier asks five questions:

| Question | Default |
|---|---|
| `repo_name` | none; lowercase letters, digits and single hyphens |
| `skill_prefix` | `repo_name`; every skill folder is `<prefix>-<name>` |
| `github_owner` | `the-khiem7` |
| `license` | `MIT`; or `Apache-2.0`, `none` |
| `with_kit` | `true`; adds a read-only POSIX shell kit and its tests |

Then `git init`, and run the generated suite. Later foundry fixes reach a generated repository with `uvx --from "copier>=9,<10" copier update`.

## Let an agent do it

Point the agent at the guide pinned to a release tag:

```text
https://raw.githubusercontent.com/the-khiem7/skill-foundry/v1.0.0/AGENT-GUIDE.md
```

## Layout

| Path | What it is |
|---|---|
| `copier.yml` | the questions |
| `template/` | what a generated repository holds |
| `AGENT-GUIDE.md` | instructions an agent follows to run copier without prompts |
| `tests/` | renders the template and runs each generated suite |
| `scripts/release.py` | the foundry's own release |
