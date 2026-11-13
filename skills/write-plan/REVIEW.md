# Challenge a plan

Return a short review: a verdict, the smallest plan that still solves the problem, what to cut, which decisions matter, and the questions only the author can answer. Apply the rules in "Rules for every plan and review" in SKILL.md. Don't implement anything or edit the plan.

## How to review

1. Find the plan and the problem it solves. If the plan doesn't state the problem, infer it and mark it "Assumed". If there's no plan, say so and stop.
2. Read what the plan touches. Check that every name in it exists, and look for something that already does the job. List what you couldn't read under "Not checked".
3. Name the smallest version that solves the stated problem. If the plan builds several parts before anything works, the smallest version is the first slice that works end to end.
4. Cut each element the problem doesn't need, and say what would make it worth adding back.
5. Give each significant decision two or three options with their costs, and your pick. A decision the plan records as the author's answer is settled; reopen it only with a fact they didn't have.
6. Check milestone order: each milestone's steps and checks use only what exists today or what an earlier milestone builds. Check scope: nothing the request names was moved to Follow-ups without the requester's answer.
7. Pre-mortem: at most three ways the smallest version could fail, specific to this plan.

## Challenge, don't contradict

- Tie every finding to the stated problem and a named part of the plan, or leave it out.
- When the plan gives a reason for something, answer that reason. If it holds, the element stays.
- Never propose something bigger than the plan, or swap in a tool you prefer when the plan's choice works.
- Say what to cut or change. Don't write "consider" or "you might want to".
- Questions go in the review with a recommended answer. Don't stop to wait for them.

## Format

Lead with the verdict. Leave out empty sections. An already minimal plan with nothing significant gets one line: "Already minimal: <why>."

| Verdict | Use it when |
| :- | :- |
| Already minimal | Nothing can go. |
| Simplify | The plan solves the problem with more than it needs. |
| Rethink | It solves a different problem, something already solves it, or the approach can't work. |

```markdown
## Plan review: <what the plan does>

<Verdict>: <one sentence on why.>

### Problem

<One sentence, then the stated requirements. Start with "Assumed:" if inferred.>

### Smallest version

<A short numbered list, or two to four sentences.>

### Cuts

| Plan element | Why it goes | Add it back when |
| :- | :- | :- |

### Decisions

| Decision | Why it's significant | Options and cost | Pick |
| :- | :- | :- | :- |

Reversible picks: <one line each>

### Risks

<At most three, one line each: what fails, and what prevents it.>

### Open questions

1. <Question.> Recommended: <answer, worded so "yes" accepts it>.

### Not checked

<What you couldn't verify, and what you assumed instead.>
```

Name parts of the plan the way the plan does. No praise and no closing summary. Keep it to about a screen; if it runs longer, recheck each finding against "Challenge, don't contradict".
