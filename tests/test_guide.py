import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
GUIDE = (ROOT / "AGENT-GUIDE.md").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
CONFIG = yaml.safe_load((ROOT / "copier.yml").read_text(encoding="utf-8"))
QUESTIONS = {key for key in CONFIG if not key.startswith("_")}
GUIDE_LINK = re.compile(
    r"raw\.githubusercontent\.com/the-khiem7/skill-foundry/(v\d+\.\d+\.\d+)/AGENT-GUIDE\.md"
)


def copy_command():
    blocks = re.findall(r"```bash\n(.*?)```", GUIDE, re.DOTALL)
    commands = [block for block in blocks if "copier copy" in block]
    assert len(commands) == 1, "the guide must hold exactly one copier copy command"
    return commands[0]


def test_command_passes_every_question_and_nothing_else():
    keys = set(re.findall(r"--data (\w+)=", copy_command()))
    assert keys == QUESTIONS, {"missing": QUESTIONS - keys, "unknown": keys - QUESTIONS}


def test_question_table_lists_every_question():
    rows = set(re.findall(r"^\| `(\w+)` \|", GUIDE, re.MULTILINE))
    assert rows == QUESTIONS


def test_command_runs_without_prompts_and_without_trust():
    command = copy_command()
    assert "--defaults" in command
    assert 'uvx --from "copier>=9,<10"' in command
    assert "--trust" not in command


def test_template_has_no_tasks():
    # A task needs --trust, which lets a remote template run commands.
    assert "_tasks" not in CONFIG


def test_readme_links_the_guide_by_tag():
    assert GUIDE_LINK.search(README), "README must link the guide through a tag, not main"
    assert "skill-foundry/main/" not in README + GUIDE
