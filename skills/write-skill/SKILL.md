---
name: write-skill
description: Write a new agent skill in the Agent Skills format. Produces a folder whose SKILL.md does one job and returns its result, with a name that matches the folder, a description that says when to load it, no commit or review steps, and run-only-when-asked settings where they fit. Use when asked to write, create or draft a skill, or to turn a workflow, prompt or conversation into a skill.
---

# Write a skill

Write one agent skill: a folder with a `SKILL.md` that does one job and returns its result. Most of the work is in two places: the description, which decides when the skill loads, and the split between what goes in `SKILL.md` and what goes in files next to it.

If the `write-docs` skill is installed, load it before you write any prose. If it isn't, follow the writing rules at the end of "Write the body".

Read [EXAMPLES.md](EXAMPLES.md) before you write the description, and again when you're unsure whether a draft is good.

## Before you write

1. State the job in one sentence: "<Verb> <object> and return <result>." If the sentence needs "and then" for a second job, write the first skill and name the second in your result.
2. Gather what the skill must teach from real material: the conversation that asked for it, corrections the user made, and the repository's docs, config and commands. A skill written from general knowledge repeats what the agent already knows.
3. Choose where it goes. Use the path you were given. Otherwise put the folder beside the existing `SKILL.md` files in the repository, or in `skills/<name>/` at the root if there are none.
4. Read the repository's agent instructions (AGENTS.md, CLAUDE.md or CONTRIBUTING.md) and one or two existing skills. Where the repository's rules differ from this skill, follow the repository and note the difference in your result.

If you can't state the job in one sentence, stop and say in your result what you would need to know.

## Name and frontmatter

- The folder name and the `name` field must match. Use lowercase letters, digits and single hyphens, at most 64 characters, with no hyphen at either end. Installers and hosts may skip a skill whose name breaks these rules.
- Name the action, verb first, like `fill-pdf-forms`, and follow the pattern of skills already in the repository. Avoid vague names such as `helper` or `utils`, and the words `claude` and `anthropic`, which some hosts reserve.
- Use only `name` and `description`, plus `disable-model-invocation: true` for a skill that runs only when asked. Some hosts reject fields outside the Agent Skills spec.

## Write the description

An agent sees only the name and description when it decides whether to load a skill, so the description carries all of the triggering.

- Start with what the skill does, verb first: "Write a changelog entry from...". Not "This skill", "I can" or "You can".
- Follow with "Use when" and the requests a user would type. Name each distinct situation once; five synonyms for one request add length, not reach. Include a phrasing that doesn't use the skill's own words, such as "turn this into a skill".
- Put the main use first, because some hosts shorten long descriptions in their listing.
- Where a nearby skill or task is easy to confuse with this one, draw the line: "Writes the text only; it does not commit." or "For editing docs, use write-docs."
- Keep it to a few sentences, on one line, under 1024 characters. Leave out versions, counts and anything else that goes stale.
- Don't put a colon followed by a space in an unquoted description. YAML reads it as a new key and the frontmatter breaks. Use a period or a comma, or quote the whole value.

## Decide whether it runs only when asked

A skill is model-invoked by default: the agent loads it when a task fits. Make it invoke-only, so it runs only when the user names it, when either is true:

- Running it unasked would surprise or cost the user: it deploys, sends a message, changes something outside the repository, edits many files, or runs long or starts many subagents.
- Nothing but the user would ever start it. An invoke-only skill keeps its description out of the agent's context in hosts that support the flag, so it costs nothing in sessions that don't use it.

Keep a skill model-invoked when the agent should apply it whenever the task fits, or when another skill loads it. An invoke-only skill can't be loaded by another skill.

For an invoke-only skill:

1. Add `disable-model-invocation: true` to the frontmatter.
2. Add `agents/openai.yaml`, which Codex reads:

   ```yaml
   policy:
     allow_implicit_invocation: false
   ```

3. Write the description for a person browsing commands: what it does in a sentence or two, then "Run only when the user asks for <thing>." Leave out lists of trigger phrases. The closing sentence also keeps the rule in hosts that ignore the flag.

## Write the body

Write `SKILL.md` for a capable agent that has never seen this task.

- Open with one or two sentences on what the skill does and what it returns.
- Write only what the agent would get wrong without it. For each paragraph, ask whether removing it would change what the agent does. If not, cut it.
- Write procedures as numbered steps, one action each. End each step on something the agent can check, so it knows the step is done.
- Match control to risk. Give exact commands where a small change breaks something. Give the goal and the reason where many approaches work.
- Give one default and say when to use another, rather than a menu.
- Give the reason for a rule instead of capitals or stacked "IMPORTANT" and "ALWAYS". A reason lets the agent handle cases the rule didn't list; emphasis makes it over-apply the rule.
- Say what to do. Where a prohibition is needed, pair it with the behaviour you want.
- Put gotchas, facts that defy a reasonable guess, in `SKILL.md` next to the step where they matter.
- Use one name for each thing, every time.
- Decide instead of asking. Where the skill would ask the user a question, give it a default and have it note the choice in its result. It stops only when it can't continue, and says in its result what is missing.

Writing rules, if `write-docs` isn't installed: sentence case headings that say what the section holds; no em dashes, double hyphens or emoji in prose; no counts, versions, dates or time words like "currently"; and in a skill that will be published, no personal names, hostnames or employer details.

## Keep it to one job

A skill does its job and returns the result. Whoever called it decides what happens next, whether that is a user, another skill or a subagent. A step that waits for a user's approval stalls a subagent that has no user.

- Write no steps that commit, push, open pull requests, or stop for the user to review or approve. The exception is a skill whose job is that action.
- Write "in your result", not "tell the user". The caller may be another agent.
- End the skill with what its result contains. When the result has a fixed shape, give a template.

## Lay out the files

- Keep `SKILL.md` short enough to read in one pass. Keep in it what every run needs. Move long reference material, and anything only some runs need, into files next to it.
- Link each file from `SKILL.md` with a relative link, and say when to read it: "Read ERRORS.md if the API returns an error." Every file the agent needs is linked from `SKILL.md` itself, not through another file, because agents often read a file reached that way only in part.
- Add an EXAMPLES.md with good and bad pairs, each followed by a note on what changed, when the skill asks for judgement: writing, reviewing or deciding. Invent the names in examples.
- Add a script only for work that must be exact and would otherwise be rewritten on every run, such as a validator. Say whether to run it or read it.
- Name files for their content, in the case style the repository already uses.
- If the repository lists its skills, in a README table or a manifest, add the new skill to that list.

## Check the skill

1. Check that `name` matches the folder name.
2. Check the description length. This prints the character count, which must be under 1024:

   ```bash
   sed -n 's/^description: //p' <folder>/SKILL.md | wc -c
   ```

3. Check that every relative link in `SKILL.md` points to a file in the folder.
4. Search for em dashes and double hyphens in prose. Any hit outside a YAML fence or a command is a mistake:

   ```bash
   grep -rn "$(printf '\342\200\224')" <folder>
   grep -rnE '(^|[^-])-{2}([^-]|$)' <folder>
   ```

5. Search for workflow steps. Remove any hit that is a step beyond the skill's own job:

   ```bash
   grep -rniE 'commit|push|pull request|approv|tell the user|ask the user' <folder>
   ```

6. If the repository documents a check, run it. For example, `npx skills@latest add . -l` lists the skills an installer would find; the new skill must appear with its description.
7. For a model-invoked skill, write three requests that should load it, one of them without its key words, and three near misses that share its words but need something else. Read the description against each and revise it until it separates them.
8. If you can start a fresh subagent, and the skill only reads or writes inside a scratch folder, run one realistic request with the skill loaded and read what the agent did. Fix what it misread. Otherwise, say in your result that the skill has not been run.

## Your result

```markdown
Skill: <path to the folder>
Job: <one sentence>
Runs: <model-invoked, or only when asked>, because <reason>
Files: <each file and what it holds>
Assumptions: <choices made without asking>
Test requests: <should load, and should not load>
Checks run: <commands and what they showed>
Not tested: <what wasn't run>
Repository rules followed over this skill: <differences, or "None">
```
