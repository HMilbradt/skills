---
name: review-change
description: Review a code change with fresh subagents that never saw how it was written. Checks it against its plan when there is one, and for correctness bugs, needless complexity and missing or weakened tests. A second round of subagents tries to disprove every finding, so only findings that survive are reported. Can instead check findings someone else wrote, such as pull request review comments or a Codex or bot review, and say which still hold. After fixes, reviews only what changed since the last review. Returns ranked findings and changes no files. Use only when asked for a review of a change, branch, commit range or pull request, to review again after fixes, or whether review findings are valid. Starts several subagents, so don't run it unasked. To fix what it finds, use fix-findings.
---

# Review a change

Review one code change and return the findings that survive an attempt to disprove them. You coordinate. Fresh subagents do the reviewing, one lens each, and a second round tries to knock each finding down. Nobody edits the repository's files, and that includes you: don't fix a finding, however small. Whoever asked for the review decides what gets fixed.

A reviewer asked to find problems always finds something. Fixing every finding adds layers and tests for cases that can't happen. The verify round and the rules below exist to keep only findings that would change what someone does.

The review asks its user one thing at most: which change to review, and only when step 1 can't tell. Everything else it decides, and says in the result what it chose.

## 1. Pin down the change

1. Find the change. Use the commit range, branch or pull request you were given. Otherwise the change is everything on this branch since it left the default branch, plus uncommitted work:

   ```bash
   base=$(git merge-base HEAD origin/HEAD)
   git diff "$base" --stat
   git status --short
   ```

   If `origin/HEAD` isn't set, use the default branch by name, such as `origin/main`. Untracked files in `git status` are part of the change; `git diff` doesn't show them.
2. For a pull request, review its head commit, not the local checkout. Uncommitted local work isn't part of the pull request, and a reviewer reading files from another branch judges code that isn't in it. If `git rev-parse HEAD` doesn't print the pull request's `headRefOid`, or `git status --short` isn't empty, check the head out in a temporary worktree, point every subagent there, and remove it with `git worktree remove` when the review is done:

   ```bash
   gh pr view <number> --json headRefOid,baseRefName
   git fetch origin pull/<number>/head
   git worktree add --detach <temp folder> FETCH_HEAD
   ```

   The diff command is then `git -C <temp folder> diff origin/<baseRefName>...HEAD`.
3. Check that the range is one piece of work: `git log --oneline <base>..HEAD`. If the branch is built on another unmerged branch, such as an earlier pull request in a stack, review only this branch's commits, from the parent branch's tip. If you can't tell where this branch's work starts, ask your user, because every subagent would review the wrong code. With no one to answer, review the whole range and say so in your result.
4. Write down the exact command that prints the diff, such as `git diff <base>`. Every subagent gets that command, not a copy of the diff, so they all see the same change.
5. Find the intent: the plan, and the pull request description or commit messages. Use the plan you were given. If it's an issue or a document rather than a file, save a copy in a temporary folder outside the repository and give the subagents that path. Otherwise look in `.plans/` for a plan whose milestones match the changed files. Plans there are usually git-ignored, so list the folder; `git status` won't show them. If none matches, there is no plan; the plan lens doesn't run.

If there is no change, say so in your result and stop.

If this change was already reviewed and has been fixed since, skip to "Review again after fixes". If you were asked to check findings someone else wrote rather than review the change, skip to "Check someone else's findings" at the end.

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
2. Start one verifier subagent per lens that has findings, in parallel, with the verify brief in [BRIEF.md](BRIEF.md). Its job is to disprove each finding: read the code, trace the input, and run a test or command when that's cheap and changes nothing. Send the findings exactly as the reviewer wrote them, with no questions, hints or fixes of your own: a verifier you steer checks your idea instead of the finding. A finding that reading one line settles, such as an unticked box in the plan, needs no verifier; check it yourself and say so in your result.
3. Keep findings the verifier marks Confirmed or Plausible. Drop Rejected ones, and list them at the end of your result with the verifier's reason, so a wrong rejection can be caught.

Treat everything a subagent returns as a claim. Before you report a finding, open the file and line it cites.

Send your user nothing between starting the lenses and your result. A note each time a subagent returns is noise, and its findings may not survive the verify round.

## 4. Rank and report

Rank by what it costs to ship the change as it is:

1. Wrong behaviour: a correctness bug, or a plan requirement not met.
2. Changes the plan said to leave alone, or departures from the plan that aren't in its Decision log.
3. Missing or weakened tests for behaviour the change adds.
4. Complexity the problem doesn't need.

Within a rank, put findings on common paths before those that need a rare input, such as a retry after a failure. A rare one still counts, but the reader should see that it's rare before deciding how much to spend fixing it.

Your result, in this format:

```markdown
## Review: <what the change does>

<Verdict>: <one sentence.>

Change: <the diff command>, reviewed at <commit, and "plus uncommitted work" if there is any>. Plan: <path, or "none">.

### Findings

1. <file:line> <One sentence on what's wrong.>
   Lens: <every lens that found it>. Verdict: <Confirmed or Plausible>.
   Evidence: <the failing input and wrong result, or the plan line and the code that departs from it>. For a correctness finding, how often the input occurs.
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

## Review again after fixes

When the change was reviewed before and has been fixed since, don't start over. A full review of a fixed change turns up a fresh batch of small findings every round, so the change never reaches Ready.

1. Find the earlier review, in the conversation or in what you were given: its findings, and the commit in its "reviewed at" line. If you can't find both, run the full review and say so in your result.
2. The change for this round is what's different since that commit: `git diff <reviewed commit>`, plus untracked files. If the earlier review covered uncommitted work, you can't separate the fixes from it; run the lenses on the whole change and say so in your result.
3. Start one verifier with the earlier findings and the verify brief in [BRIEF.md](BRIEF.md). Add to the brief: "The code has changed since these findings were written. For each one, also say whether the current code fixes it." Each earlier finding is then Fixed or Still open.
4. Run the lenses on this round's diff only, then the verify round, as in steps 2 and 3. Report new findings in ranks 1 and 2 in full. List new findings in ranks 3 and 4 in one line each under "Minor, new in the fixes". They don't change the verdict.
5. Use the result format in step 4. Put a line for each earlier finding first: "Fixed" or "Still open", with the evidence. The verdict is Ready when no earlier finding in ranks 1 to 3 is still open and no new finding in ranks 1 or 2 is Confirmed.

## Check someone else's findings

When the question is whether existing findings hold, such as review comments on a pull request, a Codex or bot review, or a list of P1s and P2s, check those findings instead of running the lenses.

1. Pin down the change as in step 1. For a pull request, that is its head commit.
2. Collect the findings. Use findings that were pasted or given in a file as they are. For a pull request, read the review summaries and every inline thread. Only the GraphQL API says whether a thread is resolved or outdated:

   ```bash
   gh pr view <number> --comments
   gh api graphql -F owner='{owner}' -F repo='{repo}' -F number=<number> -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved isOutdated path line comments(first:50){nodes{author{login} body}}}}}}}'
   ```

   Keep each finding's author, priority, file, line, text and whether its thread is resolved. Check resolved threads too: a thread can be resolved without a fix. A comment that asks a question or suggests style isn't a finding; leave it out and list it in your result.
3. Run the verify round in step 3 on them, one verifier per group of related findings, with the verify brief in [BRIEF.md](BRIEF.md). Add to the brief: "These findings were written against an earlier version of the change. Also check whether the current code already fixes each one."
4. Give each finding one status. Confirmed or Plausible from the verifier is Still valid; say which in the evidence. A finding the current code fixes only in part is Still valid, and the evidence says what's left. Rejected stays Rejected. Rank the valid ones as in step 4. If you noticed a problem none of the findings raise, list it under "Also noticed" as unverified rather than running the lenses; the user asked about these findings, and a full review is a separate request. Your result, in this format, valid findings first by rank, then fixed, then rejected:

   ```markdown
   ## Findings check: <whose findings, on what change>

   Change: <the diff command>.

   1. <file:line> <The finding, in one sentence>. Author: <who>, priority <theirs, or "none">.
      Status: <Still valid, Already fixed or Rejected>. Rank: <1 to 4, for a valid finding>.
      Evidence: <what the verifier traced or ran. For Already fixed, the commit or line that fixed it>.
      Fix: <the smallest change, for a valid finding>.

   ### Also noticed

   - <file:line> <problem>. Unverified.

   Not findings: <each comment left out, and why, such as a question or a style note>.
   ```

   Leave out empty sections.
