---
name: audit-docs
description: Audit a repository's documentation for pages that no longer match the code, then fix them using the write-docs rules, including cutting what is no longer needed. Ends with a structured report of every change and why. Run only when the user asks for a docs audit.
disable-model-invocation: true
---

# Audit docs

Find documentation that no longer matches reality, fix it, and report every change with its reason. Fixing often means cutting: a shorter page that is true beats a longer one that drifts.

The writing rules come from the `write-docs` skill. Load it before you start. If it isn't available, stop and say so in your result, because this skill depends on it.

## How the audit runs

You coordinate. Subagents do the reading and editing, one small target each. Never point one agent at the whole set of docs: it skims, misses drift, and returns vague advice.

1. Set the scope.
2. Build an inventory of the docs in scope.
3. Split the inventory into targets.
4. Run one subagent per target.
5. Do a cross-page pass yourself.
6. Check every change, then write the report.

## 1. Set the scope

If you were given pages, a folder or an area of the code, that is the scope. Otherwise the scope is every doc in the repository. The targets in step 3 keep each subagent's share small either way.

## 2. Build an inventory

Find the pages in scope: READMEs, `docs/` folders, other Markdown pages, runbooks, and agent instruction files (AGENTS.md, CLAUDE.md, SKILL.md). Leave out vendored and generated files.

For each page, note what it makes claims about: which code, commands, services or config it describes. Use headings, links and a search for code-formatted names. Don't read every page in full here; that is the subagents' job.

## 3. Split into targets

A target is one page plus the sources of truth it makes claims about. Make each target small enough that a subagent can read the page and its sources in full. Give a subagent only the sources its claims need, not whole folders: every source it reads costs time and tokens.

- If a page is too long for one subagent, split it into section targets. Section subagents don't edit. They return the replacement text for their section, and you apply it, so only one agent ever edits a file.
- If two pages state the same fact, put them in the same target, or leave the duplicate for your cross-page pass.
- Note the headings that other pages link to, so a subagent that renames or removes one can report it.

## 4. Run one subagent per target

Give each subagent the brief in [TARGET-BRIEF.md](TARGET-BRIEF.md), filled in for its target. Pass on any limits you were given, such as no network access. Run the subagents in parallel if your harness allows it. If your harness has no subagents, audit the targets one at a time and start each with a fresh read of its page and sources.

Each subagent checks its page's claims, edits its page, and returns its findings in the report's format. Treat what comes back as a claim to check, not a result.

## 5. Cross-page pass

Some problems only show across pages. Handle these yourself, on pages in scope:

- A fact stated on several pages. Keep it on the page that owns it and link to that page from the others.
- Links into a section or page that a subagent removed or renamed. Fix or remove each one.
- A page left nearly empty after its target was cut. Delete it, or merge what is left into the page that owns the topic.
- A page nothing links to. Link it from where readers would look, or flag it if it seems obsolete.

When the problem sits on a page outside the scope, don't edit that page. List it under "Outside scope" in the report.

## 6. Check every change and report

Review every change yourself. For each one, confirm the evidence in its report row holds. Undo anything you can't back up. Run the "Check your draft" list from `write-docs` on the lines that changed. Problems it finds in untouched text are fixed only if you can verify the fix; otherwise list them under "Could not check".

Then write the report in the format in [REPORT.md](REPORT.md).

## What counts as out of date

Check each claim against its source. The source is the code, the config, or the output of a command, never another doc page.

| Claim in the doc | How to check it |
| :- | :- |
| A command or flag | Read the command's own help output, or find where it is defined. Never run a command that changes state. |
| A file, path, config key, env var or function name | Search the repo for it. |
| A description of behaviour | Read the code that does it. |
| A count, version, date, hostname or person | Compare against the source. Usually replace it with a pointer to the source, as `write-docs` says, rather than a newer copy. |
| A link inside the repo | Check that the target file and heading exist. Check outside links only if you were asked to. |
| A feature, page or service | Search for it. If it is gone, find the commit that removed it. |
| Live state of a running system | Check it only if you were given access. Otherwise leave it as written and list it under "Could not check". |

A pointer you add must work. Confirm a command exists, and that it prints the fact, from its help output or its definition. Don't add claims about what its output means unless you checked them.

Git history gives a hint, not proof. If the code a page describes changed after the page last did, look harder at that page:

```bash
git log -n 1 <page>
git log -n 1 <source>
```

## When the doc and the code disagree

Don't assume the code is right. A spec, a contract, a design decision or a promise to users can describe what the code is meant to do, and the code may have the bug. If the page reads as intent rather than description, don't edit either side. Put it under "Needs a decision" in the report with what each side says.

## Records

Some text records what happened: changelog entries, test results, incident notes, deployment logs. A record is true about its moment, so don't update or cut its content. Check only its links.

When records sit inside a page that describes how things work, treat all of that page's records the same way. Leave them in place and list the page under "Needs a decision" with the options: move the records to a page of their own, or cut them because version control already holds them.

## Cut before you add

Remove or shrink a passage when:

- It describes something that no longer exists.
- It walks through the implementation: file by file, function by function, or values copied from code. Replace it with what the code does and why, at the level of a spec or an algorithm, and let readers search for the code.
- The explanation belongs next to the code. A note on why a function works the way it does is better as a comment on that function. Move it there and leave one line of behaviour in the doc. You may add or correct comments, but never change what the code does. A comment is still a change to a code file, so list each one in the report. Write the reason, not who decided it.
- It repeats a page that owns the topic. Link to that page instead.
- It is in an agent instruction file and the agent could learn it by reading the repo.

Don't remove records, license text, or reference pages that are still accurate. If you suspect something is obsolete but can't show it, flag it instead of cutting.

Add text only when its absence makes the page wrong, such as a missing step that makes a procedure fail. Every addition needs a reason in the report, like every other change.

## Improving pages you audit

Apply the `write-docs` rules to the pages in scope, but every change needs a reason you can name in a report row. Don't restyle an accurate passage only because you would have written it differently. Keep the page's structure and terms unless they are the problem.

## Examples

[EXAMPLES.md](EXAMPLES.md) shows audits that went well and audits that went badly. Read it before your first audit in a session.
