# Skills

Harrison's agent skills, and the global instructions he gives every coding agent he uses.

A skill is a folder of instructions that an agent loads when a task calls for it. These skills follow the [Agent Skills](https://agentskills.io) format, so they work in Claude Code, Codex, OpenCode, Pi, Cursor, Gemini CLI, Grok Build and other agents that read that format.

This repository replaces `HMilbradt/ai-context` and its `aiconf` installer.

## Install the skills

Pick one route per agent. Installing the same skills twice in one agent makes each skill show up twice.

### Claude desktop app

This covers chat, Cowork, and Claude Code when it's signed in to the same Claude account.

1. Open **Customize**, then **Plugins**.
2. Choose **Add**, then **Add marketplace**, and enter `HMilbradt/skills`.
3. Install **hmilbradt-skills**.
4. Turn on **Sync automatically** for the marketplace, so new versions arrive on their own.

### Claude Code

```bash
claude plugin marketplace add HMilbradt/skills && claude plugin install hmilbradt-skills@hmilbradt
```

To get new versions automatically, run `/plugin` in Claude Code, open **Marketplaces**, select **hmilbradt** and choose **Enable auto-update**. To update by hand instead:

```bash
claude plugin marketplace update hmilbradt && claude plugin update hmilbradt-skills@hmilbradt
```

Restart Claude Code after an update. Plugin skills carry the plugin's name, so you call one by name as `/hmilbradt-skills:audit-docs`.

### Codex, OpenCode, Pi, Cursor, Gemini CLI and others

```bash
npx skills@latest add HMilbradt/skills -g -s '*' -a codex -a opencode -a pi -a gemini-cli -y
```

Swap the `-a` values for the agents you use. Cursor and Grok Build read the same shared folder, so they pick the skills up too.

To update:

```bash
npx skills@latest update -g -y
```

If the update reports nothing to update when there should be, run the install command again. See the [skills CLI](https://github.com/vercel-labs/skills) for every option.

## Skills

| Skill | Use it to |
| :- | :- |
| [write-docs](skills/write-docs/SKILL.md) | Write or edit documentation: READMEs, guides, runbooks, reference pages and agent instruction files. |
| [audit-docs](skills/audit-docs/SKILL.md) | Find docs that no longer match the code, fix or cut them, and report every change. Runs only when you ask for it by name. Needs `write-docs`. |
| [write-pr](skills/write-pr/SKILL.md) | Write commit messages and PR descriptions that lead with why the change is made, list the alternatives really considered, and say what was and wasn't tested. |
| [write-skill](skills/write-skill/SKILL.md) | Write a new agent skill that does one job, loads at the right time, and leaves the surrounding workflow to whoever calls it. |
| [write-like-harrison](skills/write-like-harrison/SKILL.md) | Draft standups, Slack messages, updates and notes in Harrison's own voice. |
| [investigate](skills/investigate/SKILL.md) | Find the root cause of a bug or failure with evidence, fix it with one verified change, and stop after two failed fixes. |
| [review-change](skills/review-change/SKILL.md) | Review a code change with fresh subagents, one per lens: its plan, correctness, simplicity and tests. A second round tries to disprove every finding, and only survivors are reported. Changes no files. Runs only when you ask for it by name. |
| [write-plan](skills/write-plan/SKILL.md) | Plan a software change that someone with no context could follow. It asks what only you can decide, writes why, what changes and what doesn't, and milestones that each ship as a pull request, then has a fresh reviewer challenge it. Ask it to challenge an existing plan and it returns a review instead. Plans are saved locally in `.plans/` and not committed. |

## Global instructions

[`global/AGENTS.md`](global/AGENTS.md) is the instruction file Harrison wants every agent to follow on his machines. The skills installer does not handle it. Each agent looks for its global file in a different place, so you link the same file into each one.

Clone the repository once:

```bash
git clone https://github.com/HMilbradt/skills.git ~/code/skills
```

Then link it for each agent you use. Each command replaces the agent's current global file, so back that file up first if you want to keep it.

| Agent | Command |
| :- | :- |
| Claude Code | `ln -sf ~/code/skills/global/AGENTS.md ~/.claude/CLAUDE.md` |
| Codex | `ln -sf ~/code/skills/global/AGENTS.md ~/.codex/AGENTS.md` |
| OpenCode | `ln -sf ~/code/skills/global/AGENTS.md ~/.config/opencode/AGENTS.md` |
| Pi | `ln -sf ~/code/skills/global/AGENTS.md ~/.pi/agent/AGENTS.md` |
| Gemini CLI | `ln -sf ~/code/skills/global/AGENTS.md ~/.gemini/GEMINI.md` |
| Cursor | Cursor has no global file. Paste the contents into User Rules in Cursor's settings. |

Grok Build reads global rules from its own folder, but its docs do not name the file, so it is not listed here yet.

Because these are links, a `git pull` in the clone updates every agent at once:

```bash
git -C ~/code/skills pull
```

The Claude desktop app's chat can't read this file. Paste it into your personal preferences in the app's settings instead.

## Add a skill

Read [AGENTS.md](AGENTS.md). It covers naming, frontmatter, file layout and how to check that the installer finds your skill.

## License

[MIT](LICENSE)
