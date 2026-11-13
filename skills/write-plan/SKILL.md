---
name: write-plan
description: Plan a software change as a spec that someone with no context could build from, or challenge an existing plan. Asks what only the requester can decide, takes the simplest route, flags when the current design makes the change hard, and splits the work into milestones that each ship as a pull request with a check for every step. A fresh reviewer challenges every plan before it's returned. Use when asked to plan, spec or scope a feature, fix, refactor or migration, to write a design doc, or before work that touches more than a few files. Also use for "challenge this plan", "is this overkill?" or "review my design", which returns a review instead of a plan. Never implements.
---

# Write a plan

Write a plan for one software change, save it locally, have it challenged, and return it. The plan is a change spec: someone with the repository and the plan, and nothing else, can build the change and know when it's done. Don't implement anything.

If you were asked to challenge an existing plan instead, see "Challenge an existing plan" at the end.

## Rules for every plan and review

- Requirements are what was asked. Anything else isn't a requirement until the requester says so. When a request gives a broad phrase with examples ("broken frontmatter, like a wrong name"), the examples are the requirement; ask whether the broader reading is wanted.
- Take the simplest route. Reach in this order: change existing code, extend existing code, add a file, add a dependency, add an abstraction. Each step past the second needs a reason tied to the problem. No config flags, plugin points or generality for a future case.
- Keep what keeps the change safe. Tests for the change, error handling the problem needs, and a backup or rollback before touching stored data aren't extras.
- A decision is significant if it changes an interface someone else calls, changes stored data, changes behaviour a user would notice, or is hard to unwind. If unsure, it's significant. Everything else is reversible: pick and move on.
- Never invent. Name a file, function, command or config key only after finding it in the repository. Check outside facts (library APIs, versions, service limits) against their docs, or list them under Assumptions.
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
2. Read the code the change touches and enough around it to know how it works: callers, data flow, tests, existing patterns. Look for something that already does the job.
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

Ask a few questions at a time, as early as you can. Offer options with your recommendation first and a line on each one's cost. Keep going until the answers add up to a plan, and copy each answer into it.

If nobody can answer, as when you run as a subagent, don't stop and don't guess silently. List each question under "Open questions" with your recommended answer, finish the plan as if it's accepted, and mark the plan a draft.

## When the current design is the problem

Sometimes the change is hard because of how the code is built. Signs: the same edit is needed in several places; a flag or special case has to be threaded through unrelated code; the plan works around an abstraction or data model instead of through it; most steps are about getting around existing code.

Then write up the wider change and ask about it: what in the design causes the difficulty, the change that fixes it, what it would simplify, what it costs, and whether you'd do it first, later or not at all. Plan the simple route until the requester says yes. If they do, the wider change becomes its own milestone ahead of the feature, with existing tests passing before any behaviour changes. Either way, keep the write-up in the plan's "Wider change" section.

## Milestones

Each milestone ships as one pull request: a slice that leaves the system working, can be reviewed alone, and moves the goal forward. A plan can have as many as it needs.

- Get something working end to end early, then build on it.
- Put refactors in their own milestone ahead of behaviour changes.
- If nobody knows whether an approach works, make the first milestone a throwaway spike, with what result means keep or discard.
- Each step is one change with a check. A new test fails before the change and passes after. Steps are safe to rerun; say how to recover from one that fails halfway.
- A small change is one milestone.

## Save and challenge

1. Save the plan where you were told, or as `.plans/<short-name>.md` at the repository root. Plans stay local and are never committed. If `.plans/` isn't ignored, add it to the local exclude file, then check that `git check-ignore .plans/<short-name>.md` prints the path:

   ```bash
   echo '.plans/' >> "$(git rev-parse --git-path info/exclude)"
   ```

2. Start a subagent with nothing from the conversation. Give it the plan's path, the repository's location, the path to this skill's folder, and this instruction: read `SKILL.md` there and challenge the plan as "Challenge an existing plan" says; change no files. If you can't start a subagent, do the review yourself and say in your result that it wasn't independent.
3. Apply findings that hold up. Turn down any that add scope or contradict the requester's answers, and log why in the plan's "Decision log". A reviewer asked to find problems always finds something, and applying every finding makes a plan bigger, not better. If a finding changes scope or a significant decision, ask about it.

Your result: the plan's path, the plan, then one line on what the review found and what you applied or turned down, and one on any open questions.

## Challenge an existing plan

Follow [REVIEW.md](REVIEW.md) and return the review as your result. Don't rewrite the plan or start another reviewer. Read [REVIEW-EXAMPLES.md](REVIEW-EXAMPLES.md) before your first review in a session.
