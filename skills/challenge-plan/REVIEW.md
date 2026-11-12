# Review format

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

## Verdicts

| Verdict | Use it when |
| :- | :- |
| Already minimal | Nothing in the plan can go. Write it as one line, "Already minimal: <why>.", and add the Decisions or Open questions sections only for something significant. |
| Simplify | The plan solves the stated problem with more than it needs. |
| Rethink | The plan solves a different problem than the one stated, something that already exists solves it, or the approach can't work. |

## Decision kinds

| Kind | Meaning |
| :- | :- |
| Reversible | Cheap to change later. Write "Not worth debating" under options, give a pick, and move on. |
| Significant | Name the test it meets: an interface someone else calls, stored data, behaviour a user would notice, or annoying to unwind. If you can't tell, it's significant. |

## Writing the review

- Lead with the verdict. One idea per sentence.
- Name parts of the plan the way the plan names them, so the author can find them.
- An open question is a decision or a fact only the author has. Look up everything else.
- No praise, no closing summary, no emoji, and no em dashes or double hyphens in prose. If the `write-docs` skill is available, follow its voice.
- Keep the review to about one screen. If it runs longer, check each finding against "Challenge, don't contradict" in [SKILL.md](SKILL.md).
