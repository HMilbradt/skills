# Before and after

Pairs of bad and good drafts. Each "before" is written the way an LLM or a rushed engineer often writes. Each "after" follows [SKILL.md](SKILL.md). Project names, hosts and commands are invented.

Use these to calibrate, not as templates to copy. When a draft of yours looks like a "before", find the matching "what changed" note.

## README intro

Before

```markdown
# 🚀 Shelfsync

**Shelfsync** is a powerful, lightweight, and blazing-fast solution designed to seamlessly
streamline how you manage and synchronize your data across devices. Built with cutting-edge
technologies like Rust 1.78 and SQLite 3.45, it empowers developers to take full control of
their sync workflows.

## ✨ Key Features
- **Robust:** Battle-tested with 312 unit tests and 98.7% coverage.
- **Extensible:** Supports 17 storage backends out of the box!
- **Developer-Friendly:** A comprehensive API that's easy to use.

Whether you're a hobbyist or an enterprise, Shelfsync has you covered. Let's dive in! 👇
```

After

```markdown
# Shelfsync

Shelfsync keeps a folder in sync between your laptop and a server, and lets you roll any
file back to an earlier version.

## Install

    cargo install shelfsync

## Sync a folder

    shelfsync add ~/Notes user@server:/srv/notes

Shelfsync copies the folder now and then watches it for changes. To roll a file back, see
[Restore a file](docs/restore.md).

## Docs

- [How-to guides](docs/how-to/)
- [Configuration reference](docs/reference.md)
- [How sync conflicts are handled](docs/conflicts.md)
```

What changed: the first sentence says what it does for the reader instead of praising it. Counts, coverage and versions that rot on the next release are gone, and the bold-label feature bullets became a working example. Pattern from [Elegant READMEs](https://www.yegor256.com/2019/04/23/elegant-readme.html) and Stripe's example-first pages.

## How-to step list

Before

```markdown
## Getting Started with Restores

Restoring is a crucial part of any robust backup strategy. It's worth noting that restores
can be performed in a variety of ways depending on your setup. To get started, you'll first
want to ensure that the app is stopped, as restoring while running may potentially cause
issues. Simply run the restore command, which will seamlessly pull the latest snapshot
(snapshots are stored in /mnt/pbs/datastore/ns/apps as of the 2.3 release) and restore it.

- **Step 1:** Stop the app
- **Step 2:** Run `backupctl restore <app>` (make sure to use the right snapshot!)
- **Step 3:** Start the app again and you're good to go! 🎉
```

After

```markdown
## Restore one app from a backup

This replaces the app's data with a backup copy. Anything written since that backup is lost.

1. List the backups for the app and pick one:

       backupctl list <app>

2. Stop the app:

       backupctl stop <app>

3. Restore the backup you picked. To use the most recent one, leave out `<snapshot>`.

       backupctl restore <app> <snapshot>

   You should see `restore complete` and a file count.
4. Start the app:

       backupctl start <app>

5. Open the app and check that recent data you expect is there.
```

What changed: the title names the task and the first line states the consequence. One action per step, condition before action ("To use the most recent one"), expected result, and a final check. The storage path and release number were cut because the reader never needs them. Pattern from [Diátaxis how-to](https://diataxis.fr/how-to-guides/) and [Google style](https://developers.google.com/style/highlights).

## Error and troubleshooting entry

Before

```markdown
### Connection Issues

If you're experiencing connection issues, there could be a variety of reasons. Network
problems are often the smoking gun here. It's important to note that firewalls, DNS, and
misconfigurations can all play a role. Try checking your configuration and restarting the
service. If the problem persists, please reach out to the team for further assistance.
```

After

```markdown
### `connection refused` when the app starts

Cause: the database is not accepting connections yet, or is not running.
This is normal for a few seconds after the server reboots, because the app can start first.

Fix:
1. Check whether the database is running. Look for `db` in the list:

       docker ps

2. If it is not listed, start it: `docker start db`. If it is listed, wait for it to show
   `healthy`, then restart the app.

If the database is healthy and the error continues, the app may have the wrong host in its
settings. See [App settings](settings.md#database).
```

What changed: the heading is the exact text the reader sees, so search finds it. One cause, one check, one fix, and a line saying when the error is expected, which is Stripe's pattern of telling readers an error "can occur when your integration is working correctly". Pattern from [Stripe error handling](https://docs.stripe.com/error-handling) and [Google error messages](https://developers.google.com/tech-writing/error-messages).

## A concept for non-technical readers

Before

```markdown
## Understanding the Reverse Proxy

A reverse proxy serves as a pivotal intermediary layer that terminates TLS connections and
routes inbound HTTP(S) requests to the appropriate upstream services based on host-header
matching. This architecture not only enhances security but also streamlines certificate
management, ensuring a seamless and robust experience. In summary, the reverse proxy is a
key component of our infrastructure.
```

After

```markdown
## What the "front door" server does

Every web address in the house, like photos.example.home, goes to one server first. That
server works like a building's front desk: it checks which app you asked for and sends you
to it.

It also handles the padlock in your browser. That is why you only need to trust one
certificate, and why the padlock looks the same on every app.

If one address stops working but the others are fine, the app is usually the problem, not
the front door.
```

What changed: it starts from what the reader sees (a web address, a padlock) and uses one analogy, held consistently. The jargon is gone, and the last paragraph gives the reader something they can use. "Serves as", "not only... but also", the trailing "ensuring" clause and "In summary" are all gone. Pattern from [GOV.UK clear language](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/) and [Diátaxis explanation](https://diataxis.fr/explanation/).

## Agent instruction file section

Before

```markdown
## 🚨 IMPORTANT RULES: READ CAREFULLY 🚨

- **ALWAYS** write clean, maintainable, well-tested code following best practices.
- **NEVER** make mistakes with the database.
- **Architecture:** The project uses a modular monorepo architecture with 12 packages:
  `packages/api` (Express 4.18), `packages/web` (Next.js 14.1), `packages/shared`, ...
- **Testing:** We currently have 1,240 tests. Make sure they all pass!
- Be thorough and think step by step.
```

After

```markdown
## Commands

- Run one package's tests: `pnpm test <package-name>`
- Typecheck everything: `pnpm typecheck`

## Conventions

- Database changes go through a migration in the `migrations` package, never by hand.
  Production has no other record of schema changes.
- `packages/legacy-billing` is still deployed. Do not copy its error handling; use the
  helpers in `packages/shared`.

## Ask before

- Running a migration against anything other than the local database.
```

What changed: it keeps only what the agent cannot learn by reading the repo: commands, a decision with its reason, and a misleading area. The architecture tour, test count, generic advice and shouting are gone. Anthropic's guidance says emphasis makes models over-apply rules, and that a rule with no exceptions belongs in a hook. Pattern from [Claude Code best practices](https://code.claude.com/docs/en/best-practices).

## Status note that hardcodes volatile facts

Before

```markdown
## Current Status (Updated March 14, 2025)

As of today, we're currently running 14 containers on the services VM (10.0.0.30), managed
by Portainer 2.19.4. The new backup system, which was recently rolled out, now backs up all
9 apps nightly at 2:00 AM to the PBS server (PBS 3.1). Disk usage is at 62% (1.2 TB of
2 TB). Going forward, we plan to migrate the remaining 5 apps from Unraid by end of Q2.
```

After, as a status page

```markdown
## Backups

Every app on the services VM is backed up nightly to the backup server. To see which apps
are covered and when each last ran:

    backupctl status

## Apps still on the old server

Some apps have not moved to the services VM yet. The list is in [Migration](migration.md).
```

After, as a changelog entry, where the date is the point

```markdown
## 2025-03-14

- Nightly backups now cover every app on the services VM.
```

What changed: the status page states what is true in a form that stays true, and points to the command that prints the live numbers. The date moved to the changelog, where it is the fact being recorded. The counts, versions, IP and disk figures were removed, along with "currently", "new", "recently", "now" and "going forward". Patterns from [Google, timeless documentation](https://developers.google.com/style/timeless-documentation) and [Documentation rots](https://codyoh.substack.com/p/documentation-rots-some-kinds-rot).

## Runbook step

Before

```markdown
3. Update the proxy config and restart nginx. Should be fine after that.
```

After

```markdown
3. Check the new config before applying it:

       nginx -t

   Expected: `syntax is ok` and `test is successful`. If not, stop and fix the config.
4. Reload (not restart) so open connections are kept:

       systemctl reload nginx

5. Check that the site answers:

       curl -sI https://app.example.home | head -1

   Expected: `HTTP/2 200`. If not, go to Roll back.
```

What changed: each change has a check before and after it, an expected result, and a pointer to rollback. "Should be fine" is replaced with something the reader can verify. Pattern from runbook guidance ([DawnOps](https://dawnops-site.pages.dev/blog/verification-steps-for-runbooks)).

## Implementation details the reader doesn't need

Before

```markdown
Retries are handled by the `withRetry()` wrapper in `src/lib/net/retry.ts`, which wraps
every `fetch()` call made by `ApiClient` and applies exponential backoff using the
`RETRY_MAX` and `RETRY_BASE_MS` constants exported from `src/config/defaults.ts`
(currently 5 and 200).
```

After

```markdown
Failed requests are retried a few times, with a longer wait before each try. To change how
many times, set `RETRY_MAX`.
```

What changed: the reader needs the behaviour and the one setting they might change. The file paths, function names and current values describe where the code lives today, and all of them go stale on the next refactor. An agent that needs the code can search for `RETRY_MAX`.
