---
name: implement-plan
description: Build one milestone of a written plan, step by step, running each step's check and keeping the plan's Progress, Decision log and Surprises current so anyone can pick the work up from the plan alone. Changes only what the milestone lists, and stops when the code doesn't match what the plan assumed. Returns what's done, what departed from the plan and what isn't verified. Use when asked to implement, build, carry out or continue a plan, a milestone or the next step of a plan in .plans/. Doesn't write plans (use write-plan), review the result (use review-change) or commit.
---

# Implement a plan

Build one milestone of a plan, so that its "Done when" holds and the plan still describes the work truthfully. The plan is the spec: you carry it out, you don't redesign it. Return what you built and what you couldn't.

## 1. Find the plan and the milestone

1. Use the plan you were given. Otherwise list `.plans/` at the repository root and pick the plan the request names. Plans there are usually git-ignored, so `git status` won't show them. If no plan matches, or several do, stop and say so in your result.
2. Pick the milestone the request names. Otherwise take the first one not ticked in Progress. Build one milestone per run unless the request asks for more, because each milestone is meant to ship as its own pull request.
3. Read the whole plan, not only the milestone: Why, Changes, Stays the same and the Decision log all bind you. If it's marked a draft with open questions, build on the recommended answers and list each one you relied on in your result.
4. Check the starting point. Earlier milestones are ticked in Progress, and the code they describe exists. Run `git status --short` and note any uncommitted work that isn't yours, so you don't mistake it for part of the milestone or overwrite it.

## 2. Build each step

For each step in order:

1. Read the code the step touches before changing it.
2. Make the change the step describes, at the location it names. Follow the patterns already in the file.
3. Run the step's check exactly as written, from the directory it names. A step that adds a test: run the test before the change and see it fail, then after and see it pass.
4. If the check passes, move on. If it fails, fix your change. After two failed fixes, stop the milestone and record where it stands.

Change only what the milestone lists. Code under "Stays the same" stays the same even when a change there looks tidier, and work under "Follow-ups" waits. If something outside the milestone needs fixing for the milestone to work, that's a departure (section 3).

Never weaken or delete a test to make a check pass. A check that can't pass as written means the plan is wrong; treat it as a departure.

## 3. When the plan doesn't match the code

Plans are written before the code is touched, so some assumptions will be wrong: a function has a different signature, a file moved, a check fails for a reason the plan didn't foresee.

- A small departure keeps the plan's intent and changes nothing under "Decisions" or "Stays the same": a renamed function, an extra import, a test in a different file. Make it, log it under "Decision log" with the reason, and continue.
- A large departure changes an interface, stored data, behaviour a user would see, a recorded decision, or the milestone's scope. Don't make it. Stop the milestone, record what you found under "Surprises" with the evidence, and say in your result what decision is needed, with your recommendation.

If you can't tell which it is, treat it as large.

## 4. Keep the plan current

The plan is how the next person, or the next run of this skill, picks up the work. Update it as you go, not at the end, so it's right even if you stop partway:

- Progress: tick a milestone only when every step's check and the milestone's Proof pass. If you stop partway, split the milestone into what's done and what remains.
- Decision log: each departure, with what changed and why.
- Surprises: anything that turned out different from the plan, with the evidence (an error, a file, a command's output).
- Other sections a departure makes wrong, such as Changes or a later milestone's steps.

The plan stays local. Edit it in place and don't commit it.

## 5. Prove the milestone

1. Run the milestone's Proof commands.
2. Run the checks listed under "Stays the same".
3. Run the repository's own test and lint commands for the files you changed, if it has them.

Report each command and its result. A check you couldn't run, such as one needing a deploy or credentials you don't have, is "Not verified", not done.

## Your result

```markdown
Plan: <path>, milestone <number>: <goal>
Status: <done, or stopped at step N because ...>

Done:
- <step>: <its check and the result>

Departed from the plan:
- <what changed, why, and whether it's logged>

Needs a decision:
- <the large departure, the options, and your recommendation>

Not verified:
- <check you couldn't run, and why>

Changed files: <list>
```

Leave out empty sections.
