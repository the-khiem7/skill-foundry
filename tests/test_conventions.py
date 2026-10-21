import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# Built from code points so this file does not contain the characters it bans.
TYPOGRAPHIC_DASH = re.compile(f"[{chr(0x2013)}{chr(0x2014)}]")


def foundry_files():
    listed = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    ).stdout.decode("utf-8")
    return [ROOT / name for name in listed.split("\0") if name and (ROOT / name).is_file()]


def test_no_typographic_dashes_in_the_foundry_or_the_template():
    offenders = []
    for path in foundry_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for number, line in enumerate(text.splitlines(), start=1):
            if TYPOGRAPHIC_DASH.search(line):
                offenders.append(f"{path.relative_to(ROOT).as_posix()}:{number}")
    assert offenders == [], f"use the ASCII hyphen: {', '.join(offenders)}"
