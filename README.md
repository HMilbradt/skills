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

Restart Claude Code after an update. Plugin skills carry the plugin's name, so you call one by name as `/hmilbradt-skills:write-plan`.

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
| [write-pr](skills/write-pr/SKILL.md) | Write commit messages and PR descriptions that lead with why the change is made, list the alternatives really considered, and say what was and wasn't tested. |
| [write-skill](skills/write-skill/SKILL.md) | Write or improve an agent skill that does one job, loads at the right time, asks only what its user must decide, and is tested on a fresh agent. |
| [write-like-harrison](skills/write-like-harrison/SKILL.md) | Draft standups, Slack messages, updates and notes in Harrison's own voice. |
| [investigate](skills/investigate/SKILL.md) | Find the root cause of a bug or failure with evidence, fix it with one verified change, and stop after two failed fixes. |
| [review-change](skills/review-change/SKILL.md) | Review a code change with fresh subagents, one per lens: its plan, correctness, simplicity and tests. A second round tries to disprove every finding, and only survivors are reported. After fixes, it reviews only what changed since the last review. Can also check someone else's review findings. Changes no files. |
| [fix-findings](skills/fix-findings/SKILL.md) | Fix the findings of a review with the smallest change each, following the plan, and record what was turned down so the next review doesn't raise it again. |
| [explain-system](skills/explain-system/SKILL.md) | Explain how an existing system works and why it was built that way, in plain words with a diagram, citing where each part lives. |
| [report-status](skills/report-status/SKILL.md) | Answer "what's left?" with a checked list of what's done, in progress, not done and blocked, without starting any work. |
| [grill](skills/grill/SKILL.md) | Settle what a change must do before it's planned or built. It checks the request against the code, then asks only what you alone can decide, in rounds with a recommended answer each, and records the answers. |
| [write-plan](skills/write-plan/SKILL.md) | Plan a software change that someone with no context could follow. It asks what only you can decide, writes why, what changes and what doesn't, and one pull request's worth of steps unless a slice has to ship first, then has a fresh reviewer challenge it. Ask it to challenge an existing plan and it returns a review instead. Plans are saved locally in `.plans/` and not committed, and also put wherever you ask, such as an issue. |
| [design-ui](skills/design-ui/SKILL.md) | Design and build UI that feels calm, spacious and specific to its product. It starts from the project's design system, writes a short direction, builds to a quality floor and checks the real render at desktop and phone width. |
| [implement-plan](skills/implement-plan/SKILL.md) | Build one milestone of a plan from `write-plan`, running every step's check and keeping the plan's progress and decisions current. Stops when the code doesn't match what the plan assumed. |
| [finish-change](skills/finish-change/SKILL.md) | Take a built change to a pull request that's ready to merge: bring the branch up to date, review, fix, run the repository's verification, commit, push, open the pull request, then clear failing checks and review comments. Runs only when you ask it to finish or ship a change. Doesn't merge or deploy. |
| [retro](skills/retro/SKILL.md) | Look back over agent sessions and list the changes to instructions, skills, checks, scripts and permissions that would have saved you the most effort, each with its evidence. Changes no files. |

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
