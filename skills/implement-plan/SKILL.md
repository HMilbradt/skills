---
name: implement-plan
description: Build the next milestone of a written plan, or the one named, running each step's check and keeping the plan's Progress, Decision log and Surprises current so anyone can pick the work up from the plan alone. Stops instead of redesigning when the code doesn't match what the plan assumed. Returns what's done, what departed from the plan and what isn't verified. Use when asked to implement, build or carry out a plan, to build or start a milestone ("build milestone 2", "start the next milestone"), to do the next step of a plan, or to pick a plan up where the last session left off. Doesn't write plans (use write-plan), answer what's left (use report-status), review the result (use review-change) or commit.
---

# Implement a plan

Build one milestone of a plan, so that its "Done when" holds and the plan still describes the work truthfully. The plan is the spec: you carry it out, you don't redesign it. Return what you built and what you couldn't.

## 1. Find the plan and the milestone

1. Use the plan you were given, wherever it lives: a file, or a link to an issue or document. Read a plan that isn't a local file from that place on every run, because a copy left by an earlier session may be out of date. If a local plan's first lines say it's a copy, the place it names is the plan. Otherwise list `.plans/` at the repository root and pick the plan the request names. Plans there are usually git-ignored, so `git status` won't show them. If no plan matches, or several do, stop and say so in your result.
2. Pick the milestone the request names. Otherwise take the first one not ticked in Progress. Build one milestone per run unless the request asks for more, because each milestone is meant to ship as its own pull request.
3. Read the whole plan, not only the milestone: Why, Changes, Stays the same and the Decision log all bind you. If it's marked a draft with open questions and your user can answer, ask about them first, as in section 3. Otherwise build on the recommended answers and list each one you relied on in your result.
4. Check the starting point. Earlier milestones are ticked in Progress, and the code they describe exists. Run `git status --short` and note any uncommitted work that isn't yours, so you don't mistake it for part of the milestone or overwrite it.
5. Run the milestone's Proof checks that already exist once before you change anything, and note what already fails. Skip tests the milestone will write: they fail until it writes them, so their baseline says nothing. A failure you didn't cause isn't yours to fix, and without this baseline it looks like your change broke it at the end.

## 2. Build each step

For each step in order:

1. Make the change the step describes, at the location it names. Follow the patterns already in the file.
2. Run the step's check exactly as written, from the directory it names. A step that adds a test: write the test first and see it fail, then make the change and see it pass. A test written after the code was never seen failing, so it proves nothing.
3. If the check passes, tick the step in Progress before you start the next one. If it fails, fix your change. After two failed fixes, stop the milestone and record where it stands.

Change only what the milestone lists. Code under "Stays the same" stays the same even when a change there looks tidier, and work under "Follow-ups" waits. If something outside the milestone needs fixing for the milestone to work, that's a departure (section 3). So is a step that needs something a later milestone builds: pulling that work forward changes both milestones' scope.

If you change a file outside the diff to get something running, such as a flag in a git-ignored `.env`, note it for your result so it can be undone.

Never weaken or delete a test to make a check pass. A check that can't pass as written means the plan is wrong; treat it as a departure.

## 3. When the plan doesn't match the code

Plans are written before the code is touched, so some assumptions will be wrong: a function has a different signature, a file moved, a check fails for a reason the plan didn't foresee.

- A small departure keeps the plan's intent and changes nothing under "Decisions" or "Stays the same": a renamed function, an extra import, a test in a different file. Make it, log it under "Decision log" with the reason, and continue.
- A large departure changes an interface, stored data, behaviour a user would see, a recorded decision, or the milestone's scope. Don't make it on your own. Record what you found under "Surprises" with the evidence. If your user can answer now, ask with the options and your recommendation, log their answer under "Decision log" and carry on. If no one can answer, as when you run as a subagent, stop the milestone and say in your result what decision is needed, with your recommendation.

If you can't tell which it is, treat it as large.

## 4. Keep the plan current

The plan is how the next person, or the next run of this skill, picks up the work. Update it as you go, not at the end, so it's right even if you stop partway:

- Progress: list the milestone's steps under it and tick each as its check passes. Tick the milestone only when every step's check and its Proof pass. A milestone's item covers building it. If the plan gives the release or a production check its own item, leave that one for whoever releases it, and report the milestone as built, not as partly complete. For example:

  ```markdown
  - [ ] Milestone 2: Rate-limit the login endpoint
    - [x] Step 1: add a failing test for the limit
    - [ ] Step 2: add `RateLimiter` to the login handler
  ```

- Decision log: each departure, with what changed and why.
- Surprises: anything that turned out different from the plan, with the evidence (an error, a file, a command's output).
- Other sections a departure makes wrong, such as Changes or a later milestone's steps.

Edit the plan where it lives. A plan in `.plans/` stays local; don't commit it. For a plan in an issue or document, write Progress, Decision log and Surprises back to that place as you go, in the form it already uses, such as its checkboxes. Notes kept only in your session are lost to the next person. If you can't write there, put the updates in your result and say the plan is out of date.

## 5. Prove the milestone

1. Run the milestone's Proof commands.
2. Run the checks listed under "Stays the same".
3. Run the repository's own test and lint commands for the files you changed, if it has them.

If a Proof check that existed at the start fails only where it already failed then, leave the milestone unticked, record it under "Surprises", and report it under "Failing before this milestone" with what would fix it. Don't fix it inside this milestone; it's outside the scope. A test this milestone added that still fails is a failure of this milestone, not one from before.

Report each command and its result. A check you couldn't run, such as one needing a deploy or credentials you don't have, is "Not verified", not done. A check the repository doesn't have, such as a linter it never set up, isn't a gap; leave it out.

Stop there, with the work uncommitted, unless the request asks for more. What happens to the work next belongs to whoever called you.

## Your result

```markdown
Plan: <path or link>, milestone <number>: <goal>
Status: <done, or stopped at step N or at the Proof, because ...>

Done:
- <step>: <its check and the result>

Departed from the plan:
- <what changed, why, and whether it's logged>

Needs a decision:
- <the large departure, the options, and your recommendation>

Failing before this milestone:
- <check that already failed at the start, the evidence, and what would fix it>

Not verified:
- <check you couldn't run, and why>

Changed files: <list>
Changed outside the diff: <files such as a git-ignored .env, what changed, and how to undo it>
Milestones left: <each milestone not ticked in Progress, by number and goal, or "None">
Next: <the one step that comes next, such as review and ship this milestone, and whether it needs the user>
```

Leave out empty sections, except `Milestones left` and `Next`.
