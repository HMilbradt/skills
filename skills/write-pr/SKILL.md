---
name: write-pr
description: Write commit messages and pull request titles and descriptions that lead with why the change is made, list the alternatives that were really considered, and say exactly what was tested and what wasn't. Use when asked to write, draft or update a commit message, a PR or merge request title or description, or before committing or opening a pull request. Writes the text only; it does not commit, push or open the pull request.
---

# Write PR

Write the commit message, or the pull request title and description, for a change. The diff already shows what changed. The text says what the diff can't: why the change is needed, what else was weighed, and how far it was checked.

This skill writes the text and returns it in your result. Committing, pushing and opening the pull request belong to whoever called it.

## Gather the facts

Read the sources before you write, and write only what they support.

| Source | What it gives you | Where to find it |
| :- | :- | :- |
| The change | What changed | For a commit, the staged diff. For a pull request, the commits on the branch and its diff against the branch it merges into. |
| The conversation | Why, what was tried and dropped, what was run | The request, the decisions, rejected approaches, and commands with their output. |
| Linked issues and design docs | The problem in the reporter's words | Issue references in the branch name, the commits or the conversation. Read them if you can reach them. |
| The repository's conventions | Subject style, trailers, templates | Recent commit messages, a pull request template such as `.github/pull_request_template.md`, and the contributing guide. |
| The current description | What reviewers have already read | When updating a pull request, read its title and body first. |

If you don't know the base branch, assume the default branch and say so in your result.

## Find the why

The why is the problem the change solves: what was wrong, missing or about to break, and who it affected. It comes from a person or a record, such as the request, an issue, an error message or a design doc. The diff rarely says it. A reason worked out from the code alone is a guess.

1. If the sources state the why, write it specifically. Say what happened ("exports over 30 seconds time out"), not a goal ("improve exports").
2. If they don't, don't invent a reason. Describe what the change does, which the diff supports. In a pull request body, put this placeholder where the why goes: `<Why: not recorded. Add the reason before merging.>`. In a commit message, leave the reason out. Either way, put the missing reason first in your result.

## Write the text

Use the formats in [TEMPLATES.md](TEMPLATES.md). Read [EXAMPLES.md](EXAMPLES.md) when you're unsure what good looks like.

- The subject or title says what the change does, in the imperative, specific enough to pick out of a one-line log. It should complete "If applied, this commit will...".
- The body opens with the why. Then say what the change does about it in a sentence or two, as behaviour. Don't walk the diff file by file. Name a file only when the reviewer needs to look at it closely.
- Say what the change doesn't do or makes worse: known shortcomings, follow-ups left out, behaviour users will notice, and anything hard to undo.
- Describe the change as it stands, not the session that made it. No "first I tried", "as discussed" or "per your request". Someone who never saw the conversation should understand it months later.
- Links die, so state the key fact from a linked issue as well as linking it.
- Fit the length to the change. A typo fix needs a subject and nothing else.

### Alternatives considered

Include alternatives only when there were real ones: options someone proposed, tried, or rejected, or an obvious option a reviewer will ask about. Take them from the conversation, an issue, a design doc, or an approach tried and reverted in the commit range.

Write one line per option: the option, and why this change was chosen over it, against something concrete such as cost, risk or a constraint. This is the "considered options" part of an architecture decision record, cut down to a line each.

Leave the section out when nobody weighed anything else. Don't pad it with options nobody considered, such as "do nothing" or "rewrite it". If you think a reviewer will ask about an option that was never discussed, raise it in your result instead of writing a verdict on it.

### What was tested

- List each check that was run, as the command or action, and what it showed.
- List what wasn't tested, with the reason if you know it: a platform you couldn't reach, a migration not run on real data, a path with no test.
- If nothing was run, write "Not tested." Don't soften it.
- Never write "tested", "verified" or "works" without the check behind it. Claim CI passed only if you saw the result. A test that was written but not run is not a check.
- Name type checks, linters and builds as what they are. They don't show the behaviour works.

## Follow the repository first

- If recent history follows a convention, such as Conventional Commits prefixes, ticket keys in subjects or `Signed-off-by` trailers, follow it. Otherwise use plain sentence case subjects with no type prefix. Conventional Commits pays off when tooling builds changelogs or versions from it; without that tooling the prefix costs subject space and says little.
- If the repository has a pull request template, fill in its sections in its order, with the why first in its description section. Leave a checklist item unticked unless it was done and you saw it. If the template has no place for alternatives or for what wasn't tested, add them at the end.
- Keep the trailers the repository or your instructions require, such as issue links and co-author lines.

## Update an existing description

When the change has moved on during review, rewrite the title and body to match what the change does now. Don't append "Update:" notes. Drop test results from code that has since changed, or say which version they ran on.

## Voice

Write like a senior engineer leaving a note for a colleague who will read it in a year.

- Lead with the point. One idea per sentence. Everyday words, active voice.
- No em dashes or double hyphens in prose. No emoji. Sentence case headings. No bold labels at the start of bullets.
- No filler or hype: "This PR", "various improvements", "comprehensive", "robust", "seamless", "enhance".
- Put commands, file names, error text and config keys in code formatting.
- Counts, paths, versions and dates are fine when they are the fact. A commit message records one moment, so unlike a docs page it doesn't go stale.

If the `write-docs` skill is installed, its lists of words and phrases to avoid apply here too. This skill doesn't need it.

## Return the result

1. Give the commit message in a code block. For a pull request, give the title on its own line and the body in a code block.
2. After the text, list the gaps: a missing why, claims you couldn't confirm, assumptions such as the base branch, unrelated changes that look like they belong in a separate commit, and alternatives a reviewer may raise that nobody discussed.

Before you return, check the draft:

1. The first sentence of the body says why, or the placeholder stands in for it.
2. Every testing claim traces to a check you saw run.
3. Every alternative traces to a source.
4. The subject is imperative, has no trailing period, and fits on one line of a log.
5. Nothing refers to the session or the conversation.
6. No em dashes: `grep -n "$(printf '\342\200\224')"` on the draft finds them.
