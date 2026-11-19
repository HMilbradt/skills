---
name: fix-findings
description: Fix the findings from a code review, each with the smallest change that resolves it, using the plan as the source of truth when there is one. Runs a check for each fix, turns down findings that are wrong or that add scope, and records both in the plan. Use when asked to fix review findings, such as "fix these", "fix all 8 issues according to the plan" or "address the review comments", after a review-change result, a pull request review or a bot review. Doesn't review the change (use review-change) or commit.
---

# Fix findings

Fix the findings of a code review, one small change each, and return what you fixed and what you didn't. When there's a plan, it decides what right looks like. Don't review the change again.

A fix is where a reviewed change grows: each finding invites a new guard, fallback or helper, and the next review then finds problems in those. Keep every fix smaller than the finding that asked for it.

## 1. Collect the findings and the plan

1. Use the findings you were given, or the most recent review in the conversation. From a `review-change` result, take what's under "Findings" and leave "Rejected" alone. If the request names some of them ("fix 1 to 3"), take only those. If you can't find any findings, stop and say so in your result.
2. Find the plan: the one you were given, the one on the review's "Plan" line, or the plan in `.plans/` at the repository root whose milestones match the changed files. Read all of it. Its Changes, Stays the same and Decision log bind a fix as much as they bound the change. With no plan, the request and the pull request description are the intent.
3. Check each finding that nobody verified, such as a pull request comment or a bot review, before you fix it: open the file and line it cites and trace its evidence. A finding that's wrong, or that the code already fixes, goes under "Not fixed" with what you saw. Findings marked Confirmed by `review-change` skip this step.

## 2. Fix each finding

Take the findings in the order the review ranked them. For each one:

1. Make the smallest change that resolves it, where the problem is. Start from the finding's "Fix" line and read it against the plan. Where they differ, follow the plan.
2. For wrong behaviour, add a test that fails before the fix and passes after, unless a test that exists already does. Run it and note the result.
3. If two attempts fail, leave the finding, undo the attempts and report it under "Not fixed".

Hold every fix to these rules:

- Add no abstraction, flag, retry or fallback unless the finding can't be resolved without it. Say why in your result when you add one.
- A fix that would change an interface, stored data, behaviour a user would see, a decision the plan records, or code the plan says stays the same is no longer a small fix. Ask your user, with the options and your recommendation. If no one can answer, as when you run as a subagent, leave the finding and report it under "Needs a decision".
- Fix only what was reported. A problem you notice on the way goes under "Also noticed".
- Never weaken or delete a test to make a fix pass.

## 3. Check and record

1. Run the Proof commands of the plan's milestone, or with no plan, the repository's tests and lint for the files you changed.
2. In the plan's Decision log, add a line for each finding you turned down and each fix that departs from the plan, with the reason. The next review reads the log, so a finding recorded there isn't raised again. Write to the plan where it lives; if its first lines say the local file is a copy, that's the place they name.

## Your result

```markdown
Findings: <where they came from>, plan <path, link or "none">

Fixed:
- <finding>: <the change, as file:line, and the check with its result>

Not fixed:
- <finding>: <why: wrong, already fixed, or two attempts failed, with the evidence>

Needs a decision:
- <finding>: <the options and your recommendation>

Also noticed:
- <file:line> <problem nobody reported>

Checks: <each command and its result>
Not verified: <checks you couldn't run, and why>
Changed files: <list>
```

Leave out empty sections.
