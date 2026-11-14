---
name: write-skill
description: Write or improve an agent skill in the Agent Skills format. Finds out from the author what the skill must do, writes a SKILL.md that loads at the right time and teaches only what an agent would get wrong, and tests it on a fresh agent. Use when asked to write, create, draft, fix or improve a skill, when a skill isn't loading when it should, or to turn a workflow, prompt or conversation into a skill.
---

# Write a skill

Write or improve one agent skill: a folder with a `SKILL.md` that does one job and returns its result. A skill succeeds when it loads for the right requests and changes what an agent does on them. The description controls the first. The body, built from real failures and checked on a fresh agent, controls the second.

If the `write-docs` skill is installed, load it before you write any prose. If it isn't, follow the writing rules at the end of "Write the body".

Read [EXAMPLES.md](EXAMPLES.md) before you write the description, and again when you're unsure whether a draft is good.

## Find out what the skill must do

1. Collect what you can before asking anything. Read the conversation that asked for the skill, the corrections the author made in it, and the repository's docs, config, commands and agent instructions (AGENTS.md, CLAUDE.md or CONTRIBUTING.md). Read one or two existing skills to match their shape. When improving a skill, read it and every file it links to.
2. Find what the agent gets wrong without the skill. If you can start a fresh subagent, give it two or three realistic requests with no skill loaded and read what it does. Otherwise, use the author's corrections. These failures are what the skill must teach. A skill written from general knowledge repeats what the agent already knows.
3. Ask the author what only they can decide, and only what the first two steps didn't answer. Usually that is some of:
   - The job, in one sentence: "<Verb> <object> and return <result>."
   - The requests that should load it, and nearby requests that shouldn't.
   - What the result looks like.
   - Where the skill should stop to ask its own user, and where it should proceed. See "Decide where the skill asks".
   - Whether it should run only when asked.

   Ask a few questions at a time, each with your recommended answer first, so the author can reply "yes". A fact you can check isn't a question. Small choices that are easy to change later are yours; list them in your result.
4. If the job needs "and then" for a second job, write the first skill and name the second in your result.

When no one can answer, for example when you run as a subagent, take your recommended answer for each question and list it in your result as an assumption to confirm.

Choose where the skill goes. Use the path you were given. Otherwise put the folder beside the existing `SKILL.md` files in the repository, or in `skills/<name>/` at the root if there are none. Where the repository's rules differ from this skill, follow the repository and note the difference in your result.

## Name and frontmatter

- The folder name and the `name` field must match. Use lowercase letters, digits and single hyphens, at most 64 characters, with no hyphen at either end. Installers and hosts may skip a skill whose name breaks these rules.
- Name what the skill does, like `fill-pdf-forms`, and follow the pattern of skills already in the repository. Avoid vague names such as `helper` or `utils`, and the words `claude` and `anthropic`, which some hosts reserve.
- Use only `name` and `description`, plus `disable-model-invocation: true` for a skill that runs only when asked. Some hosts reject fields outside the Agent Skills spec, and others ignore them silently.

## Write the description

An agent sees only the name and description when it decides whether to load a skill, so the description carries all of the triggering. Agents tend to under-use skills: they handle a request themselves when a skill would have helped. Write the description to win the close calls.

- Start with what the skill does, verb first: "Write a changelog entry from...". Not "This skill", "I can" or "You can". The description is injected into the agent's prompt, where "I" and "you" read wrongly.
- Follow with "Use when" and the situations a user is in, in the words they would type. Name each distinct situation once; five synonyms for one request add length, not reach. Include a phrasing that doesn't use the skill's own words, such as "turn this into a skill", or a situation where the user doesn't know to ask, such as "when a skill isn't loading".
- Describe the user's intent, not how the skill works inside.
- Put the main use first. Hosts shorten or drop descriptions when many skills are installed.
- Where a nearby skill or task is easy to confuse with this one, draw the line: "Writes the text only; it does not commit." or "For editing docs, use write-docs." This is the fix when a skill loads too often.
- Keep it to a few sentences, on one line, under 1024 characters. Leave out versions, counts and anything else that goes stale.
- Don't put a colon followed by a space in an unquoted description, because YAML reads it as a new key and the frontmatter breaks. Avoid `<` and `>`, which some hosts escape; write placeholders as `[branch]`.

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

## Decide where the skill asks

A skill that asks too much is tiresome and stalls when its caller is another agent. A skill that never asks builds the wrong thing on a guess. Neither "always ask" nor "never ask" is right, so decide for each point where the skill needs input, and write that decision into the step.

- Have the skill look up what it can check: files, config, command output, history. A fact the agent can find isn't a question.
- Have it ask what only the user knows and a wrong guess would waste real work: intent, scope, a choice users will notice, anything hard to undo. Ask early, a few questions at a time, with a recommended answer first.
- Have it proceed on a stated default for small choices that are easy to change, and report the choice in its result.
- Have it confirm before an action that can't be undone, such as deleting data, sending a message or publishing.

Say in the skill what happens when no one can answer, because the caller may be a subagent: take the recommended answer and list it as an assumption, or stop and say in the result what is missing. Pick whichever costs less if the guess is wrong.

For setup the user gives once, such as an account or a channel, have the skill ask on the first run, save the answer in a file next to its other config, and read it on later runs.

## Write the body

Write `SKILL.md` for a capable agent that has never seen this task.

- Open with one or two sentences on what the skill does and what it returns. Put the instructions that matter most near the top: some hosts keep only the start of a long skill after compacting context.
- Write only what the agent would get wrong without it. For each paragraph, ask whether removing it would change what the agent does. If not, cut it.
- Put gotchas, facts that defy a reasonable guess, next to the step where they matter. They are often the most useful lines in a skill. Take them from the failures you saw, not from imagination.
- Match control to risk. Give exact commands where a small change breaks something. Give the goal and the reason where many approaches work. Don't script every step of a task the agent can already do.
- Write procedures as numbered steps, one action each. End each step on something the agent can check, so it knows the step is done.
- Give one default and say when to use another, rather than a menu.
- Give the reason for a rule instead of capitals or stacked "IMPORTANT" and "ALWAYS". A reason lets the agent handle cases the rule didn't list; emphasis makes it over-apply the rule. A rule that must hold every time belongs in a hook or a permission setting, not in prose.
- Say what to do. Where a prohibition is needed, pair it with the behaviour you want.
- Teach the method, not the answer to one example. A rule bent to fix one test request makes the skill worse on the next.
- Give a template when the result has a fixed shape. A template is followed more reliably than a description of the format.
- Use one name for each thing, every time.

Writing rules, if `write-docs` isn't installed: sentence case headings that say what the section holds; no em dashes, double hyphens or emoji in prose; no counts, versions, dates or time words like "currently"; and in a skill that will be published, no personal names, hostnames or employer details.

## Keep it to one job

A skill does its job and returns the result. Whoever called it decides what happens next, whether that is a user, another skill or a subagent. That keeps skills composable.

- Write no steps that commit, push or open pull requests, unless that action is the skill's job. Then make the skill invoke-only.
- Don't add a step at the end that waits for the user to review the result. The caller reviews it. Questions that change the work belong where the input is needed; see "Decide where the skill asks".
- Write "in your result", not "tell the user". The caller may be another agent.
- End the skill with what its result contains.

## Lay out the files

- Keep `SKILL.md` short enough to read in one pass. Keep in it what every run needs. Move long reference material, and anything only some runs need, into files next to it.
- Link each file from `SKILL.md` with a relative link, and say when to read it: "Read ERRORS.md if the API returns an error." Every file the agent needs is linked from `SKILL.md` itself, not through another file, because agents often read a file reached that way only in part.
- Give a reference file longer than about a hundred lines a contents list at the top, so a partial read still shows what's in it.
- When the skill covers several platforms or variants, put each in its own file so the agent reads only the one it needs.
- Add an EXAMPLES.md with good and bad pairs, each followed by a note on what changed, when the skill asks for judgement: writing, reviewing or deciding. Invent the names in examples.
- Add a script for work that must be exact, or that you saw a test run write from scratch. Say whether to run it or read it. A script must never prompt for input: it rejects unclear input with an error that says what to pass, and keeps its output short.
- Name files for their content, in the case style the repository already uses.
- If the repository lists its skills, in a README table or a manifest, add the new skill to that list.

## Test the skill

1. Check that `name` matches the folder name.
2. Check the description length. This prints the character count, which must be under 1024:

   ```bash
   sed -n 's/^description: //p' <folder>/SKILL.md | wc -c
   ```

3. Check that every relative link in `SKILL.md` points to a file in the folder.
4. Search for workflow steps. Remove any hit that is a step beyond the skill's job, or a question the skill could answer itself:

   ```bash
   grep -rniE 'commit|push|pull request|approv|tell the user|ask the user' <folder>
   ```

5. If the repository documents a check, run it. For example, `npx skills@latest add . -l` lists the skills an installer would find; the new skill must appear with its description.
6. For a model-invoked skill, write requests that should load it, one of them without its key words, and near misses that share its words but need something else. Read the description against each and revise it until it separates them. If the host can measure triggering, run each request a few times and count. Don't paste words from a failed request into the description; describe the situation it stands for.
7. Run the requests from "Find out what the skill must do" again, on a fresh subagent with the skill loaded. Read what the agent did, not only its result: where it hesitated, skipped a file or did something you didn't intend. Compare with the run without the skill. Cut any instruction that made no difference, fix what it misread, and run again. Only run skills that act inside a scratch folder this way. If you can't run them, say in your result that the skill has not been run.

## Your result

```markdown
Skill: <path to the folder>
Job: <one sentence>
Runs: <model-invoked, or only when asked>, because <reason>
Asks: <where the skill asks its user, and where it proceeds on a default>
Files: <each file and what it holds>
Decisions: <what the author decided, and what you assumed for them to confirm>
Test requests: <should load, and should not load>
Fresh-agent test: <what changed with the skill, and what it still got wrong>
Checks run: <commands and what they showed>
Not tested: <what wasn't run>
Repository rules followed over this skill: <differences, or "None">
```
