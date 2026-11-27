---
name: run-plan
description: Run a written plan's remaining milestones one after another, without being driven step by step. Builds each milestone in a fresh subagent, then has it reviewed, fixed, verified, opened as a pull request, merged and closed out before the next one starts. Stops at the first milestone that needs a person, needs a decision, fails verification or isn't ready to merge. Run only when the user asks to run a plan through, because it merges pull requests and runs long.
disable-model-invocation: true
---

# Run a plan

Take a plan from where it stands to finished: build each remaining milestone, ship it, then start the next. Stop at the first milestone that can't ship cleanly. You schedule the work. `implement-plan` builds each milestone and `finish-change` ships it. Return which milestones merged and where the run stopped.

Running this skill approves these actions for every milestone it finishes, so don't ask for them again: force-pushing the milestone's branch after a rebase, opening its pull request ready for review unless the repository's rules say draft, rewriting that pull request's description, replying on its review threads, merging it once it's ready, and marking its ticket done. It approves nothing else. A deploy, a production change and everything under "When to stop" still wait for a person.

## 1. Find where the plan stands

1. Find the plan the way `implement-plan` does: the one named, or the matching plan in `.plans/`. Read all of it.
2. Work out which milestone comes next from the plan's Progress, git and the pull requests, never from memory. A run can be cut off by a compaction or a closed session and picked up by an agent that remembers none of it.
   - A milestone is done when its build steps are ticked in Progress and its pull request is merged. An item left for a person, such as a release check, doesn't make it unfinished.
   - A milestone that is built but not merged, with uncommitted work, unmerged commits or an open pull request, resumes at step 4 of section 2. Don't build it again. If its work sits on the default branch or on an earlier milestone's branch, create its branch first with `git switch -c <branch>`, which carries uncommitted changes across.
3. Read every remaining milestone for steps that need a person, as section 3 describes, before you build anything. If the range holds one that can't be deferred, say in one line which milestone the run will stop at and what the person must do, then carry on up to it without waiting for a reply. The user can do their part while the earlier milestones run.
4. Take the range from the request, such as "through milestone 4". With no range, run every remaining milestone.
5. Ask once, before the first milestone, only what the plan leaves open: a draft plan's open questions that a milestone in the range depends on. Check the answers you can look up yourself. If no one can answer, run the milestones that don't depend on an open question, in order, and stop before the first that does.
6. Run `git status --short`. Uncommitted work that isn't part of the plan stays uncommitted for the whole run. Name it in your result.

## 2. Run each milestone in order

Run one milestone at a time. Two milestones built at once conflict in one working tree, and each milestone builds on the one merged before it.

1. Start from what's merged. Run `git fetch`, then create the milestone's branch from the default branch as it is on the remote, named by the repository's convention: `git switch -c <branch> origin/<default branch>`. Don't reset an existing branch to get there. A branch left over from the last milestone still has that milestone's commits under another hash once it's squash-merged.
2. Build the milestone in a fresh subagent. Give it the plan's location and the milestone number, and tell it to load `implement-plan`, build that one milestone, leave the work uncommitted, and return the skill's result unchanged. A fresh subagent keeps the build's file reads and test output out of your context, so a long plan doesn't lose its early milestones to a compaction. Wait for it; never start the next milestone's build while this one is open.
3. Read the subagent's result, then check it. The milestone's steps are ticked in the plan's Progress, and `git status --short` shows the changes. If the result says the milestone stopped or needs a decision, go to section 3. A subagent that reports done with nothing changed has not built the milestone: treat that as a stop.
4. Ship the milestone yourself. Load `finish-change` and run it on this branch with the plan and the milestone number, and with every approval listed at the top of this skill. Don't hand this step to a subagent: `finish-change` starts its own reviewers, and many hosts don't let a subagent start subagents. Skip its opening question and its line about what the run does, because this skill's approvals answer both. Merge the way the repository's rules say, such as a squash merge.
5. Confirm the merge before you count it. `gh pr view <number> --json state -q .state` prints `MERGED`. If `finish-change` reports the pull request as not ready, or the state is anything else, go to section 3.
6. Record the pull request beside the milestone in the plan's Progress, where the plan lives.
7. Say in one line what merged and what starts next, then start the next milestone without waiting for a reply.

## 3. When to stop

Stop the run at the milestone where any of these happens. Don't skip a stopped milestone to run a later one. Later milestones assume the earlier ones shipped, and a milestone built on a missing one has to be built again.

- **A step needs a person and can't be deferred.** Some steps are a person's to do: a deploy, a production migration or data change, a feature flag flip, a secret or account to create, a manual check the plan assigns to someone, a wait such as a soak period, or a sign-in only they can complete. If the rest of the milestone, or any later milestone in the range, depends on that step, stop before the work that depends on it. When it's the milestone's first step, stop before building the milestone at all. First check whether it's already done, where you can see that. Where you can't, such as a production change, ask your user if they can answer. If they say it's done, record that in the plan's Decision log and carry on, telling the build subagent the step is done. Otherwise stop, and say exactly what the person must do, what you checked or couldn't check, and how to resume. Don't work around the step, fake it or carry on past it. A milestone merged ahead of the migration it needs is worse than a run that stopped.
- **A step needs a person but can be deferred.** Nothing in the range depends on it, such as a production check after release. Carry on, and list it under "Left for you". If you can't tell whether something depends on it, treat it as not deferrable and stop. The same goes for a step the plan doesn't list but a milestone plainly needs, such as a flag that must be fully on before its fallback is deleted.
- **The build needs a decision.** `implement-plan` stopped on a large departure from the plan. If your user can answer, ask with the options and your recommendation, record the answer in the plan's Decision log, and start a new subagent to continue the milestone. If no one can answer, stop.
- **The milestone isn't ready to merge.** `finish-change` reports a failed verification it couldn't fix, a finding that needs a decision, a failing check, an unanswered review comment, or a conflict where both sides changed behaviour.
- **The same failure twice.** Two milestones in a row fail the same way for a reason outside their own changes, such as a test that also fails on the default branch. The fault is in the base, and every later milestone will hit it.
- **The host blocks an approved action.** Give the exact command for the user to run, and carry on once they have.

When you stop, leave the milestone as it is: its branch, its uncommitted work and its open pull request. Stop the servers and containers this run started.

## Your result

```markdown
Plan: <path or link>, milestones <first> to <last> requested

Merged:
- Milestone <number>, <goal>: <pull request link>, <merge commit>

Stopped at: milestone <number>, <goal>, because <reason>
State: <built or not, the branch, uncommitted work, and the pull request link if one is open>
Needs you: <exactly what the person must do or decide, with your recommendation, and how to resume>

Not verified: <what any milestone couldn't run or see, by milestone>
Left for you: <deferred steps such as deploys and production checks, by milestone, and uncommitted work that wasn't part of the plan>
Next: <the one step that comes next and whether it needs the user, or "Nothing left">
```

Leave out empty sections, except `Next`.
