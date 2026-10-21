import shutil
import subprocess
from pathlib import Path

import pytest
from copier import run_copy

ROOT = Path(__file__).resolve().parents[1]
UVX = shutil.which("uvx")
UV = shutil.which("uv")
needs_uvx = pytest.mark.skipif(UVX is None or UV is None, reason="no uv or uvx on PATH")
GENERATED_SUITE = ["--from", "pytest>=8,<10", "--with", "pyyaml", "pytest", "tests/", "-q"]
RUFF = ["--from", "ruff>=0.6,<1", "ruff"]
# Not foundry content: copying them into the template source would let copier
# read a stale cache or the foundry's own git state.
SKIP = shutil.ignore_patterns(".git", ".pytest_cache", "__pycache__", ".ruff_cache")


@pytest.fixture(scope="session")
def source(tmp_path_factory):
    # Rendering from a copy without .git renders the working tree as it is,
    # rather than whatever tag or commit copier would pick from the history.
    target = tmp_path_factory.mktemp("foundry") / "src"
    shutil.copytree(ROOT, target, ignore=SKIP)
    return target


def render(source, destination, **answers):
    data = {"repo_name": "probe", **answers}
    run_copy(str(source), str(destination), data=data, defaults=True, quiet=True)
    subprocess.run(["git", "init", "-q", "-b", "main"], cwd=destination, check=True)
    return destination


def run_uvx(args, cwd):
    return subprocess.run([UVX, *args], cwd=cwd, capture_output=True, text=True)


def test_answers_file_records_every_answer(source, tmp_path):
    out = render(source, tmp_path / "out", skill_prefix="pr", license="none", with_kit=False)
    answers = (out / ".copier-answers.yml").read_text(encoding="utf-8")
    for line in ("repo_name: probe", "skill_prefix: pr", "license: none", "with_kit: false"):
        assert line in answers


def test_prefix_names_the_example_skill(source, tmp_path):
    out = render(source, tmp_path / "out", skill_prefix="pr")
    assert (out / "pr-example" / "SKILL.md").is_file()
    assert not list(out.rglob("*.jinja"))


@pytest.mark.parametrize(
    ("license", "first_line"),
    [("MIT", "MIT License"), ("Apache-2.0", "Apache License")],
)
def test_license_text_follows_the_answer(source, tmp_path, license, first_line):
    out = render(source, tmp_path / "out", license=license)
    assert (out / "LICENSE").read_text(encoding="utf-8").strip().startswith(first_line)


def test_license_none_writes_no_file(source, tmp_path):
    assert not (render(source, tmp_path / "out", license="none") / "LICENSE").exists()


def test_kit_off_leaves_no_trace(source, tmp_path):
    out = render(source, tmp_path / "out", with_kit=False)
    assert not list(out.rglob("kit.sh"))
    assert not (out / "contract").exists()
    assert "kit" not in (out / "AGENTS.md").read_text(encoding="utf-8").lower()


def test_an_invalid_repo_name_is_refused(source, tmp_path):
    with pytest.raises(ValueError):
        render(source, tmp_path / "out", repo_name="Bad_Name")


@needs_uvx
@pytest.mark.parametrize("with_kit", [True, False])
def test_generated_repository_passes_its_own_checks(source, tmp_path, with_kit):
    out = render(source, tmp_path / "out", with_kit=with_kit)
    for args in (GENERATED_SUITE, [*RUFF, "check"], [*RUFF, "format", "--check"]):
        result = run_uvx(args, out)
        assert result.returncode == 0, result.stdout + result.stderr
    added = subprocess.run(
        [UV, "run", "scripts/new_skill.py", "demo"],
        cwd=out,
        capture_output=True,
        text=True,
    )
    assert added.returncode == 0, added.stdout + added.stderr
    assert (out / "probe-demo" / "scripts" / "kit.sh").exists() is with_kit
    result = run_uvx(GENERATED_SUITE, out)
    assert result.returncode == 0, result.stdout + result.stderr
