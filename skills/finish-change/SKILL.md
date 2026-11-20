---
name: finish-change
description: Take a built change to a pull request that's ready to merge, in one run. Brings the branch up to date, has the change reviewed and the findings fixed, runs the repository's own verification, commits, pushes, opens or updates the pull request, then clears failing checks and open review comments. Asks once at the start for everything it needs approved. Use only when asked to finish, ship or land a change, such as "commit and open the PR", "review, fix, push and sign off", "rebase and re-run" or "get this ready to merge". Stops at ready; it doesn't merge, deploy or build new work.
---

# Finish a change

Take a change that's built to a pull request that's ready to merge, and return what state it reached. You run the sequence; other skills do the reviewing, fixing and writing. Don't merge, deploy or start new work.

"Ready" has one meaning here, and every part must hold for the commit that's pushed: the repository's verification passed on it, its checks pass, and no review comment on it is unanswered. Anything less is reported as not ready, with what remains.

## 1. Read the rules, then ask once

1. Find the change: the work on this branch since it left the default branch, plus uncommitted work. If the branch carries commits that aren't part of this change, such as ones merged upstream under another hash, name them in your result; the rebase in step 2 usually drops them.
2. Read how this repository finishes work, in its agent instructions and contributing guide (AGENTS.md, CLAUDE.md, CONTRIBUTING.md): the verification to run before a pull request (often one command, such as a sign-off script) and its flags, the pull request conventions, and whether it has its own skills for reviewing or opening pull requests. The repository's rules and skills win over this skill's defaults wherever they differ.
3. Find the plan, if there is one: the one named, or the plan in `.plans/` that matches the change.
4. Take what the request already settles. "Rebase, then push and sign off, concurrency 2" approves the push, the force push the rebase makes necessary, and sets the flag. Don't ask again for what it grants.
5. Ask for everything else you'll need, in one message, before you start. Usually that's some of: force-pushing the branch after a rebase, rewriting an existing pull request's description, replying on its review threads, and any step the repository's rules gate on a person. Leave an existing pull request's draft state as it is unless told to change it.
6. If the request names only some of the steps, such as "commit and open the PR", say in that message, or in one line if there's nothing to ask, what else this run does: bringing the branch up to date with the default branch, a review, the verification, and clearing checks and comments. Then the user can cut a step before it runs, not after. A run that stops for approval three times costs more than the typing it saves. If the host blocks an approved action anyway, give the exact command for the user to run and carry on once they have.

A run can be cut off partway, by a compaction or a closed session, and picked up by an agent that remembers none of it. So work out where things stand from git, the plan and the pull request, never from memory. Then run the steps in order, skipping each whose result is already there:

- Step 2, when the branch isn't behind the default branch: `git rev-list --count HEAD..origin/<default branch>` prints 0 after a fetch.
- Step 3, when the plan or the pull request description records a review. A review leaves no trace in git, so step 5 records it. Commits after the reviewed one are fixes from that review or from step 6; don't review them again.
- Step 4, when the description says the verification passed on the head commit.
- Step 5, when a pull request exists and its head is the local commit: `gh pr view --json headRefOid -q .headRefOid` prints the same as `git rev-parse HEAD`.

Approvals from an earlier run carry over only if they're in this conversation; ask again for any that aren't.

If no one can answer, as when you run as a subagent, do every step that needs no approval, stop before the first one that does, and say in your result what's waiting.

## 2. Bring the branch up to date

1. Commit the uncommitted work that belongs to the change. Stage it by path, not with `git add -A`: the working tree often holds edits from other work, and those stay out of the commit, uncommitted, for the whole run. Name them in your result. Follow the repository's commit conventions, and use `write-pr` for the message if it's available.
2. Run `git fetch`, then rebase onto the default branch with `git rebase --autostash`, which carries those other edits across. Merge instead if the repository's rules say to merge.
3. Resolve conflicts that have one right answer, and name each one in your result. A conflict where both sides changed behaviour is a decision: stop, and report both sides.

Do this first. A review and a verification run against a stale base both have to be done again once the default branch is merged in.

## 3. Review and fix

1. Have the change reviewed with the repository's own review skill if it has one, otherwise `review-change`. Give it the plan and the commit range, so edits in the working tree that aren't part of the change aren't reviewed.
2. Fix the findings with `fix-findings`, which turns down findings that are wrong or add scope and says why.
3. Review once more, only what the fixes changed. Fix what that finds. Record in the plan, if there is one, which commit the review covered.
4. Stop reviewing after the second round. Findings still open go in your result, and so does the fact that the last fixes weren't reviewed. A third round finds a fresh batch of small things every time, and the change never ships.
5. Commit the fixes. Verification has to run on a commit, so the result can say which commit passed.

If neither a review skill nor subagents are available, review the diff yourself and say in your result that the review wasn't independent.

## 4. Verify

1. Run the repository's verification exactly as its rules say, with any flags the request gave. With no stated verification, run its tests, lint and typecheck for the files the change touches.
2. If it runs long, run it in the background and wait for it to end. Don't return while it's running: a result that says "sign-off started" gets read as "sign-off passed".
3. When it fails, read the failure. A test that fails for a reason unrelated to the change, such as a timeout under load, gets one rerun alone. If it passes alone, run the verification again, only the failed part when the command can do that, because the repository's command has to pass for the change to count as verified. If it fails alone too, check whether it also fails on the default branch, and report it. Fix a failure the change caused with `investigate`, then run the verification again. If `investigate` stops without a fix, stop and report.
4. If the change alters what users see on screen and the repository can run the app, use the changed screen once and keep a screenshot when the pull request conventions ask for one. If you can't, list it under "Not verified".

Never weaken, skip or delete a check to get a pass.

## 5. Commit, push and open the pull request

1. Push the branch. After a rebase that needs a force push, use `git push --force-with-lease`, and only with the approval from step 1.
2. Open the pull request, or update the one that exists, with the repository's own pull request skill if it has one. Otherwise write the title and description with `write-pr` and open it as a draft unless told otherwise. Say in the description which commit the review covered and which commit the verification passed on, so a later run can tell.
3. Confirm what you pushed. `git rev-parse HEAD` must print the same commit as `gh pr view --json headRefOid -q .headRefOid`. A push that was blocked or never ran is the usual reason a change is reported pushed when it isn't.

## 6. Clear checks and review comments

1. Wait for the pull request's checks: `gh pr checks <number> --watch`.
2. Read every review comment and review thread on the pull request, from people and from review bots. A bot often posts some minutes after the push. If the repository's earlier pull requests show a review bot, wait for its review of this commit, up to about fifteen minutes, before you call the comments clear. Don't wait for people to review:

   ```bash
   gh pr view <number> --json reviews,comments
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   ```

3. Fix every failing check and unanswered comment in one batch with `fix-findings`, which checks a finding nobody verified before acting on it. A check that fails here after step 4 passed is one the local verification doesn't cover: find the command the check runs and reproduce the failure with it before fixing. Then commit, run step 4 once for the batch, push, and reply on each thread with what changed or why it was turned down. Leave resolving a thread to whoever opened it. Update the description's verified commit, and anything else the fixes made wrong.
4. Do this at most twice. What's still open after that goes in your result.

## Your result

```markdown
Pull request: <link>, <ready, or not ready because ...>
Head: <the pushed commit>, <rebased onto or merged with the default branch at its commit>, <conflicts resolved by hand, and any push the user had to run>

Review: <which skill reviewed, findings fixed, findings turned down and why, and which fixes no review has seen>
Verification: <the command and its result on the pushed commit, and any earlier failure with what it turned out to be>
Checks: <passing, or each failing check>
Review comments: <each one answered and how, or each still open>

Not verified: <what you couldn't run or see, and why>
Needs a decision: <conflicts, findings or approvals that are waiting, with your recommendation>
Left for you: <marking a draft ready, merge, deploy, ticket state, and edits in the working tree that weren't part of the change>
```

Leave out empty sections.
