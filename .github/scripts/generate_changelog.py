#!/usr/bin/env python3
"""
Fetches a Watchflare release, generates a polished changelog entry via Claude,
and inserts it into src/content/docs/en/changelog.mdx.

Required env vars:
  RELEASE_TAG      — e.g. "v0.34.0"
  ANTHROPIC_API_KEY — Anthropic API key
  GITHUB_TOKEN     — GitHub token (read access to watchflare-io/watchflare)
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime

CHANGELOG_PATH = "src/content/docs/en/changelog.mdx"
WATCHFLARE_REPO = "watchflare-io/watchflare"

RELEASE_TAG = os.environ["RELEASE_TAG"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

SYSTEM_PROMPT = """\
You write user-facing changelog entries for Watchflare, a self-hosted host-monitoring \
solution. The audience is sysadmins and developers who operate Watchflare — write for them.
Watchflare has two components: the Hub (a single Go binary with embedded SvelteKit frontend) \
and Agents (lightweight binaries on monitored machines).

## What to include
Only changes that affect how operators use, configure, or operate Watchflare:
- New features and capabilities visible in the UI, API, or CLI
- Bug fixes that affected observable behaviour
- New config options, environment variables, or CLI flags
- Breaking changes that require operator action to upgrade

## What to exclude
- Internal refactors, dead code removal, unused imports, or code cleanup
- Minor UI styling or margin adjustments with no functional impact
- Dependency bumps that do not fix a security vulnerability
- Test, CI, or documentation changes
- Commits clearly labelled chore, refactor, style, test, or docs

## Format
Sections (include only those with items): **New features** · **Bug fixes** · **Breaking changes**
- New features:     - **Short name** — one sentence on what it does and why it matters to operators
- Bug fixes:        - Fixed/Added/Updated … (no bold name, capitalised verb, concise)
- Breaking changes: - Plain sentence on what changed and how to migrate; backtick renamed identifiers
- Merge related commits into a single entry when they describe the same fix or feature
- Wrap in backticks only identifiers that appear verbatim in the source: config keys, env vars, \
file paths, CLI flags, metric names

## Non-negotiable rules
- Use ONLY information explicitly written in the provided release notes and commits.
- Do not infer, extrapolate, assume, or complete any detail not stated verbatim in the source.
- Do NOT invent any identifier (metric names, CVE numbers, function names, file paths) \
unless it appears word-for-word in the source.
- Do NOT include the version header — it is added automatically.
- Output ONLY the Markdown lines. No code fences, no explanation, no preamble.\
"""


def http(url, *, method="GET", body=None, headers=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} — {url}\n{e.read().decode()}", file=sys.stderr)
        raise


def github(path):
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return http(f"https://api.github.com{path}", headers=headers)


def claude(system, user):
    resp = http(
        "https://api.anthropic.com/v1/messages",
        method="POST",
        body={
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 2048,
            "temperature": 0,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        },
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
    )
    if "content" not in resp or not resp["content"]:
        raise RuntimeError(f"Unexpected Anthropic response: {resp}")
    text = resp["content"][0]["text"].strip()
    # Strip any code fences the model may have added despite instructions
    text = re.sub(r"^```[a-z]*\n?", "", text)
    text = re.sub(r"\n?```$", "", text)
    return text.strip()


def fetch_release(tag):
    return github(f"/repos/{WATCHFLARE_REPO}/releases/tags/{tag}")


def fetch_previous_tag(current_tag):
    releases = github(f"/repos/{WATCHFLARE_REPO}/releases?per_page=20")
    tags = [r["tag_name"] for r in releases]
    try:
        idx = tags.index(current_tag)
        return tags[idx + 1] if idx + 1 < len(tags) else None
    except ValueError:
        return None


def fetch_commits(base_tag, head_tag):
    data = github(f"/repos/{WATCHFLARE_REPO}/compare/{base_tag}...{head_tag}")
    # First line of each commit message only, skip merge commits
    messages = []
    for c in data.get("commits", []):
        line = c["commit"]["message"].split("\n")[0].strip()
        if not line.startswith("Merge"):
            messages.append(line)
    return messages


def extract_style_examples(content, n=3):
    sections = re.split(r"\n---\n", content)
    examples = [s.strip() for s in sections if re.match(r"^## v\d+", s.strip())]
    return "\n\n---\n\n".join(examples[:n])


def insert_entry(content, new_entry):
    match = re.search(r"\n---\n\n## v", content)
    if match:
        pos = match.start()
        return content[:pos] + f"\n\n---\n\n{new_entry}\n" + content[pos:]
    return content.rstrip() + f"\n\n---\n\n{new_entry}\n"


def format_date(iso_date):
    return datetime.fromisoformat(iso_date.replace("Z", "+00:00")).strftime("%Y-%m-%d")


def main():
    print(f"Fetching release {RELEASE_TAG}…")
    release = fetch_release(RELEASE_TAG)

    tag = release["tag_name"]
    date = format_date(release["published_at"])
    body = (release.get("body") or "").strip()

    if not body:
        print("Release has no body — nothing to generate.", file=sys.stderr)
        sys.exit(1)

    print("Fetching commits…")
    previous_tag = fetch_previous_tag(tag)
    commits = fetch_commits(previous_tag, tag) if previous_tag else []
    if commits:
        print(f"  {len(commits)} commits since {previous_tag}")
    else:
        print("  No previous tag found, skipping commits")

    print(f"Reading {CHANGELOG_PATH}…")
    with open(CHANGELOG_PATH) as f:
        content = f.read()

    style_examples = extract_style_examples(content)

    commits_section = (
        "Commit messages (verbatim, for additional context):\n"
        + "\n".join(f"- {m}" for m in commits)
        if commits
        else ""
    )

    print("Calling Claude…")
    generated = claude(
        system=SYSTEM_PROMPT,
        user=(
            "Style reference — recent entries from our docs changelog:\n\n"
            f"---\n{style_examples}\n---\n\n"
            f"Generate the content for release **{tag}** ({date}).\n\n"
            f"GitHub release notes:\n\n{body}"
            + (f"\n\n{commits_section}" if commits_section else "")
        ),
    )

    entry = f"## {tag} — {date}\n\n{generated}"
    updated = insert_entry(content, entry)

    with open(CHANGELOG_PATH, "w") as f:
        f.write(updated)

    print(f"✓ Inserted entry for {tag}")

    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"tag={tag}\n")


if __name__ == "__main__":
    main()
