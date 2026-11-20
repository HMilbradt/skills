---
name: report-status
description: Answer a status question with a short, checked list of what's done, what's in progress, what's not done and what's blocked, without starting any work. Covers the work in this session, a branch or stack of pull requests, a plan's milestones, or a project in the issue tracker. Use when asked "what's left?", "what's next?", "how many milestones are left?", "where are we?", "what's done and what isn't?", "how's this going?", "is this ready to merge?", "anything left from this batch?" or "is X actually done?". Reports only; it doesn't finish the work or write an update for other people.
---

# Report status

Answer a status question with a short list of what's done, what's in progress, what's not done and what's blocked, and stop. A status question is not a go-ahead: don't start, fix or finish anything, even something small.

## 1. Find what the question covers

Use the scope the question names: this session's work, a branch, a set of pull requests, a plan, a tracker project. If it names none, the scope is the work in this session, or, in a fresh session, the current branch and its plan in `.plans/`. Don't ask which scope is meant; take that default and name it in the report.

List the items in scope from their source: the request that started the work, the plan's milestones and steps, the tracker's issues, or the pull requests in the stack. List them at the level someone would act on: a plan's steps rather than its one milestone, each pull request in a stack.

## 2. Check each item

Done means shown done, not written. A ticked box in a plan's Progress section, a "Done" state in the tracker or a summary from earlier in the session is a claim, so check it like any other. Check each item against evidence you can see now:

- Merged: the pull request's state, or the commit on the default branch.
- Passing: a test or check run you can see now, not an earlier one. Run the narrowest test that covers the item.
- Built as asked: the code does what the plan step or request says, read against its exact wording.
- Ready to merge: the pull request's checks pass on its head commit, and no review comment on it, from a person or a review bot, is unanswered. Read the comments; a green check doesn't cover them.
- Shipped: the deploy, release or tracker state that says so.

```bash
git status --short
git log --oneline @{upstream}..HEAD
gh pr status
gh pr checks <number>
```

`@{upstream}` fails on a branch with no upstream, and `gh` fails with no GitHub remote. Then use what you can see locally and name the source you couldn't reach in that item's line. Run only checks that change nothing in the repository; if proving an item would mean editing files, it's "Not verified".

Sort each item into one section:

- Done: shown done by evidence above, committed, and built as asked. If its commit shows in the `@{upstream}..HEAD` output, it isn't pushed; say so in its line.
- Done differently: the work exists but departs from what the plan or request asked for. Give the difference, so the reader can decide which is right.
- In progress: an AI agent is running it right now, such as a subagent, background task or other agent session that hasn't finished. Find these from the tools that list running agents, tasks and sessions, not from the plan or the tracker.
- Not done: unfinished work that no agent is running, however far along it is. Uncommitted changes and failing tests land here.
- Blocked: it can't move until something or someone else acts.
- Not verified: no evidence either way.

## 3. Report

Use this format and nothing else. Leave out empty sections. Add the "Scope" line only when you chose the scope yourself.

```markdown
Scope: <what you checked, such as "the CSV export plan on branch csv-export">

Done:
- <item>: <the evidence, such as "merged in #482" or "tests pass on abc1234">

Done differently:
- <item>: <what was asked, and what was done instead>

In progress:
- <item>: <which agent, what it's doing, and what it will hand back>

Not done:
- <item>: <what remains>

Blocked:
- <item>: <on what or whom>

Not verified:
- <item>: <what you couldn't check>
```

- Name each item in full, so it makes sense to someone who doesn't remember the conversation: "the refund double-click fix (#482)", not "the fix".
- One line per item; split an item rather than cram several facts into one line. No preamble, no summary, no offer to start the next thing.
- If the question asks about one item ("is X actually done?"), answer yes or no in the first line, with the evidence, then list only what's wrong with it.
- If everything is done and verified, the whole answer is one line saying so, with the evidence.
