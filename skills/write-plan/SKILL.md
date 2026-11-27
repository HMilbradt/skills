---
name: write-plan
description: Plan a software change as a spec that someone with no context could build from, or challenge an existing plan. Asks what only the requester can decide, takes the simplest route, flags when the current design makes the change hard, and keeps the work to one pull request unless a slice has to ship first, with a check for every step. Use when asked to plan, spec or scope a feature, fix, refactor or migration, to write a design doc, to break work into pull requests, or before work that touches more than a few files. Also use for "challenge this plan", "is this overkill?" or "review my design", which returns a review instead of a plan. Writes the plan only; to build it use implement-plan, and to review code use review-change. For a question about how something works or whether it can be done, use explain-system or investigate first.
---

# Write a plan

Write a plan for one software change, save it, have it challenged, and return it. The plan is a change spec: someone with the repository and the plan, and nothing else, can build the change and know when it's done. Don't implement anything.

If you were asked to challenge an existing plan instead, see "Challenge an existing plan" at the end.

## Rules for every plan and review

- Requirements are what was asked. Anything else isn't a requirement until the requester says so. When a request gives a broad phrase with examples ("make the slow pages faster, like the dashboard"), the examples are the requirement; ask whether the broader reading is wanted. The reverse holds too: never move something the request names, even in passing ("or even updating the colors"), into Follow-ups or out of scope without asking. The requester decides what's cut.
- Take the simplest route. Reach in this order: change existing code, extend existing code, add a file, add a dependency, add an abstraction. Each step past the second needs a reason tied to the problem. No config flags, plugin points or generality for a future case.
- Keep what keeps the change safe. Tests for the change, error handling the problem needs, and a backup or rollback before touching stored data aren't extras.
- A decision is significant if it changes an interface someone else calls, changes stored data, changes behaviour a user would notice, or is hard to unwind. If unsure, it's significant. Everything else is reversible: pick and move on.
- Never invent. Name a file, function, command or config key only after finding it in the repository. Look up outside facts (library APIs, versions, service limits) in their docs. List one under Assumptions only if you couldn't reach the docs.
- Find out why before calling code a mistake. Read its history, comments and callers. Code that looks wrong is sometimes holding something up.

## Write for a reader with no context

The implementer may be a fresh agent or a teammate who never saw the conversation.

- Use exact names, paths from the repository root, and the directory each command runs in.
- Define each term once, in plain words, and use that one name after.
- Copy decisions, answers and facts into the plan. "As discussed" means nothing to someone who wasn't there.
- Give every step a check. "Update the handler" is not a step. "In `handleRefund` in `billing/refund.go`, return `ErrAlreadyRefunded` when `refunded_at` is set. Check: `go test ./billing -run Refund` passes" is.
- Prescribe the contract: signatures, schemas, error cases, behaviour. Write out code only where the obvious version is wrong.

## How to plan

1. Write the problem and the intent (what's true once it ships) in a sentence each, and list the stated requirements.
2. Plan against the code as it is on the default branch. Run `git fetch`, then `git rev-list --count HEAD..origin/HEAD`. If the count isn't 0, `git diff HEAD...origin/HEAD --stat` lists what moved; read those files with `git show origin/HEAD:<path>` where the change touches them. A plan written against a stale checkout sends the implementer into conflicts and a design that no longer fits. Then read the code the change touches and enough around it to know how it works: callers, data flow, tests, existing patterns. Look for something that already does the job. If the repository keeps a glossary (such as `GLOSSARY.md` or `CONTEXT.md`) or decision records (often `docs/adr/`), read the ones for this area: use the glossary's terms in the plan, and treat a recorded decision as settled unless the requester reopens it. Run the tests for the area the change touches once, so the plan's checks start from a known state. That need not be the whole suite, which can take a long time. If it fails or can't run here, say so in the plan and in your result rather than installing tools to make it run.
3. Ask about intent and scope if either is unclear, before designing. See "Ask questions".
4. Design the simplest change. If the current design is what makes it hard, see "When the current design is the problem".
5. Write down what changes and what stays the same, naming anything an implementer might be tempted to touch. Where existing behaviour could break as a side effect, give the check that shows it still works.
6. Record the alternatives you really weighed, including doing nothing, and why each lost.
7. Ask about each significant decision.
8. Split the work into milestones and write the steps. See "Milestones".
9. Write "Done when": behaviour a person can see, tied to each requirement.
10. Pre-mortem: imagine it shipped and failed. Put at most three causes specific to this change under "Risks and rollback".
11. Reread the plan as someone who never saw the conversation. Every name must resolve and every step must have a check.
12. Save it, then have it challenged. See "Save and challenge".

Write it in the format in [PLAN.md](PLAN.md). Read [EXAMPLES.md](EXAMPLES.md) before your first plan in a session.

## Ask questions

Ask the requester only what they can answer: intent, scope, behaviour users will see, significant decisions, and any wider change. Look up the rest. A choice the request already made ("on every push") is settled, and small choices it left open are yours.

In the first batch, also ask for anything the plan depends on that only the requester has: a reproduction, the id of an affected record, an account to test with. A fact you can check yourself isn't a question; look it up, or make checking it a step.

Answers already given count. If the conversation holds a `grill` result or an earlier interview, copy its settled decisions into the plan and don't ask them again. If the request is thin and the `grill` skill is available, use it for the questions and plan from its result.

Ask a few questions at a time, as early as you can. Offer options with your recommendation first and a line on each one's cost. Keep going until the answers add up to a plan, and copy each answer into it.

Before you return, ask every question that's still open, including any the challenge raised. A plan handed back as a draft with a list of questions makes the requester ask for each one.

Return a draft only when nobody can answer, as when you run as a subagent. Then don't stop and don't guess silently. List each question under "Open questions" with your recommended answer, finish the plan as if it's accepted, and mark the plan a draft.

## When the current design is the problem

Sometimes the change is hard because of how the code is built. Signs: the same edit is needed in several places; a flag or special case has to be threaded through unrelated code; the plan works around an abstraction or data model instead of through it; most steps are about getting around existing code.

If a small edit in each place fixes the problem and you'd recommend leaving the design alone, skip the write-up; a line under Alternatives considered is enough. Otherwise, write up the wider change and ask about it: what in the design causes the difficulty, the change that fixes it, what it would simplify, what it costs, and whether you'd do it first, later or not at all. Plan the simple route until the requester says yes. If they do, the wider change becomes its own milestone ahead of the feature, with existing tests passing before any behaviour changes. Either way, keep the write-up in the plan's "Wider change" section.

## Milestones

Each milestone ships as one pull request: a slice that leaves the system working, can be reviewed alone, and moves the goal forward.

Start from one milestone. Add a second only when a slice has to ship, or be checked in production, before the next can be built or trusted, or when the requester asks for the split. Give that reason in each extra milestone's first line. Size alone isn't a reason: every milestone costs the requester a build, a review and a merge, so a plan cut into many small ones is slower to ship than one larger pull request. If the requester asked for one pull request, the plan has one milestone.

- Get something working end to end early, then build on it.
- A refactor the requester agreed to goes in its own milestone ahead of behaviour changes.
- A milestone's steps and checks use only what exists today or what an earlier milestone builds. If one needs a later milestone's piece, move that piece earlier.
- If nobody knows whether an approach works, make the first milestone a throwaway spike, with what result means keep or discard.
- Each step is one change with a check. A new test fails before the change and passes after. When the change is itself a check or tool, show it catching a deliberate breakage. Steps are safe to rerun; say how to recover from one that fails halfway.
- Work that isn't code, such as running a migration on production data, a backfill or switching a flag on, goes right after the milestone that ships its code, under its own heading and Progress item. Give it steps, checks and a rollback, and say who runs it and that it waits for the requester's go-ahead. List every approval the plan needs, such as a merge, a deploy or production access, in one place under that heading, so the requester can grant them in one go. When a milestone only counts as finished once it's released and seen working in production, give that check its own Progress item too, so the milestone can be ticked as built while the release waits. Planning it is your job; running it isn't.
- Prefer a command check to a manual one. A check that needs a running app or a person clicking through says whether it must pass before the pull request merges.

## Save and challenge

1. Save the plan as `.plans/<short-name>.md` at the repository root. That is the default, so don't ask where to save. A plan there stays local and is never committed. If `.plans/` isn't ignored, add it to the local exclude file, then check that `git check-ignore .plans/<short-name>.md` prints the path:

   ```bash
   echo '.plans/' >> "$(git rev-parse --git-path info/exclude)"
   ```

2. Check the format and render the plan as a page. Run this from the repository root, with `<skill>` replaced by the path to this skill's folder:

   ```bash
   node <skill>/scripts/plan.mjs .plans/<short-name>.md
   ```

   It prints `Valid. Wrote .plans/<short-name>.html` and exits 0, or lists each problem as `file:line: problem` and exits 1. Fix every problem and run it again until it passes. Run it again after every later edit to the plan.
3. Start a subagent with nothing from the conversation. Give it the plan's path, the repository's location, the path to this skill's folder, and this instruction: read `SKILL.md` there and challenge the plan as "Challenge an existing plan" says; change no files. If you can't start a subagent, do the review yourself and say in your result that it wasn't independent.
4. Apply findings that hold up. Turn down any that add scope or contradict the requester's answers, and log why in the plan's "Decision log". A reviewer asked to find problems always finds something, and applying every finding makes a plan bigger, not better. If a finding changes scope or a significant decision, ask about it.
5. If the requester named another place for the plan, such as an issue, a shared document or a folder in the repository, put the finished plan there as well, laid out the way they asked. Then add a line at the top of the local file that says where the plan lives and that the local file is a copy, so whoever builds it keeps Progress in one place. If you can't write to that place, keep the local file as the plan and say so in your result.

## Challenge an existing plan

Follow [REVIEW.md](REVIEW.md) and return the review as your result. Don't rewrite the plan or start another reviewer. Read [REVIEW-EXAMPLES.md](REVIEW-EXAMPLES.md) before your first review in a session.

## Your result

For a plan, return this. For a challenge, the review is the result.

```markdown
Plan: <path, and the other place it was put if the requester named one>, <ready, or draft because nobody could answer the open questions>
Page: <path to the HTML page `scripts/plan.mjs` wrote>
Summary: <two sentences on what's true once this ships and the approach. Then each milestone's title on its own line, with the reason for any milestone after the first, and any step that touches stored data or production>
Review: <independent, or done by you because no subagent could start>. <What it found, what you applied, what you turned down.>
Open questions: <each with your recommended answer, or "None">
Not checked: <what the plan relies on that you couldn't run or read, or "None">
```
