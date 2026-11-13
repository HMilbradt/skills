# Plan format

Use these sections in this order. Keep a section only if the implementer would miss it, except Progress, Decision log and Surprises, which every plan keeps. A small change usually needs only Why, Done when, Changes, one milestone and those three.

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

## Decision log

- <Decisions made after planning, and review findings turned down: what, why, who.>

## Surprises

- <What turned out different from the plan, with evidence.>
```

The last three sections keep the plan current while it's built, so anyone can pick the work up from the plan alone. The implementer ticks off Progress, splits a half-done milestone into done and remaining, logs each departure from the plan with its reason, and updates the sections it affects.

Write steps as a numbered list with one action each, the condition before the action. Write reasoning as prose. No em dashes, double hyphens, emoji or closing summary. If the `write-docs` skill is available, follow its voice.
