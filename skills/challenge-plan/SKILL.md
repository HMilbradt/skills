---
name: challenge-plan
description: Challenge a plan or design before anyone builds it. Names the smallest version that solves the stated problem, cuts requirements nobody asked for, and marks each decision as reversible or significant. Returns a short written review with the simplest viable plan, and never starts implementing. Run only when the user asks, for example "challenge this plan", "is this overkill?", "what's the simplest version of this?" or "review my design before I build it".
disable-model-invocation: true
---

# Challenge a plan

Review a plan before anyone builds it, and return the smallest plan that still solves the problem. The review is short: a verdict, the smallest version, what to cut, which decisions matter, and the questions only the author can answer. When the plan is already minimal, the review is one line.

This skill only reviews. It doesn't implement anything, edit the plan, or stop to wait for answers. Questions it can't settle go into the review, each with a recommended answer.

## What you need

- The plan. It can be in the conversation, a file, an issue or a pull request description. If you can't find one, say so in your result and stop.
- The problem the plan solves, as stated by whoever asked for it. Every finding is measured against it. If the plan doesn't state one, infer it from the plan and mark it as an assumption in the review.

## How to review

1. Write the problem in one sentence, and list the requirements that were actually stated. Treat anything else in the plan as a requirement nobody asked for, until the plan or the author shows otherwise.
2. Read what the plan touches: the code, config or system it changes. Look for something that already does the job, such as existing code, a built-in feature or a dependency already installed. A fact you can look up is not a question for the author. If you can't read something, list it under "Not checked".
3. Name the smallest version that solves the stated problem. Reach in this order: change existing code, extend existing code, add a file, add a dependency, add a new abstraction. Each step past the second needs a one-line reason tied to the problem. If the plan builds several parts before anything works end to end, the smallest version is the first slice that does work end to end. Working complex systems grow from working simple ones (Gall's law).
4. Test each element of the plan against the problem, and cut what the problem doesn't need. Common cuts are config flags, plugin points, interfaces with one implementation, generality for a future case, and a new service or dependency for what a few lines would do. For each cut, say what would make it worth adding back.
5. Sort the decisions the plan makes or leaves open. A decision is significant if it changes an interface someone else calls, changes stored data, changes behaviour a user would notice, or would be annoying to unwind. If you can't tell, treat it as significant. Give each significant decision two or three options, the cost of each, and your pick. Give each reversible decision a pick and nothing more.
6. Run a pre-mortem: imagine the smallest version shipped and failed, and ask why. Keep at most three causes, and only ones specific to this plan.
7. Write the review in the format in [REVIEW.md](REVIEW.md).

## Keep what keeps it working

Some parts of a plan look like extras but are part of solving the problem. Keep tests for the change, error handling the problem needs, a backup or rollback step before changing stored data, and anything that makes the code easier to change without adding complexity now. Cutting is for features built for a need nobody has stated (YAGNI), not for the work that makes this change safe.

## Challenge, don't contradict

- Tie every finding to the stated problem and to a named part of the plan. If you can't tie it to both, leave it out.
- When the plan gives a reason for an element, answer that reason. If the reason holds, the element stays.
- Never propose something bigger than the plan. Don't swap in a tool you prefer when the plan's choice works.
- Don't write "consider", "you might want to" or "it may be worth". Say what to cut or change, or leave it out.
- Leave out empty sections. If the plan is already minimal and has no significant decision or open question, the whole review is one line that says so and why.
- Never invent a file, function, config key or fact about the system. Say what you didn't check.

## Examples

[EXAMPLES.md](EXAMPLES.md) shows padded, contrarian and sharp reviews of the same kinds of plan. Read it before your first review in a session.
