"""Add a skill by copying the example skill.

    uv run scripts/new_skill.py <name>

Creates `<prefix>-<name>/` from `<prefix>-example/`, renames every mention of the example inside it, and keeps the repository's current version so the shared-version test still passes. Stops when the name is not lowercase letters, digits and single hyphens, or the folder exists.
"""

import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import stamp_version  # noqa: E402

ROOT = stamp_version.ROOT
PREFIX = stamp_version.PREFIX
NAME = re.compile(r"[a-z][a-z0-9]*(-[a-z0-9]+)*")


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    name = argv[1].removeprefix(f"{PREFIX}-")
    if not NAME.fullmatch(name):
        print(f"new_skill: {argv[1]!r} is not lowercase letters, digits and hyphens")
        return 1
    source, target = ROOT / f"{PREFIX}-example", ROOT / f"{PREFIX}-{name}"
    if target.exists():
        print(f"new_skill: {target.name} already exists")
        return 1
    shutil.copytree(source, target, ignore=shutil.ignore_patterns("__pycache__"))
    for path in target.rglob("*"):
        if path.is_file():
            text = path.read_bytes().decode("utf-8")
            path.write_bytes(text.replace(source.name, target.name).encode("utf-8"))
    print(f"new_skill: created {target.name}; write its description and body next")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
