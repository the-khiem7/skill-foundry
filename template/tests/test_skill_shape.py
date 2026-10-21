import re

import pytest
import yaml
from helpers import ROOT, SKILL_NAMES, read_text, split_frontmatter

# A skill installs as its own folder, so only these entries may sit in it.
ALLOWED_ENTRIES = {"SKILL.md", "agents", "references", "scripts"}
SEMVER = re.compile(r"\d+\.\d+\.\d+")


def frontmatter(name):
    meta, _ = split_frontmatter(read_text(ROOT / name / "SKILL.md"))
    assert meta is not None, f"{name}/SKILL.md has no frontmatter"
    return meta


def test_there_is_at_least_one_skill():
    assert SKILL_NAMES, "no <prefix>-*/SKILL.md found"


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_folder_holds_only_allowed_entries(name):
    entries = {path.name for path in (ROOT / name).iterdir()} - {"__pycache__"}
    assert entries <= ALLOWED_ENTRIES, sorted(entries - ALLOWED_ENTRIES)
    assert (ROOT / name / "agents" / "openai.yaml").is_file()


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_name_matches_folder(name):
    assert frontmatter(name)["name"] == name


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_description_fits_the_host_limit(name):
    description = frontmatter(name)["description"]
    assert isinstance(description, str) and description.strip()
    assert len(description) <= 1024


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_version_is_a_quoted_semver(name):
    version = frontmatter(name).get("version")
    assert isinstance(version, str) and SEMVER.fullmatch(version), version


@pytest.mark.parametrize("name", SKILL_NAMES)
def test_implicit_invocation_policy_is_a_boolean(name):
    meta = yaml.safe_load(read_text(ROOT / name / "agents" / "openai.yaml"))
    assert isinstance(meta["policy"]["allow_implicit_invocation"], bool)
