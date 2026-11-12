---
name: write-docs
description: Write, edit or review documentation in plain, durable language. Covers READMEs, how-to guides, runbooks, reference pages, explanations, troubleshooting entries and agent instruction files such as AGENTS.md, CLAUDE.md and SKILL.md. Use when asked to write, rewrite, tidy or review docs, or before creating or changing any Markdown page that people or agents will read.
---

# Write docs

Write docs that a busy engineer, a non-technical person and an AI agent can all act on. Put the point first, use plain words, and leave out anything that goes stale on the next ordinary change.

## Before you write

1. Name the reader and what they need to do after reading. If you don't know, write for all three readers at once: plain enough for a non-technical person, exact enough for an engineer, unambiguous enough for an agent.
2. Pick one doc type: tutorial, how-to, reference, explanation, README, agent instructions, runbook or troubleshooting entry. If the draft needs two types, write two pages and link them. [DOC-TYPES.md](DOC-TYPES.md) has a skeleton for each.
3. Check every fact against its source: the code, the config, or the output of a command. Don't write from memory. If you can't check something, say so in the doc or to the user.
4. Look for a page that already owns the topic. Update it instead of starting a new one.

Read [VOICE.md](VOICE.md) before writing prose. Read [EXAMPLES.md](EXAMPLES.md) when you're unsure what good looks like.

## Structure

- The first sentence of the page, and of each section, says what this is or what the reader will get. A reader who stops there should still have the point.
- Give each page one job. Teaching, steps, facts and reasoning go on separate pages that link to each other.
- Headings are sentence case and say what the section tells you. Task headings start with a verb: "Restore one app", not "Restores". Never use "Introduction", "Overview" or "Conclusion".
- Make each section stand on its own. Agents and search land mid-page, so don't rely on "as mentioned above".
- Write steps as a numbered list with one action each. Put the condition before the action ("If the app is running, stop it"). After any step that changes something, say what the reader should see or give a command that checks it.
- When there are several ways to do something, give the default and say when to use another. Don't hand the reader a menu.
- Write a troubleshooting entry as symptom, cause, fix. The heading is the error text or behaviour exactly as the reader sees it. If the error can be normal, say when.
- End when the content ends. No closing summary.

## Sentences

- Write only what the reader can't work out alone. For each paragraph, ask whether the reader would miss it.
- One idea per sentence. Split sentences over about 25 words. Keep paragraphs to five sentences or fewer.
- Use everyday words. When a technical term is the most precise word, define it in plain words the first time it appears, then use the same term every time after. One thing gets one name.
- Use active voice, "you" and the present tense. Name who does the action.
- Use "must" for a hard requirement and "can" for an option. Agents read "should" as optional.
- Be confident where the facts are known. Where they aren't, say so plainly: "not tested", "this depends on your setup".

## Keep it true

Docs rot where they copy a fact that lives somewhere else. Ask this of every specific detail: will the next ordinary change make this sentence false? If yes, rewrite the sentence so it survives the change, link to where the fact lives, or give the command that prints it.

- No counts the system can tell you. Write "every app on the server" and how to list them, not "14 apps".
- No versions unless the version blocks the reader. "Needs Postgres 13 or later" is useful. "Built with Go 1.22" is decoration.
- No file names or paths unless the reader must open, edit or run that file. Describe behaviour instead of where the code lives. Agents can search.
- No time words: currently, now, new, latest, recently, soon, as of, going forward.
- Dates only when the date is the fact: changelog entries, deprecation and removal dates, incident timelines. No "last updated" lines. Version control records that.
- No people's names for ownership. Name the role and link to where owners are listed.
- Keep each fact in one place. If two pages need it, one owns it and the other links to it.

## Formatting

- Write reasoning and explanation as prose. Use lists for steps and for items that are truly parallel. Use a table when the reader compares options or looks up their situation.
- Put anything the reader types or must match exactly in code formatting: commands, error text, config keys, field names.
- Make every command and code sample work when pasted. Mark placeholders clearly, like `<app>`. Run the command if you can. If you didn't, tell the user it's untested.
- No em dashes and no double hyphens in prose. Use a period, comma, colon or parentheses.
- No emoji. Use bold only for UI labels the reader has to find. Use at most one callout per page, and only for something that will hurt if missed.
- Don't put meaning only in an image or a colour. Say it in words too.

## Writing for agents and non-technical readers

The same plain, exact page usually works for all three readers. Layer it: a plain opening anyone can follow, then the steps and details, then deeper reference behind a link. Each reader stops when they have enough.

For non-technical readers, start from what they see (a web address, an error on screen, a padlock) and use one analogy, held the whole way through. End with what it means for them.

For agents, give exact strings to copy, explicit conditions ("If X, do Y"), and the expected result of each step so the agent knows whether to continue.

Split the page when one reader would skip more than half of it. The usual split is a README for people and an AGENTS.md for agents, or a plain "what this means for you" page that links to the technical how-to.

## Agent instruction files

An AGENTS.md or CLAUDE.md is loaded into every session, so every line costs attention on every task.

- Include only what the agent can't learn from the repo: the commands to build, test and check work; decisions that aren't visible in the code, with the reason; areas of the code that mislead; mistakes agents have made more than once; actions that need a human.
- Leave out architecture tours, file listings, counts and general coding advice.
- Don't write in capitals or stack "IMPORTANT" and "ALWAYS". Emphasis makes models over-apply a rule. A rule that must never bend belongs in a hook or a permission setting, not in prose.
- Keep the file short enough to read in one sitting. If it keeps growing, move detail into linked pages or skills.

A SKILL.md follows the same rules. Its `description` decides when an agent loads the skill, so say what the skill does and when to use it in the words a user would type.

## Editing an existing page

- Change what you were asked to change. Note other problems to the user instead of rewriting the page.
- Keep the page's terms and structure unless they are the problem.
- When you find a stale fact, replace it with a pointer to its source rather than a newer copy of the same fact.

## Check your draft

Before you finish, go through the draft once against this list.

1. Read only the first sentence of the page and of each section. Each one should carry its point on its own.
2. Search for em dashes and double hyphens in prose. `grep -n "$(printf '\342\200\224')" <file>` finds em dashes.
3. Search for the banned words and phrases in [VOICE.md](VOICE.md), and for the time words above.
4. Look at every number, version, date, path and hostname (`grep -nE '[0-9]' <file>` helps). Keep each one only if the reader needs it to act and it won't go stale.
5. Check that every procedure is numbered, has one action per step, and says how to tell it worked.
6. Check that every heading is sentence case and says what its section tells you.
7. Run the commands, or tell the user which ones you didn't run.
