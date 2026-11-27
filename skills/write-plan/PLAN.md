# Plan format

Use these sections in this order. Keep a section only if the implementer would miss it, except Progress, Decision log and Surprises, which every plan keeps. A small change usually needs only Why, Done when, Changes, one milestone and those three. Say each fact once, in the section that owns it: Context describes today, Changes what's new, and Open questions refers to a Decisions row instead of repeating it.

```markdown
# <What the change does, verb first>

<If questions are open: "Draft: assumes the recommended answers to the open questions.">

<The change and its result in a sentence or two.>

## Why

<The problem, who it affects, and the evidence (an error, a ticket, a measurement). The intent: what's true once this ships. The stated requirements and the requester's answers.>

## Done when

- <Behaviour a person can see, tied to a requirement: a command and its output, a test, something on screen.>

## Context

<How the system works today where the change touches it: files, functions, data, how they connect, and the patterns to follow. Define terms used later.>

## Changes

<The approach in a short paragraph, then the exact contracts: signatures, schemas, config keys, error cases, behaviour.>

## Stays the same

- <What the change leaves alone that an implementer might touch, and why. Where it could break as a side effect, the check that shows it didn't.>

## Milestones

### 1. <Goal of this pull request>

<What it's for and what exists afterwards.>

1. <One change, with its exact location.>
   Check: <command, where to run it, and the expected result>.

Proof: <the commands that show this milestone works on its own>.

## Alternatives considered

| Option | Why not |
| :- | :- |
| <an option really weighed, including doing nothing> | <the reason> |

## Wider change

<Only when the current design makes this change hard: the cause, the wider change, what it simplifies, its cost, your recommendation, and the requester's answer.>

## Decisions

| Decision | Why it's significant | Options and cost | Pick |
| :- | :- | :- | :- |

Reversible picks: <one line each>

## Risks and rollback

- <What could fail, and what prevents it or how to undo it.>

## Open questions

1. <Question.> Recommended: <answer, worded so "yes" accepts it>.

## Assumptions

- <What the plan relies on but you couldn't check, and what to do if it's false.>

## Follow-ups

- <Work deliberately left out, and why.>

## Progress

- [ ] Milestone 1: <goal>
- [ ] Milestone 1 released and checked in production: <the check, only when the plan has one>

## Decision log

- <Decisions made after planning, and review findings turned down: what, why, who.>

## Surprises

- <What turned out different from the plan, with evidence.>
```

The last three sections keep the plan current while it's built, so anyone can pick the work up from the plan alone. The implementer ticks off Progress, splits a half-done milestone into done and remaining, logs each departure from the plan with its reason, and updates the sections it affects.

## Rules the checker enforces

[scripts/plan.mjs](scripts/plan.mjs) rejects a plan that breaks these, so the plan can be rendered as a page and its progress counted:

- One `# ` title. Only the `## ` sections above, each at most once and in the order shown. Why, Done when, Milestones, Progress, Decision log and Surprises are required.
- Each milestone is a `### N. <goal>` heading, numbered from 1 with no gaps. Work that isn't code, such as a production migration, goes under its own `### ` heading without a number.
- Every step under a `### ` heading is a top-level numbered item with a `Check:` line indented under it. Every numbered milestone has a `Proof:` line at the start of a line.
- Progress has a `- [ ] Milestone N: <goal>` item for every milestone, ticked as `- [x]` once it's built. Step items nest under it.

Write steps as a numbered list with one action each, the condition before the action. Write reasoning as prose. No em dashes, double hyphens, emoji or closing summary in prose; commands, flags and identifiers stay exactly as the code spells them. If the `write-docs` skill is available, follow its voice.
