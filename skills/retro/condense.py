#!/usr/bin/env python3
"""Print a short digest of one agent session log.

Usage: python3 condense.py [--brief] <session.jsonl> [more.jsonl ...]
       python3 condense.py --list <folder> [more folders ...]

--list prints one line per session log under the folders, most recent first:
the time of its last message, how many messages the user typed, and its path.
--brief leaves out the agent's replies.

Reads a Claude Code or Codex session log (JSON lines) and prints the user's
messages, the agent's replies (clipped), skill loads, subagent starts, questions
asked, failed tool calls, interrupts and compactions. Tool output is left out.
"""
import json
import os
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
        t = d["timestamp"][:16]
        META["first"] = min(META.get("first", t), t)
        META["last"] = max(META.get("last", t), t)
    for k in ("cwd", "gitBranch"):
        if d.get(k):
            META[k] = d[k]
    msg = d.get("message") or {}
    when = (d.get("timestamp") or "")[:16]
    if d.get("subtype") == "compact_boundary":
        out.append(f"\n[compacted {when}]")
        return
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
                    out.append(f"  [tool error in: {call}] " + text(b.get("content")).strip()[:300])
            return
        s = re.sub(r"<system-reminder>.*?</system-reminder>", "", text(content), flags=re.S)
        if not s.strip() or d.get("isMeta"):
            return
        if d.get("isCompactSummary") or s.startswith("This session is being continued"):
            # Older logs have no boundary entry. The summary's own time is when it was
            # prepared, which can be hours early, so prefer the boundary's.
            if not (out and out[-1].startswith("\n[compacted")):
                out.append(f"\n[compacted {when}]")
            return
        if "[Request interrupted" in s:
            out.append("  [interrupted by user]")
            return
        if "<task-notification>" in s or "<agent-message" in s or "<side-sessions-event" in s:
            out.append("  [a subagent or background task reported back]")
            return
        cmd = re.search(r"<command-name>(.*?)</command-name>", s)
        if cmd or s.lstrip().startswith(("<local-command", "<bash-input", "<bash-stdout")):
            out.append(f"  [user ran {cmd.group(1) if cmd else 'a local command'}]")
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
    if d.get("type") == "session_meta":
        META["cwd"] = p.get("cwd")
        META["gitBranch"] = (p.get("git") or {}).get("branch")
    elif d.get("type") == "compacted":
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


def digest(path):
    out = []
    META.clear()
    CALLS.clear()
    for line in open(path, errors="replace"):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        (codex if "payload" in d else claude)(d, out)
        if "payload" in d and d.get("timestamp"):
            t = d["timestamp"][:16]
            META["first"] = min(META.get("first", t), t)
            META["last"] = max(META.get("last", t), t)
    return out, dict(META)


def count(out, start):
    return sum(1 for o in out if o.lstrip("\n").startswith(start))


def main():
    args = sys.argv[1:]
    usage = "Pass session log paths, such as ~/.claude/projects/<folder>/<id>.jsonl, or --list and one or more folders."
    if not args or args == ["--brief"] or args == ["--list"]:
        sys.exit(usage)
    if args[0] == "--list":
        rows = []
        for folder in args[1:]:
            for root, dirs, files in os.walk(folder):
                dirs[:] = [x for x in dirs if x != "subagents"]
                for f in files:
                    if f.endswith(".jsonl"):
                        out, meta = digest(os.path.join(root, f))
                        rows.append((meta.get("last", ""), count(out, "## USER"), os.path.join(root, f)))
        for last, users, path in sorted(rows, reverse=True):
            print(f"{last}  {users:4d} typed messages  {path}")
        return
    brief = args[0] == "--brief"
    for path in args[1:] if brief else args:
        try:
            out, meta = digest(path)
        except OSError as e:
            sys.exit(f"Can't read {path}: {e}")
        print(f"# SESSION {path}")
        if meta:
            print(f"# {meta.get('first')} to {meta.get('last')} UTC, in {meta.get('cwd')}, branch {meta.get('gitBranch')}")
        print(f"# typed messages {count(out, '## USER')}, interrupts {count(out, '  [interrupted')}, "
              f"tool errors {count(out, '  [tool error')}, compactions {count(out, '[compacted')}")
        if brief:
            out = [o for o in out if not o.startswith("\n# AGENT")]
        print("\n".join(out) if out else "(no user or agent messages found; is this a session log?)")


main()
