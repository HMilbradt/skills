---
name: review-change
description: Review a code change with fresh subagents that never saw how it was written. Checks it against its plan when there is one, and for correctness bugs, needless complexity and missing or weakened tests. A second round of subagents tries to disprove every finding, so only findings that survive are reported. Can instead check findings someone else wrote, such as pull request review comments or a Codex or bot review, and say which still hold. Returns ranked findings and changes no files. Run only when the user asks for a review of a change, branch, commit range or pull request, or asks whether review findings are valid.
disable-model-invocation: true
---

# Review a change

Review one code change and return the findings that survive an attempt to disprove them. You coordinate. Fresh subagents do the reviewing, one lens each, and a second round tries to knock each finding down. Nobody edits files.

A reviewer asked to find problems always finds something. Fixing every finding adds layers and tests for cases that can't happen. The verify round and the rules below exist to keep only findings that would change what someone does.

## 1. Pin down the change

1. Find the change. Use the commit range, branch or pull request you were given. Otherwise the change is everything on this branch since it left the default branch, plus uncommitted work:

   ```bash
   base=$(git merge-base HEAD origin/HEAD)
   git diff "$base" --stat
   git status --short
   ```

   If `origin/HEAD` isn't set, use the default branch by name, such as `origin/main`. Untracked files in `git status` are part of the change; `git diff` doesn't show them.
2. Write down the exact command that prints the diff, such as `git diff <base>`. Every subagent gets that command, not a copy of the diff, so they all see the same change.
3. Find the intent: the plan, and the pull request description or commit messages. Use the plan you were given. Otherwise look in `.plans/` for a plan whose milestones match the changed files. Plans there are usually git-ignored, so list the folder; `git status` won't show them. If none matches, there is no plan; the plan lens doesn't run.

If there is no change, say so in your result and stop.

If you were asked to check findings someone else wrote rather than review the change, skip to "Check someone else's findings" at the end.

## 2. Run the lenses

Each lens is one question asked of the change. [LENSES.md](LENSES.md) defines them:

| Lens | Asks | Runs |
| :- | :- | :- |
| Plan | Does the change do what the plan says, and only that? | Only when there's a plan |
| Correctness | What input makes this code do the wrong thing? | Always |
| Simplicity | What could go and still solve the problem? | Always |
| Tests | Would the tests catch this change breaking? | Always |

Start one subagent per lens, in parallel, with the brief in [BRIEF.md](BRIEF.md) filled in. Give each one nothing from the conversation: a reviewer that saw the reasoning behind the code is swayed by it. If the diff is only a few lines, one subagent can take every lens.

If you can't start subagents, run each lens yourself, one at a time, starting each with a fresh read of the diff. Say in your result that the review wasn't independent.

## 3. Verify every finding

1. Merge the findings. Where several lenses report the same problem, keep it once, at the highest rank any of them gives it (see step 4), and record every lens that found it. Agreement between lenses is evidence. Where their fixes differ, the plan decides; give the other fix as the alternative.
2. Start one verifier subagent per lens that has findings, in parallel, with the verify brief in [BRIEF.md](BRIEF.md). Its job is to disprove each finding: read the code, trace the input, and run a test or command when that's cheap and changes nothing.
3. Keep findings the verifier marks Confirmed or Plausible. Drop Rejected ones, and list them at the end of your result with the verifier's reason, so a wrong rejection can be caught.

Treat everything a subagent returns as a claim. Before you report a finding, open the file and line it cites.

## 4. Rank and report

Rank by what it costs to ship the change as it is:

1. Wrong behaviour: a correctness bug, or a plan requirement not met.
2. Changes the plan said to leave alone, or departures from the plan that aren't in its Decision log.
3. Missing or weakened tests for behaviour the change adds.
4. Complexity the problem doesn't need.

Your result, in this format:

```markdown
## Review: <what the change does>

<Verdict>: <one sentence.>

Change: <the diff command>. Plan: <path, or "none">.

### Findings

1. <file:line> <One sentence on what's wrong.>
   Lens: <every lens that found it>. Verdict: <Confirmed or Plausible>.
   Evidence: <the failing input and wrong result, or the plan line and the code that departs from it>.
   Fix: <the smallest change that resolves it>.

### Rejected

- <finding>: <why the verifier rejected it>.

### Not checked

<Lenses that didn't run and why, and anything a subagent couldn't read or run.>
```

| Verdict | Use it when |
| :- | :- |
| Ready | No Confirmed finding in ranks 1 to 3. |
| Fix first | A Confirmed finding in ranks 1 to 3. |
| Rethink | The change solves a different problem than its plan or description, or can't work. |

Leave out empty sections. A change with no surviving findings gets one line: "Ready: <why>." Read [EXAMPLES.md](EXAMPLES.md) before your first review in a session.

## Check someone else's findings

When the question is whether existing findings hold, such as review comments on a pull request, a Codex or bot review, or a list of P1s and P2s, check those findings instead of running the lenses.

1. Pin down the change as in step 1, using the pull request's head.
2. Collect the findings. For a pull request, read both kinds of comment, and note whether each thread is resolved:

   ```bash
   gh pr view <number> --comments
   gh api repos/{owner}/{repo}/pulls/<number>/comments --paginate
   ```

   Keep each finding's author, file, line and text. A comment that asks a question or suggests style isn't a finding; leave it out and say so.
3. Run the verify round in step 3 on them, one verifier per group of related findings, with the verify brief in [BRIEF.md](BRIEF.md). Add to the brief: "These findings were written against an earlier version of the change. Also check whether the current code already fixes each one."
4. Report each finding as one of: Still valid, Already fixed (with the commit or line that fixed it), or Rejected (with the reason). Rank the valid ones as in step 4, keeping the author's priority next to yours where they differ.
