---
name: write-plan
description: Write a plan for a software change that someone with no context could follow and get right. Asks the questions only the requester can answer, then writes the plan as a change spec. It says why the change is made, what changes and what stays the same, the alternatives rejected, and milestones that each ship as their own pull request with a check for every step. Takes the simplest route, and asks before taking on a wider change when the current design is what makes the work hard. Use when asked to plan, spec or scope a feature, fix, refactor or migration, to write an implementation plan or design doc, or before starting work that touches more than a few files. Writes the plan only. To review a plan someone else wrote, use challenge-plan.
---

# Write a plan

Write a plan for one software change, save it to a local file, and return it. Treat the plan as a change spec: a reader who has the repository and this plan, and nothing else, can build the change and know when it is done. Take the simplest route that solves the problem. Ask the person who asked for the change about anything only they can decide, including whether to take on a wider change.

The plan is the whole result. Don't start implementing.

Read [PLAN.md](PLAN.md) for the format before you write. Read [EXAMPLES.md](EXAMPLES.md) before your first plan in a session.

## Write for a reader with no context

The implementer may be a fresh agent, a teammate next week, or you after the conversation is gone. They haven't seen the conversation, the files you read, or the options you weighed. Write for them.

- Name every file, function, type, table, command and config key by its exact name, and only after you've found it in the repository. Give paths from the repository root, and the directory each command runs in. A plan that names something that doesn't exist sends the implementer off course on step one.
- Define each term the first time it appears, in plain words, and use that one name for it every time after.
- Copy decisions, answers and facts into the plan. "As discussed", "the approach above" and links to the conversation mean nothing to someone who wasn't there.
- Say what each step changes and how to check it worked. "Update the handler" is not a step. "In `handleRefund` in `billing/refund.go`, return `ErrAlreadyRefunded` when the order's `refunded_at` is set. Check: `go test ./billing -run Refund` passes, including the new case" is.
- Prescribe the what, the where and the contract. Give exact signatures, schemas, error cases and behaviour. Leave out code the implementer would write the same way without you; write it out only where the obvious version is wrong.

## How to plan

1. Write the problem in one sentence and the intent in one more: what is true for the user or the system once the change ships. List the requirements that were stated. Anything else is not a requirement until the person who asked says so. Where the request uses a broad phrase and gives examples ("broken frontmatter, like a wrong name"), take the examples as the requirement, plus what they need to work, and ask whether the broader reading is wanted.
2. Read the code the change touches, and enough around it to know how it works today: callers, data flow, tests, and the patterns the code already follows. Look for something that already does the job. Record what you learned as facts with paths in the plan's Context section.
3. If the intent or scope is unclear, ask now, before you design anything. See "Ask questions" below.
4. Find the simplest change that solves the stated problem. Reach in this order: change existing code, extend existing code, add a file, add a dependency, add an abstraction. Each step past the second needs a one-line reason tied to the problem.
5. Check whether the current design makes the change hard. See "When the current design is the problem" below.
6. Write down what changes and what doesn't. Name the code, behaviour and data that stay as they are, especially anything an implementer might be tempted to touch: a nearby bug, a messy function, a related feature. Where existing behaviour could break as a side effect, give the check that shows it still works.
7. Record each alternative you really considered and why you didn't pick it, including doing nothing and what that costs. Only list options you weighed; a list padded with straw men hides the real trade-off.
8. Sort the decisions. A decision is significant if it changes an interface someone else calls, changes stored data, changes behaviour a user would notice, or would be hard to unwind. Ask about each significant one. Give each reversible one a pick and move on.
9. Split the work into milestones. See "Split the work into milestones" below.
10. Write the steps inside each milestone. Each step is one change, with a check: a command and its expected output, a test that passes, or something the implementer can see. Where a step adds a test, say that it fails before the change and passes after. Make steps safe to run twice, and say how to recover from one that fails halfway.
11. Write the acceptance checks for the whole change: what someone runs or looks at to know it's done. Phrase each as behaviour a person can see, tied to a stated requirement.
12. Run a pre-mortem. Imagine the change shipped and failed. Keep at most three causes that are specific to this change, and write each under "Risks and rollback" with what in the plan prevents it or how to roll back.
13. Read the plan as if you'd never seen the conversation. Every name must resolve, every step must say how to check it, and no step can depend on something only you know. Fix what fails.
14. Save the plan. See "Save the plan" below.
15. Have the plan challenged. See "Have the plan challenged" below.

## Ask questions

Ask the person who asked for the change about what only they can answer: the intent, what's in and out of scope, behaviour users will see, each significant decision, and any wider change. Look up everything else yourself. A fact in the code is not a question, and neither is a choice the request already made: if they said "on every push", that's settled. Small choices the request left open, such as a file name or an edge case nobody will notice, are yours to pick.

- Ask a few questions at a time, as soon as you can, rather than one long list at the end. Ask about intent and scope before you design, and about decisions once you know the options.
- Offer choices where you can. Put your recommendation first, with its cost and the cost of each other option in a line each.
- Keep asking until the answers add up to a plan. Copy each answer into the plan where it applies, so the reader sees the decision without the conversation.
- If nobody can answer, for example when you run as a subagent, don't stop and don't guess silently. Put each question under "Open questions" with your recommended answer, finish the plan as if that answer is accepted, and mark the plan as a draft at the top.

## When the current design is the problem

Sometimes the change is hard because of how the code is built, not because the problem is hard. Signs of that:

- The same edit has to be made in several places, because logic is copied rather than shared.
- The change needs a flag or special case threaded through code that has nothing to do with it.
- The plan works around an abstraction, a data model or a boundary instead of through it.
- A step needs a comment explaining why it does something odd.
- Most of the steps are about getting around existing code, and few are about the problem.

When you see one, write the wider change up and ask about it. Say what in the current design causes the difficulty, what the wider change is, what it would make simpler (this change, and others like it), what it costs, and whether you'd do it first, later or not at all. Until the person who asked says yes, plan the simple route. If they say yes, put the wider change in its own milestone ahead of the feature, with existing tests passing before any behaviour changes. If they say no or later, keep the write-up in the plan's "Wider change" section so it isn't lost.

Before you call existing code a mistake, find out why it is that way: read its history, comments and callers. If you can't tell, say so. Code that looks wrong is sometimes holding something up.

## Split the work into milestones

A plan can be any size, but each milestone ships as one pull request. A milestone is a slice that leaves the system working, can be reviewed on its own, and moves the goal forward. Write each one as goal, work, result and proof: what it's for, what changes, what exists afterwards, and the commands that show it works on its own.

- Get something working end to end as early as you can, then build on it.
- Put refactors in their own milestone ahead of the behaviour change, so each pull request does one kind of thing.
- When a step is risky because nobody knows yet whether an approach works, make the first milestone a spike: a throwaway proof, with what to run, what to look for, and what result means keep or discard.
- A small change is one milestone. Don't split work that's easier to review whole.

## Save the plan

Save the plan where you were told to. If you weren't told, save it as `.plans/<short-name>.md` at the repository root. Plans stay local and are not committed. If `.plans/` isn't ignored, add it to the repository's local exclude file, which is never committed:

```bash
echo '.plans/' >> "$(git rev-parse --git-path info/exclude)"
```

Check: `git check-ignore .plans/<short-name>.md` prints the path.

## Have the plan challenged

The person who wrote a plan is the worst person to see what's wrong with it. Once the plan is saved, have a reviewer that never saw the conversation challenge it.

1. Start a subagent and give it the plan's path, the repository's location, and this instruction: load the `challenge-plan` skill, review the plan against the repository, and change no files. Give it nothing from the conversation; the plan has to stand on its own. If you can't start a subagent, load `challenge-plan` and review the plan yourself, and say in your result that the review wasn't independent. If `challenge-plan` isn't available, skip this and say so in your result.
2. Read each finding against the problem and the answers you were given. Apply a cut or change that holds up. Turn down one that contradicts an answer from the person who asked, or that adds scope, and note why in the plan's "Decision log". A reviewer asked to find problems always finds something; applying every finding makes a plan bigger, not better.
3. If a finding changes a significant decision or the scope, ask about it rather than applying it.

## Keep it honest

- Never invent a file, function, flag, endpoint or fact about the system. If you couldn't check something, put it under "Assumptions" with what the plan relies on.
- Check facts from outside the repository, such as a library's API, a tool's version or a service's limits, against their docs when you can. If you can't, list them under "Assumptions" too.
- Don't plan for requirements nobody stated: no config flags, plugin points or generality for a future case. A real future need goes under follow-ups.
- Keep what keeps the change safe: tests for it, error handling the problem needs, and a backup or rollback step before changing stored data. Those aren't extras.

## Your result

The path to the saved plan, then the plan in the format in [PLAN.md](PLAN.md), then one line each on:

- the challenge review: what it found, what you applied, and what you turned down
- open questions that still need an answer, if any
