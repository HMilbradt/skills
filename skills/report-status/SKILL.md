---
name: report-status
description: Answer a status question with a short, checked list of what's done, what's left and what's blocked, without starting any work. Covers the work in this session, a branch or stack of pull requests, a plan's milestones, or a project in the issue tracker. Use when asked "what's left?", "where are we?", "what's done and what isn't?", "anything left from this batch?" or "is X actually done?".
---

# Report status

Answer a status question with a short list of what's done, what's left and what's blocked, and stop. A status question is not a go-ahead: don't start, fix or finish anything, even something small.

## 1. Find what the question covers

Use the scope the question names: this session's work, a branch, a set of pull requests, a plan, a tracker project. If it names none, the scope is the work in this session, or, in a fresh session, the current branch and its plan in `.plans/`.

List the items in scope from their source: the request that started the work, the plan's milestones and Progress section, the tracker's issues, or the pull requests in the stack. List them at the level someone would act on: a plan's steps rather than its one milestone, each pull request in a stack.

## 2. Check each item

Done means shown done, not written. Check each item against evidence you can see now:

- Merged: the pull request's state, or the commit on the default branch.
- Passing: the latest check run or test output, not an earlier one.
- Shipped: the deploy, release or tracker state that says so.

```bash
git status --short
git log --oneline origin/HEAD..HEAD
gh pr status
gh pr checks <number>
```

If a source isn't reachable, such as no GitHub remote or no tracker access, use what you can see locally and say which source you couldn't reach. Run checks that change nothing in the repository; if proving an item would mean editing files, it's "Not verified".

An item with no evidence either way is "Not verified", not "Done". Work that exists but departs from what the plan or request asked for goes under "Done differently", with the difference, so the reader can decide which is right.

## 3. Report

Use this format and nothing else. Leave out empty sections.

```markdown
Done:
- <item>: <the evidence, such as "merged in #482" or "tests pass on abc1234">

Done differently:
- <item>: <what was asked, and what was done instead>

Left:
- <item>: <what remains>

Blocked:
- <item>: <on what or whom>

Not verified:
- <item>: <what you couldn't check>
```

- Name each item in full, so it makes sense to someone who doesn't remember the conversation: "the refund double-click fix (#482)", not "the fix".
- One line per item; split an item rather than cram several facts into one line. No preamble, no summary, no offer to start the next thing.
- If everything is done and verified, the whole answer is one line saying so, with the evidence.
