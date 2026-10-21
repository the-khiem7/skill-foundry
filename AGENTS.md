# Working in this repository

This repository is a copier template. Nothing at the root is copied into a generated repository; only `template/` is, as set by `_subdirectory` in `copier.yml`.

## Rules

- A file under `template/` that uses a copier variable ends in `.jinja`; every other file is copied verbatim. A `.jinja` suffix on a file without variables costs nothing, a missing one ships `{{ }}` placeholders.
- Never add `_tasks` to `copier.yml`. A task needs `copier copy --trust`, which lets a remote template run commands on the machine.
- Adding or renaming a question in `copier.yml` means changing the command in `AGENT-GUIDE.md` and the table in `README.md` in the same commit. The foundry tests fail when the guide and `copier.yml` disagree.
- ASCII hyphen only, no en dash or em dash. Never hard-wrap a paragraph. Both hold in every generated file too.
- Commits follow Conventional Commits, scope `skill-foundry`. No AI attribution trailer.

## Tests

```bash
uvx --from "pytest>=8,<10" --with pyyaml --with "copier>=9,<10" pytest tests/ -q
uvx --from "ruff>=0.6,<1" ruff check
uvx --from "ruff>=0.6,<1" ruff format --check
```

## Releases

`uv run scripts/release.py vX.Y.Z` tests, rewrites the tag in the raw links of `README.md` and `AGENT-GUIDE.md`, commits `release: vX.Y.Z` and tags it. It never pushes.
