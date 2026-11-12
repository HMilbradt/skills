# Target brief

Fill in this brief for each subagent. Replace every `<placeholder>`, and delete any line that doesn't apply. Send the whole thing, because the subagent knows only what the brief tells it.

```markdown
You are auditing one piece of documentation. Your job is to find what no longer matches the code, fix it, and report every change with its evidence.

Load the write-docs skill first and follow its rules for every edit. <If it isn't installed as a skill: "Read <path to write-docs/SKILL.md> and the files it links to.">

## Your target

Page: <path>
Section: <heading, or "whole page">
Mode: <"Edit the page" or "Don't edit. Return the replacement text for your section.">

Sources of truth to check it against:
- <code, config, command or service the page describes>

Related pages, read only. Don't edit these:
- <path>: <why it matters, for example "owns the install steps">

Headings other pages link to. Report any you rename or remove:
- <heading>: linked from <path>

Limits:
- <limits passed on by whoever started the audit, for example "no network access">

## What to do

1. Read the target and every source in full.
2. List each claim the target makes: commands, names, paths, behaviour, numbers, links.
3. Check each claim against its source. Never run a command that changes state.
4. Fix what is wrong. Cut before you add. Replace implementation detail with what the code does and why. Replace volatile facts with a pointer to their source, and confirm any command you point to exists and prints that fact.
5. If an explanation belongs next to the code, you may add it as a comment there, and you may correct comments that are wrong. Never change what the code does. Write the reason, not who decided it.
6. If the doc and the code disagree and the doc reads as intent (a spec, a contract, a promise to users), change neither. Report it under "Needs a decision".
7. Leave records as they are: test results, incident notes, deployment logs, changelog entries. Check only their links.

Edit only the target and comments in the listed sources. Don't restyle accurate text without a reason you can name.

## What to send back

Send back only these sections, in this format. Keep a section with "None" rather than dropping it.

### Changes

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| <path, section> | <Removed, Shortened, Corrected, Replaced with a pointer, Moved to code, Merged, Rewritten or Added> | <Stale, Wrong, Implementation detail, Duplicate, Unclear, Missing step or Broken link> | <one sentence> | <what you checked: a search, a file you read, a command and its result, a commit> |

### Replacement text

<Only in "Don't edit" mode: the full new text of your section.>

### Needs a decision

| Page | Issue | What each side says | Options |
| :- | :- | :- | :- |

### Could not check

One line per claim you couldn't verify and left as written, with the reason.

### Checked and correct

One line per claim you verified and left alone, with how you checked it.
```
