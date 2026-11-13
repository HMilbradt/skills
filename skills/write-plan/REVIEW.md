# Challenge a plan

Challenge a plan and return a review: the smallest plan that still solves the problem, what to cut, which decisions matter, and the questions only the author can answer. When the plan is already minimal, the review is one line. Use this for every plan you write, and on its own when asked to challenge a plan someone else wrote.

A review doesn't implement anything or edit the plan. Questions it can't settle go into the review, each with a recommended answer.

## What you need

- The plan. It can be in the conversation, a file, an issue or a pull request description. If you can't find one, say so in your result and stop.
- The problem the plan solves, as stated by whoever asked for it. Every finding is measured against it. If the plan doesn't state one, infer it from the plan and mark it as an assumption in the review.

## How to review

1. Write the problem in one sentence, and list the requirements that were actually stated. Treat anything else in the plan as a requirement nobody asked for, until the plan or the author shows otherwise.
2. Read what the plan touches: the code, config or system it changes. Check that every file, function and command the plan names exists. Look for something that already does the job, such as existing code, a built-in feature or a dependency already installed. A fact you can look up is not a question for the author. If you can't read something, list it under "Not checked".
3. Name the smallest version that solves the stated problem. Reach in this order: change existing code, extend existing code, add a file, add a dependency, add a new abstraction. Each step past the second needs a one-line reason tied to the problem. If the plan builds several parts before anything works end to end, the smallest version is the first slice that does work end to end.
4. Test each element of the plan against the problem, and cut what the problem doesn't need. Common cuts are config flags, plugin points, interfaces with one implementation, generality for a future case, and a new service or dependency for what a few lines would do. For each cut, say what would make it worth adding back.
5. Sort the decisions the plan makes or leaves open. A decision is significant if it changes an interface someone else calls, changes stored data, changes behaviour a user would notice, or would be annoying to unwind. If you can't tell, treat it as significant. Give each significant decision two or three options, the cost of each, and your pick. Give each reversible decision a pick and nothing more.
6. Run a pre-mortem: imagine the smallest version shipped and failed, and ask why. Keep at most three causes, and only ones specific to this plan.
7. Write the review in the format below.

## Keep what keeps it working

Some parts of a plan look like extras but are part of solving the problem. Keep tests for the change, error handling the problem needs, a backup or rollback step before changing stored data, and anything that makes the code easier to change without adding complexity now. Cutting is for features built for a need nobody has stated, not for the work that makes this change safe.

## Challenge, don't contradict

- Tie every finding to the stated problem and to a named part of the plan. If you can't tie it to both, leave it out.
- When the plan gives a reason for an element, answer that reason. If the reason holds, the element stays. A decision the plan records as the author's answer is settled; challenge it only with a fact the author didn't have.
- Never propose something bigger than the plan. Don't swap in a tool you prefer when the plan's choice works.
- Don't write "consider", "you might want to" or "it may be worth". Say what to cut or change, or leave it out.
- Leave out empty sections. If the plan is already minimal and has no significant decision or open question, the whole review is one line that says so and why.
- Never invent a file, function, config key or fact about the system. Say what you didn't check.

## Review format

Write every review in this format, with the sections in this order. Leave out any section that would be empty. A review of an already minimal plan with nothing significant in it is one line with no headings.

```markdown
## Plan review: <what the plan does, in a few words>

<Verdict>: <one sentence on why.>

### Problem

<The problem in one sentence, then the requirements that were stated. Start with "Assumed:" if the plan didn't state the problem.>

### Smallest version

<A short numbered list of steps, or two to four sentences. Where it goes past "extend existing code", give the reason in one line.>

### Cuts

| Plan element | Why it goes | Add it back when |
| :- | :- | :- |
| <the element, named as the plan names it> | <one sentence tied to the problem> | <the event that would make it needed> |

### Decisions

| Decision | Kind | Options and cost | Pick |
| :- | :- | :- | :- |
| <decision> | <Reversible, or Significant: which test it meets> | <two or three options, each with its cost> | <your pick> |

### Risks

<At most three, one line each: what fails, and what in the smallest version prevents it or should be added.>

### Open questions

1. <A question only the author can answer.> Recommended: <an answer, worded so that "yes" accepts it>.

### Not checked

<What you couldn't read or verify, and what the review assumed instead.>
```

### Verdicts

| Verdict | Use it when |
| :- | :- |
| Already minimal | Nothing in the plan can go. Write it as one line, "Already minimal: <why>.", and add the Decisions or Open questions sections only for something significant. |
| Simplify | The plan solves the stated problem with more than it needs. |
| Rethink | The plan solves a different problem than the one stated, something that already exists solves it, or the approach can't work. |

### Decision kinds

| Kind | Meaning |
| :- | :- |
| Reversible | Cheap to change later. Write "Not worth debating" under options, give a pick, and move on. |
| Significant | Name the test it meets: an interface someone else calls, stored data, behaviour a user would notice, or annoying to unwind. If you can't tell, it's significant. |

### Writing the review

- Lead with the verdict. One idea per sentence.
- Name parts of the plan the way the plan names them, so the author can find them.
- An open question is a decision or a fact only the author has. Look up everything else.
- No praise, no closing summary, no emoji, and no em dashes or double hyphens in prose. If the `write-docs` skill is available, follow its voice.
- Keep the review to about one screen. If it runs longer, check each finding against "Challenge, don't contradict" above.
