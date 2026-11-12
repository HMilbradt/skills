# Skills

Harrison's agent skills, and the global instructions he gives every coding agent he uses.

A skill is a folder of instructions that an agent loads when a task calls for it. These skills follow the [Agent Skills](https://agentskills.io) format, so they work in Claude Code, Codex, OpenCode, Pi, Cursor, Gemini CLI, Grok Build and other agents that read that format.

This repository replaces `HMilbradt/ai-context` and its `aiconf` installer.

## Install the skills

Run this and pick the skills and agents you want:

```bash
npx skills@latest add HMilbradt/skills
```

To install every skill for your user account, for the agents Harrison uses, without prompts:

```bash
npx skills@latest add HMilbradt/skills -g -s '*' -a claude-code -a codex -a opencode -a pi -y
```

To install one skill:

```bash
npx skills@latest add HMilbradt/skills -s write-docs
```

To pull the latest version of skills you already installed:

```bash
npx skills@latest update
```

The installer keeps one copy of each skill and links each agent to it. Most agents read the shared copy directly. Claude Code reads only its own skills folder, so the installer adds a link there for you. See the [skills CLI](https://github.com/vercel-labs/skills) for every option.

## Skills

| Skill | Use it to |
| :- | :- |
| [write-docs](skills/write-docs/SKILL.md) | Write or edit documentation: READMEs, guides, runbooks, reference pages and agent instruction files. |
| [audit-docs](skills/audit-docs/SKILL.md) | Find docs that no longer match the code, fix or cut them, and report every change. Runs only when you ask for it by name, for example `/audit-docs` in Claude Code. Needs `write-docs`. |
| [performance-first-app-builder](skills/performance-first-app-builder/SKILL.md) | Build or revise a fast, local-first frontend app. |
| [react-mobx-cloudflare-app-builder](skills/react-mobx-cloudflare-app-builder/SKILL.md) | Build a React, MobX and Cloudflare app in a Turborepo. |
| [agent-browser](skills/agent-browser/SKILL.md) | Drive a browser from the command line. Needs the [agent-browser](https://github.com/vercel-labs/agent-browser) command installed separately. |

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

Because these are links, a `git pull` in the clone updates every agent at once.

## Add a skill

Read [AGENTS.md](AGENTS.md). It covers naming, frontmatter, file layout and how to check that the installer finds your skill.

## License

[MIT](LICENSE)
