# Doc types

Pick the type before you write. Each type answers one need: to learn (tutorial), to get a task done (how-to), to look something up (reference), or to understand why (explanation). READMEs, agent instruction files, runbooks and troubleshooting entries are common shapes built from those four. This split comes from [Diátaxis](https://diataxis.fr/).

If a draft needs two types, write two pages and link them.

## Tutorial

A tutorial teaches a newcomer by having them build something small. The goal is that they finish and feel able, not that a real task gets done. It must work every time, for everyone. Keep explanation to a minimum and offer no alternatives.

```markdown
# Build your first <thing>

In this tutorial you build <concrete result>.

## Before you start
<What they need installed or open. Link to the install guide.>

## Step 1: <do the first visible thing>
<One action.> You should see:
<expected output>

## Step 2: <next thing>

## What you built
<One or two sentences. Link to the how-to guides for real use and the explanation page for the why.>
```

## How-to guide

A how-to helps someone who already knows what they want to do. The title names the task. Put conditions before actions. Don't teach. Link out for background and full option lists.

```markdown
# <Verb> <object>

<One sentence: what this does and when you would do it. Say what is lost or changed if that matters.>

## Before you start
- <Access or tool the reader needs>

## Steps
1. <Action.>
2. If <condition>, <action>. Otherwise, <action>.
3. <Action.> You should see <result>.

## Check it worked
<Command or visible result.>

## If something goes wrong
<Link to troubleshooting, or one or two common failures.>
```

## Reference

Reference describes. It doesn't instruct. Keep it neutral, complete and laid out the same way for every entry. Its structure mirrors the thing it describes: commands, endpoints, config keys. Generate it from the source when you can, so it can't drift.

```markdown
# <Thing> reference

<One sentence on what this covers.>

## <name>
<What it is or does, in one sentence.>

| Field | Type | Required | Description |
| :- | :- | :- | :- |
| ... | ... | ... | ... |

Example:
<short code block>

Errors: <conditions and what they mean, or a link>.
```

## Explanation

An explanation is for someone who wants the reasoning: how something works, why it was built this way, and what was considered instead. It has no steps.

```markdown
# How <thing> works

<Two or three sentences: the short answer.>

## The problem it solves
## How it works
## Why this design, and what we didn't choose
## What this means for you
<Practical consequences. Link to the how-to guides.>
```

## README

The README is the front door. It answers, in order: what is this, should I care, how do I start, where do I go next. The opening is one or two sentences, not a page. Everything deeper is a link.

```markdown
# <name>

<One or two sentences: what it does and for whom, in plain words.>

## Install
<Shortest path that works.>

## Use
<The one or two most common uses, with an example the reader can run and the result they'll see.>

## Docs
<Links to how-tos, reference and explanation.>

## License
<One line or a link.>
```

## Agent instruction file

An AGENTS.md or CLAUDE.md is loaded into every session. It holds only what the agent can't learn by reading the repo. See the "Agent instruction files" section in [SKILL.md](SKILL.md) for what to leave out.

```markdown
# <project> agent instructions

## Commands
- Install: <command>
- Run one test: <command>
- Check types and lint: <command>

## Conventions
- <Decision not visible in the code, and the one-line reason>
- <Old pattern that appears everywhere but must not be copied>

## Gotchas
- <Thing that looks wrong but is right, or the reverse>

## Ask before
- <Actions that need a human>
```

## Runbook

A runbook is a how-to for operating a system, often read under pressure by a stressed person or an agent. Every command can be pasted as is. Every change is followed by a check. Every risky step says how to undo it.

```markdown
# <Do X>

<When to use this runbook, in one sentence, and what happens if nobody acts.>

## Before you start
- <Access needed>
- <Who to tell>

## Steps
1. Check the current state: `<command>`. Expected: <output>.
2. <Change>: `<command>`
3. Check it worked: `<command>`. Expected: <output>. If not, go to Roll back.

## Roll back
1. <Action>

## Afterwards
<What to record or update.>
```

## Troubleshooting entry

Write one entry per symptom. The heading is what the reader sees, word for word, because that is what they search for. Stripe's error docs use the same order: what happened, why, and what to do.

```markdown
### <Exact error text or visible symptom>

Cause: <one sentence>.
<If it can be normal: "This is normal when ...">

Fix:
1. <Check>: `<command>`
2. <Action>.

If that doesn't work: <next step or who to ask>.
```
