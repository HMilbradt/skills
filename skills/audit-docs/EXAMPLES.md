# Good and bad audits

Each example shows a situation, an audit that went badly, and one that went well. Project names, files and commands are invented.

## A stale count

The README says:

```markdown
The server runs 14 containers.
```

Six containers have been added since.

Bad audit: changes "14" to "20". The sentence is right today and wrong again after the next deploy.

Good audit: replaces the count with a pointer.

```markdown
To see what the server runs: `docker ps`.
```

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| README.md, Overview | Replaced with a pointer | Stale | The count changes with every deploy. | The compose files define 20 services; the README said 14. |

## An implementation walkthrough in a README

The README explains duplicate detection:

```markdown
## How dedupe works

`scan()` in `src/scan/walker.ts` walks the tree and calls `hashFile()` from
`src/hash/blake.ts` on each file. Results go into `DedupeIndex` (`src/index/dedupe.ts`),
which keeps a `Map<string, FileEntry[]>`. `resolve()` then sorts each bucket by `mtime`
and calls `unlink()` on everything after the first entry.
```

Two of those files have since been renamed.

Bad audit: fixes the two file names and adds the new helper function it found. The section is accurate again and will break on the next refactor. It also grew.

Good audit: replaces the walkthrough with the algorithm, which is what a reader needs and what stays true across refactors.

```markdown
## How duplicates are found

Files with identical contents count as duplicates, whatever their names. For each group of
duplicates, the oldest file is kept and the rest are deleted.
```

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| README.md, How dedupe works | Shortened | Implementation detail | Readers need the rule for which file survives, not the call chain. Two of the paths had already gone stale. | `src/scan/walker.ts` and `src/index/dedupe.ts` no longer exist; the logic now lives under `src/dedupe/`. |

## An explanation that belongs in the code

A docs page explains why uploads retry with random delays:

```markdown
Upload retries add a random delay so that many clients that failed together don't all retry
at the same moment and overload the server again.
```

Bad audit: leaves it. It's accurate, but a developer changing the retry code will never see it.

Good audit: moves the reason into a comment on the retry function, and leaves one line of behaviour in the docs: "Failed uploads are retried automatically."

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| docs/uploads.md, Retries | Moved to code | Implementation detail | The reason matters to whoever edits the retry code, so it now sits on that function. | Comment added on the upload retry function; code unchanged. |

## The doc and the code disagree

The data policy page says:

```markdown
Deleted projects are kept for 30 days and can be restored.
```

The code deletes projects immediately.

Bad audit: rewrites the page to say deletes are permanent. If the 30 days was a promise to users, the audit just hid a bug.

Good audit: changes neither. It reports the conflict.

| Page | Issue | What each side says | Options |
| :- | :- | :- | :- |
| docs/data-policy.md | Wrong | The page promises 30 days of recovery. The delete handler removes the row at once, with no soft-delete column. | Fix the code to match the policy, or change the policy and tell users. |

## A feature that was removed

A how-to explains exporting to CSV. The CSV export was removed and replaced by the JSON export.

Bad audit: adds "Deprecated as of March: use JSON export instead" to the top of the page and leaves the steps. The page is still wrong, and now it carries a date.

Good audit: deletes the page, points its inbound links at the JSON export page, and lists it under "Removed" in the report.

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| docs/export-csv.md | Removed | Stale | The feature no longer exists. | No `csv` export command in the CLI's help output; removed in the commit "Replace CSV export with JSON". |
| docs/index.md, Export | Corrected | Broken link | It linked to the deleted page. | Link now points to docs/export-json.md. |

## A pointer nobody checked

A page lists which backup jobs have run so far. The list is out of date.

Bad audit: replaces the list with "Run `backupctl history` to see every job that has run", and adds "a job missing from the history has never run". Nobody ran the command or read its definition. The history is also trimmed to recent entries, so the added sentence is false.

Good audit: finds the command that reports job runs in the tool's help output, confirms what it prints, and points to it without adding claims about the output. If it can't confirm one, it leaves the list as written and puts it under "Could not check".

## Restyling an accurate page

A runbook's steps are terse but correct. Every command works.

Bad audit: rewrites the whole runbook in its preferred voice, reorders the steps and merges two commands into one. Nothing was wrong, the diff is large, and the merged command was never run.

Good audit: leaves the steps alone. It fixes the one flag that was renamed, checked against the command's help output, and records the other steps under "Checked and correct".

## One agent over everything

Bad audit: one agent is pointed at the whole `docs/` folder. It reads the first part of each page and returns "The docs are mostly up to date but could use more examples." Then it adds an "Examples" section to every page. No claim was checked, every page grew, and the report gives no evidence.

Good audit: builds an inventory, splits it into one target per page with that page's sources, and runs a subagent per target. The report has one row per change, each with evidence, and lists the pages it skipped.

## The report

Bad report:

```markdown
I've completed a comprehensive audit of the documentation and made several improvements
to enhance clarity and accuracy. Key updates include refreshing outdated information,
streamlining the README, and improving consistency across pages. Let me know if you'd
like any further changes!
```

The user can't tell what changed, why, or whether to trust it.

Good report: follows [REPORT.md](REPORT.md). Each change is a row with its page, type, issue, reason and evidence. Deletions are listed on their own. Conflicts wait under "Needs a decision" instead of being settled silently.
