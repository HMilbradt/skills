#!/usr/bin/env python3
"""Print a short digest of one agent session log.

Usage: python3 condense.py <session.jsonl> [more.jsonl ...]

Reads a Claude Code or Codex session log (JSON lines) and prints the user's
messages, the agent's replies (clipped), skill loads, subagent starts, questions
asked, failed tool calls, interrupts and compactions. Tool output is left out.
"""
import json
import re
import sys


def clip(s, n):
    s = (s or "").strip()
    return s if len(s) <= n else s[: n * 2 // 3] + "\n[...]\n" + s[-n // 3 :]


def text(content):
    if isinstance(content, str):
        return content
    return "\n".join(
        b.get("text", "") for b in content or [] if isinstance(b, dict) and "text" in b
    )


CALLS = {}  # tool call id -> short description, for naming failed calls and answered questions
META = {}


def claude(d, out):
    if d.get("isSidechain"):
        return
    if d.get("timestamp"):
        META.setdefault("first", d["timestamp"][:16])
        META["last"] = d["timestamp"][:16]
    for k in ("cwd", "gitBranch"):
        if d.get(k):
            META[k] = d[k]
    msg = d.get("message") or {}
    when = (d.get("timestamp") or "")[:16]
    if d.get("type") == "user":
        content = msg.get("content")
        if isinstance(content, list) and any(
            isinstance(b, dict) and b.get("type") == "tool_result" for b in content
        ):
            for b in content:
                if not isinstance(b, dict):
                    continue
                call = CALLS.get(b.get("tool_use_id"), "")
                if call.startswith("asked"):
                    out.append("  [answered] " + clip(text(b.get("content")), 300))
                elif b.get("is_error"):
                    out.append(f"  [tool error in: {call}] " + clip(text(b.get("content")), 200))
            return
        s = re.sub(r"<system-reminder>.*?</system-reminder>", "", text(content), flags=re.S)
        if not s.strip() or d.get("isMeta"):
            return
        if d.get("isCompactSummary") or s.startswith("This session is being continued"):
            out.append(f"\n[compacted {when}]")
            return
        if "[Request interrupted" in s:
            out.append("  [interrupted by user]")
            return
        if "<task-notification>" in s or "<agent-message" in s:
            out.append("  [a subagent or background task reported back]")
            return
        out.append(f"\n## USER {when}\n{clip(s, 1500)}")
    elif d.get("type") == "assistant":
        for b in msg.get("content") or []:
            if not isinstance(b, dict):
                continue
            if b.get("type") == "text" and b.get("text", "").strip():
                out.append("\n# AGENT\n" + clip(b["text"], 900))
            elif b.get("type") == "tool_use":
                name, arg = b.get("name"), b.get("input") or {}
                what = str(arg.get("command") or arg.get("file_path") or arg.get("description") or "")
                CALLS[b.get("id")] = "asked" if name == "AskUserQuestion" else clip(f"{name} {what}", 100)
                read = re.search(r"skills/([\w-]+)/SKILL\.md", what) if name in ("Read", "Bash") else None
                if read:
                    out.append(f"  [skill file read: {read.group(1)}]")
                if name == "Skill":
                    out.append(f"  [skill {arg.get('skill')}]")
                elif name in ("Agent", "Task"):
                    out.append(f"  [subagent: {arg.get('description')}]")
                elif name == "AskUserQuestion":
                    out.append(f"  [asked: {[q.get('question') for q in arg.get('questions', [])]}]")


def codex(d, out):
    p = d.get("payload") or {}
    when = (d.get("timestamp") or "")[:16]
    if d.get("type") == "compacted":
        out.append(f"\n[compacted {when}]")
    elif d.get("type") == "event_msg" and p.get("type") == "turn_aborted":
        out.append("  [interrupted by user]")
    elif d.get("type") == "response_item":
        if p.get("type") == "message" and p.get("role") in ("user", "assistant"):
            s = text(p.get("content"))
            if p["role"] == "assistant":
                if s.strip():
                    out.append("\n# AGENT\n" + clip(s, 900))
            elif not s.lstrip().startswith(("<environment_context", "<user_instructions", "<turn_aborted", "<permissions", "# AGENTS.md")):
                out.append(f"\n## USER {when}\n{clip(s, 300 if '<skill>' in s else 1500)}")
        elif p.get("type") in ("function_call", "custom_tool_call"):
            m = re.search(r"skills/([\w-]+)/SKILL\.md", str(p.get("arguments") or p.get("input") or ""))
            if m:
                out.append(f"  [skill {m.group(1)}]")


def main():
    if len(sys.argv) < 2:
        sys.exit("Pass one or more session log paths, such as ~/.claude/projects/<folder>/<id>.jsonl")
    for path in sys.argv[1:]:
        out = []
        try:
            lines = open(path, errors="replace")
        except OSError as e:
            sys.exit(f"Can't read {path}: {e}")
        for line in lines:
            try:
                d = json.loads(line)
            except ValueError:
                continue
            (codex if "payload" in d else claude)(d, out)
        print(f"# SESSION {path}")
        if META:
            print(f"# {META.get('first')} to {META.get('last')} UTC, in {META.get('cwd')}, branch {META.get('gitBranch')}")
        META.clear()
        CALLS.clear()
        print("\n".join(out) if out else "(no user or agent messages found; is this a session log?)")


main()
