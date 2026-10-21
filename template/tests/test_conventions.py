import re
import warnings

import pytest
from helpers import ROOT, SKILL_NAMES, read_text, rel, repo_files_matching

TEXT_SUFFIXES = (".md", ".yaml", ".yml", ".txt", ".py", ".ini", ".toml", ".sh")
# Built from code points so this file does not contain the characters it bans.
TYPOGRAPHIC_DASH = re.compile(f"[{chr(0x2013)}{chr(0x2014)}]")
# A line that starts a block of its own rather than continuing a paragraph.
BLOCK_START = re.compile(r"\s*([-*+>|#]|\d+\.|<|!\[|\[[^\]]*\]:)")


def test_no_typographic_dashes():
    offenders = []
    for path in repo_files_matching(*TEXT_SUFFIXES):
        for number, line in enumerate(read_text(path).splitlines(), start=1):
            if TYPOGRAPHIC_DASH.search(line):
                offenders.append(f"{rel(path)}:{number}")
    assert offenders == [], f"use the ASCII hyphen: {', '.join(offenders)}"


def hard_wrapped_lines(text):
    """Line numbers where a prose paragraph continues on the next line."""
    found, fenced, previous = [], False, False
    lines = text.splitlines()
    start = lines.index("---", 1) + 1 if lines[:1] == ["---"] and "---" in lines[1:] else 0
    for number, line in enumerate(lines[start:], start=start + 1):
        if line.lstrip().startswith("```"):
            fenced, previous = not fenced, False
            continue
        if fenced:
            continue
        prose = bool(line.strip()) and not BLOCK_START.match(line)
        if prose and previous and not line.startswith(" "):
            found.append(number)
        previous = prose
    return found


def test_hard_wrap_is_reported():
    # A warning, not a failure: a quoted poem or an address is wrapped on purpose.
    for path in repo_files_matching(".md"):
        lines = hard_wrapped_lines(read_text(path))
        if lines:
            warnings.warn(f"{rel(path)} continues a paragraph on line(s) {lines}", stacklevel=1)


def test_hard_wrap_detector():
    assert hard_wrapped_lines("one line\nsecond line\n") == [2]
    assert hard_wrapped_lines("para\n\n- item\n- item\n```\na\nb\n```\n") == []
    assert hard_wrapped_lines("---\nname: x\ndescription: y\n---\n\nbody\nmore\n") == [7]


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_skill_needs_no_sibling_content(name):
    # A skill installs alone, so a path into another skill's folder resolves to
    # nothing on the machine that runs it.
    text = read_text(ROOT / name / "SKILL.md")
    assert "../" not in text
    for other in SKILL_NAMES:
        if other != name:
            assert f"{other}/" not in text, f"{name} reads {other}'s files"
