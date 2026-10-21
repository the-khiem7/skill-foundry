import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("release", ROOT / "scripts" / "release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)

LINK = "https://raw.githubusercontent.com/the-khiem7/skill-foundry/v1.0.0/AGENT-GUIDE.md"


def test_rewrite_moves_every_guide_link_to_the_new_tag():
    text = f"read {LINK}\nand {LINK}\n"
    assert release.rewrite_links(text, "v1.2.0") == text.replace("v1.0.0", "v1.2.0")


def test_rewrite_leaves_other_versions_alone():
    text = 'uvx --from "copier>=9,<10" and v1.0.0 alone\n'
    assert release.rewrite_links(text, "v2.0.0") == text


@pytest.mark.parametrize("raw", ["1.2", "v1.2.3.4", "latest", ""])
def test_release_rejects_a_tag_that_is_not_semver(raw):
    with pytest.raises(ValueError):
        release.parse_version(raw)


def test_release_without_an_argument_prints_usage():
    assert release.main(["release.py"]) == 2
