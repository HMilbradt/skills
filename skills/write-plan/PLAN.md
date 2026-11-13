# Plan format

Write every plan in this format, with the sections in this order. Leave out a section that would be empty, except the three living sections at the end, which every plan keeps. A small change usually needs only Why, Done when, Changes, one milestone and the living sections.

```markdown
# <What the change does, verb first>

<If questions are still open: "Draft: the open questions below are unanswered, and the plan assumes the recommended answers.">

<One or two sentences: the change and the result. A reader who stops here knows what this plan is for.>

## Why

<The problem, who or what it affects, and the evidence: an error, a ticket, a measurement. Then the intent: what is true once this ships. List the stated requirements, and the answers the person who asked gave.>

## Done when

- <Behaviour a person can see, tied to a requirement: a command and its output, a test, or something on screen.>

## Context

<What the implementer must know about the system as it is: the files, functions and data involved, how they connect, and the patterns the code already follows. Every name here was found in the repository. Define terms the rest of the plan uses.>

## Changes

<The approach in a short paragraph. Then the exact contracts: new or changed signatures, schemas, config keys, error cases and behaviour.>

## Stays the same

- <Code, behaviour or data this change does not touch, and why, where an implementer might be tempted. Where it could break as a side effect, the check that shows it still works.>

## Milestones

### 1. <Goal of this pull request>

<What it's for, what changes, and what exists afterwards, in a few sentences. The proof goes on its own line below.>

1. <One change, with its exact location.>
   Check: <command, the directory it runs in, and the expected result>.

Proof: <the commands that show this milestone works on its own>.

## Alternatives considered

| Option | Why not |
| :- | :- |
| <an option really weighed, including doing nothing> | <the reason, tied to the problem or a cost> |

## Wider change

<Only when the current design makes this change hard. What in the design causes it, the wider change, what it would simplify, its cost, the recommendation, and the answer: planned as milestone N, later, or not at all.>

## Decisions

| Decision | Why it's significant | Options and cost | Pick |
| :- | :- | :- | :- |
| <decision> | <the test it meets: an interface others call, stored data, behaviour users notice, or hard to unwind> | <options, each with its cost> | <pick, and who made it> |

Reversible picks: <one line each, "<decision>: <pick>". No table, no options.>

## Risks and rollback

- <What could fail, specific to this change, and what in the plan prevents it or how to undo it.>

## Open questions

1. <A question only the person who asked can answer.> Recommended: <an answer, worded so "yes" accepts it>. The plan assumes this answer.

## Assumptions

- <What the plan relies on but you couldn't check, and what to do if it's false.>

## Follow-ups

- <Work this plan deliberately leaves out, and why.>

## Progress

- [ ] Milestone 1: <goal>

## Decision log

- <Each decision made after the plan was written, or a challenge finding turned down: what, why, and who decided.>

## Surprises

- <What turned out different from the plan, with the evidence: a test output, an error, a file that wasn't what the Context said.>
```

## The living sections

Progress, Decision log and Surprises are filled in while the plan is built, so anyone can pick the work up from the plan alone. Whoever builds from the plan ticks off milestones in Progress, splitting a half-done one into what's done and what's left. When the work goes off the plan, they record why in the Decision log or Surprises, and update the sections the change affects rather than leaving the plan out of date. When you write the plan, Progress lists the milestones unticked, and the other two hold anything that came up while planning.

## Writing the plan

- Name things exactly as the code names them, in code formatting, with paths from the repository root.
- One action per step. Put the condition before the action: "If the column exists, skip this step."
- Write reasoning as prose and steps as a numbered list. Use a table to compare options.
- No em dashes or double hyphens in prose, no emoji, and no closing summary. If the `write-docs` skill is available, follow its voice.
