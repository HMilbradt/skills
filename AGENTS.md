# Working in this repository

This repository holds Harrison's agent skills and his global agent instructions. People install the skills with `npx skills`. The global instructions are linked by hand. The README explains both.

## Layout

- `skills/<name>/` holds one skill. The skill's entry point is `SKILL.md`.
- `global/AGENTS.md` is Harrison's personal instruction file for every agent on his machines. It is not about this repository, so do not follow it as a rule for editing here unless it already applies to you.
- `CLAUDE.md` is a symlink to this file. Edit this file, never the link.
- `.claude-plugin/` makes the repository a Claude plugin marketplace with one plugin that holds every skill. New skills join it without any change there. Leave `version` out of both files: without it, every push reaches users as an update.

## Adding or changing a skill

- The folder name and the `name` field in `SKILL.md` must match. Use lowercase letters, digits and single hyphens.
- The `description` field decides when an agent loads the skill. Say what the skill does and when to use it, in plain words a user might type. Stay under 1024 characters.
- A skill does one job and returns its result. Leave the workflow around it to whoever calls it: no steps about committing, pushing, opening pull requests or stopping for review. That keeps skills composable.
- Use only `name` and `description` in the frontmatter unless a harness needs more. Some hosts reject fields outside the Agent Skills spec.
- A skill that must run only when asked sets `disable-model-invocation: true` in its frontmatter, and adds `agents/openai.yaml` with `allow_implicit_invocation: false` under `policy` for Codex.
- Keep `SKILL.md` short enough to read in one pass. Move long reference material and examples into files next to it, and link to them from `SKILL.md` with relative links. Keep those links one level deep.
- Skills copied from another project stay as they are. Fix them upstream, or say in the skill that it has diverged.
- When you add, rename or remove a skill, update the skill list in the README in the same change.

## Writing

Every page in this repository follows the `write-docs` skill. Read `skills/write-docs/SKILL.md` before you write or edit prose here.

## Checking your work

List what the installer would see, without installing anything:

```bash
npx skills@latest add . -l
```

Every skill should appear with its description. A skill that is missing usually has a frontmatter error or a name that does not match its folder.
