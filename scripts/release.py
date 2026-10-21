"""Cut a foundry release on this machine: test, rewrite tag links, commit, tag. Never pushes.

    uv run scripts/release.py v1.2.3

Runs the foundry suite, points every raw link to the guide in `README.md` and `AGENT-GUIDE.md` at the new tag, commits `release: v1.2.3` and tags that commit, so the tag holds the links that name it. It prints the two push commands and leaves them to you. Stops before any change when the tree is dirty, the branch is not main, or the tag exists locally or on origin.
"""

import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEMVER = re.compile(r"\d+\.\d+\.\d+")
LINKED_FILES = ("README.md", "AGENT-GUIDE.md")
TAG_LINK = re.compile(r"(raw\.githubusercontent\.com/[^/\s]+/skill-foundry/)v\d+\.\d+\.\d+/")
SUITE = [
    "--from",
    "pytest>=8,<10",
    "--with",
    "pyyaml",
    "--with",
    "copier>=9,<10",
    "pytest",
    "tests/",
    "-q",
]


def parse_version(raw):
    version = raw[1:] if raw.startswith("v") else raw
    if not SEMVER.fullmatch(version):
        raise ValueError(f"{raw!r} is not vMAJOR.MINOR.PATCH")
    return version


def rewrite_links(text, tag):
    return TAG_LINK.sub(lambda match: f"{match.group(1)}{tag}/", text)


def git(*args, check=True):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=check)


def refuse(message):
    print(f"release: {message}", file=sys.stderr)
    return 1


def preflight(tag):
    if git("branch", "--show-current").stdout.strip() != "main":
        return "not on main"
    if git("status", "--porcelain").stdout.strip():
        return "the working tree has uncommitted changes; commit or stash them first"
    if git("rev-parse", "-q", "--verify", f"refs/tags/{tag}", check=False).returncode == 0:
        return f"tag {tag} already exists locally"
    remote = git("ls-remote", "--tags", "origin", tag, check=False)
    if remote.returncode == 0 and remote.stdout.strip():
        return f"tag {tag} already exists on origin"
    if remote.returncode != 0:
        print("release: could not reach origin; the remote tag check was skipped")
    return None


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    try:
        tag = f"v{parse_version(argv[1])}"
    except ValueError as error:
        return refuse(str(error))
    problem = preflight(tag)
    if problem:
        return refuse(problem)
    uvx = shutil.which("uvx")
    if uvx is None:
        return refuse("uvx is not on PATH")
    if subprocess.run([uvx, *SUITE], cwd=ROOT).returncode != 0:
        return refuse("the suite failed; nothing was changed")
    for name in LINKED_FILES:
        path = ROOT / name
        text = path.read_bytes().decode("utf-8")
        path.write_bytes(rewrite_links(text, tag).encode("utf-8"))
    if git("status", "--porcelain").stdout.strip():
        git("commit", "-a", "-m", f"release: {tag}")
    git("tag", tag)
    print(f"release: {tag} is committed and tagged. Push it yourself:")
    print("  git push origin main")
    print(f"  git push origin {tag}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
