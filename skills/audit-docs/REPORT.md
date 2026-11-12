# Report format

End every audit with a report in this format. Use the same headings in the same order, so reports read the same way every time. Keep a section with "None" rather than dropping it.

The report is a record of one audit, so it can name counts and files. The docs themselves still can't.

```markdown
## Docs audit: <scope>

<Two or three sentences: what was audited, the main problems found, and whether anything needs a decision.>

### Changes

| Page | Change | Issue | Why | Evidence |
| :- | :- | :- | :- | :- |
| <path, section> | <change type> | <issue type> | <one sentence> | <what was checked> |

### Removed

<Every whole page or section that was deleted, one line each, with where its content went: nowhere, a code comment, or another page.>

### Needs a decision

| Page | Issue | What each side says | Options |
| :- | :- | :- | :- |

### Outside scope

<Problems found on pages outside the scope, one line each with the page and the evidence. These pages were not edited.>

### Could not check

<Claims left as written because they couldn't be verified, grouped by page, with the reason.>

### Checked and correct

<Claims verified and left alone, grouped by page. A short line each is enough.>

### Not audited

<Pages in scope that were skipped, and why.>

### How this was checked

<Commands run and searches made, in one short list.>
```

## Change types

| Change | Use it when |
| :- | :- |
| Removed | The passage is gone and nothing replaces it. |
| Shortened | The passage stays but lost detail the reader doesn't need. |
| Corrected | A fact was wrong and is now right. |
| Replaced with a pointer | A copied fact became a link or a command that prints it. |
| Moved to code | An explanation became a comment next to the code it explains. |
| Merged | A duplicate was folded into the page that owns the topic. |
| Rewritten | The meaning held but the wording broke the `write-docs` rules. |
| Added | Something missing made the page wrong. |

## Issue types

| Issue | Meaning |
| :- | :- |
| Stale | It was true once and the code has moved on. |
| Wrong | It was never true, or no source supports it. |
| Implementation detail | It describes how the code is built rather than what it does. |
| Duplicate | Another page owns this fact. |
| Unclear | It's accurate, but a reader can't act on it. |
| Missing step | A procedure fails without something it leaves out. |
| Broken link | The link target is gone or renamed. |
