# Good and bad skills

Pairs of bad and good drafts. Each bad draft is the way an agent or a rushed author often writes a skill. Each good draft follows [SKILL.md](SKILL.md). Skill names, commands and paths are invented.

Use these to calibrate, not as templates to copy.

## A vague description

Bad

```yaml
description: Helps with changelogs and other release tasks.
```

Good

```yaml
description: Write a changelog entry from the commits since the last release tag, grouped into added, changed and fixed. Use when asked to write release notes or a changelog entry, or to sum up what changed since a version.
```

What changed: the description says what the skill produces and from what. "Use when" names three ways people ask, and one of them never says "changelog". "Other release tasks" is gone, because it would load the skill for version bumps and tagging, which it doesn't do.

## A description that talks about itself

Bad

```yaml
description: This powerful skill lets you easily manage database migrations! I can create, run and roll back migrations using best practices.
```

Good

```yaml
description: Create a database migration from a schema change and check it against a local copy of the database. Use when asked to add a column, table or index, change a schema, or write a migration. Writes and checks the migration only; it does not run it against a shared database.
```

What changed: the description starts with the action, not "This skill" or "I can", and the praise is gone. Running and rolling back were a second job with real risk, so the skill now does one job and says where it stops.

## Synonyms instead of situations

Bad

```yaml
description: Take screenshots. Use when the user says screenshot, screen capture, screengrab, snapshot, capture the screen or grab the screen.
```

Good

```yaml
description: Take a screenshot of a web page in a headless browser and save it as a PNG. Use when asked for a screenshot of a page, or to check how a page looks at phone width.
```

What changed: six names for one request became one. The space went to a second real situation that the bad version would miss.

## A description that breaks the frontmatter

Bad

```yaml
description: Review Terraform plans. Covers: drift, destroyed resources and IAM changes.
```

Good

```yaml
description: Review a Terraform plan for destroyed resources, drift and widened IAM permissions. Use when asked to review or check a plan before it is applied.
```

What changed: the unquoted colon and space after "Covers" makes YAML read a second key, so the frontmatter fails to parse and hosts skip the skill. The good version also says when to use it.

## An invoke-only skill

Bad

```yaml
---
name: deploy-staging
description: Deploy to staging. Use whenever the user mentions deploying, shipping, releasing or staging, or says the code is ready.
---
```

Good

```yaml
---
name: deploy-staging
description: Deploy the current branch to staging and return the URL and the result of the health check. Run only when the user asks for a staging deploy.
disable-model-invocation: true
---
```

With `agents/openai.yaml` next to `SKILL.md`:

```yaml
policy:
  allow_implicit_invocation: false
```

What changed: a deploy has side effects, so the skill runs only when asked. The trigger list is gone: "says the code is ready" would start a deploy nobody asked for. The closing sentence keeps the rule in hosts that ignore the flag, and the Codex file sets the same rule for Codex.

## Choosing whether a skill runs only when asked

| Skill | Runs | Why |
| :- | :- | :- |
| Fix lint errors in changed files | When the task fits | The agent should reach for it when lint fails. Its edits are small and easy to review. |
| Publish a package to a registry | Only when asked | A publish can't be undone, and the user picks the moment. |
| A team's code style rules | When the task fits | Other skills load it, and an invoke-only skill can't be loaded by another skill. |
| Audit every docs page with subagents | Only when asked | It runs long, costs a lot and edits many files. |
| A weekly report the user starts by hand | Only when asked | Nothing else would start it, so its description would only take up context. |

## A skill that runs the workflow around it

Bad

```markdown
## Steps

1. Read the failing test output.
2. Fix the code until the tests pass.
3. Show the user the diff and ask whether it looks right. Wait for approval.
4. Commit with a message like "fix: <summary>" and push.
5. Open a pull request and tell the user the link.
```

Good

```markdown
## Steps

1. Read the failing test output and find the first failure.
2. Fix the code, not the test. If the test itself is wrong, leave it failing and say why in
   your result.
3. Run the failing test, then the whole suite. The step is done when both pass.

## Your result

- What was wrong, in one or two sentences.
- The files changed.
- The test commands run and their results.
- Anything still failing, and why.
```

What changed: the skill stops at its job and reports. Whoever called it decides whether to commit, push or open a pull request. The approval step is gone, because a subagent running this skill has no user to wait for. "Tell the user" became "in your result", and each step ends on something the agent can check.

## Explaining what the agent already knows

Bad

```markdown
## About Git

Git is a distributed version control system. A commit is a snapshot of your files, and
branches let you work on changes in isolation.

## Rules

- ALWAYS follow best practices.
- IMPORTANT: NEVER rebase!!!
- Be careful with merges.
```

Good

```markdown
## Gotchas

- Feature branches are shared, so rebasing one rewrites history that others have pulled.
  To catch up with `main`, merge it into the branch.
- Files under `api/generated/` are rebuilt from the schema. Edit `schema.graphql`, then
  run `make api`.
```

What changed: the Git primer and "best practices" don't change what an agent does, so they're cut. The capitals became a reason, which lets the agent handle cases the rule didn't list. Each gotcha is a fact the agent would get wrong by guessing, and each ban comes with what to do instead.

## Asking instead of deciding

Bad

```markdown
3. Ask the user which output format they want: CSV, JSON or Markdown.
```

Good

```markdown
3. Write the results as a Markdown table. If the user asked for a file that another program
   will read, write CSV instead. Say which you chose in your result.
```

What changed: the step has a default and a condition for the other choice. The skill no longer stalls when its caller is an agent, and the choice is still visible in the result.

## Links that hide what to read

Bad, in `SKILL.md`:

```markdown
See REFERENCE.md for more details.
```

And in `REFERENCE.md`:

```markdown
The full field list is in FIELDS.md.
```

Good, in `SKILL.md`:

```markdown
- Read [FIELDS.md](FIELDS.md) before you map any fields. It lists every field and which are
  required.
- Read [ERRORS.md](ERRORS.md) if the API returns an error.
```

What changed: every file is linked from `SKILL.md` directly, and each link says when to read it. The agent no longer has to open one file to find another, which is where it tends to read only part of a file.

## Name and folder

Bad

```text
PDF_Tools/SKILL.md      name: pdf-helper
```

Good

```text
fill-pdf-forms/SKILL.md      name: fill-pdf-forms
```

What changed: the folder and the name match, so installers and hosts find the skill. The name uses only lowercase letters and hyphens, and says what the skill does instead of "helper".
