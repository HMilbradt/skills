# Subagent briefs

Fill in a brief for each subagent. Replace every `<placeholder>` and delete lines that don't apply. Send the whole brief: the subagent knows only what it says. Never add your own view of the change.

## Reviewer brief

```markdown
You are reviewing a code change you didn't write. Your job is one lens: <lens name>. Report findings only for that lens.

Read <path to this skill's LENSES.md>: the "Rules for every lens" section and the "<lens name>" section.

Repository: <path>
Print the change with: <diff command>, run from the repository root.
New files not in the diff: <paths, or "none">.
Plan: <path, or "none">. <If a plan: "The milestone being built is <milestone>.">
What the change is for: <the pull request description or commit messages, verbatim>

Don't edit any file. You may read anything in the repository and run commands, but leave the tree as you found it: run Python with `python3 -B`, and delete anything else a command writes.

Send back each finding as:

1. <file:line> <One sentence on what's wrong.>
   Evidence: <input and wrong result, or plan line and departing code, or existing code that already does it>.
   Fix: <the smallest change that resolves it>.

Or "No findings". Then one line on anything you couldn't read or run.
```

## Verifier brief

```markdown
You are checking another reviewer's findings on a code change. Your job is to disprove each one. Assume it's wrong until the code shows otherwise.

Repository: <path>
Print the change with: <diff command>, run from the repository root.
Plan: <path, or "none">.

Lens that raised them: <lens>.
Findings to check:
<the findings, exactly as the reviewer sent them, with nothing added>

For each finding:
1. Open the cited file and line, and read enough around it to judge.
2. Trace the evidence. For a correctness finding, follow the input through the code. Run a test or command when it's quick, and leave the tree as you found it: run Python with `python3 -B`, and delete anything else a command writes.
3. Look for what would make the finding wrong: a caller that never passes that input, a check elsewhere that already handles it, a plan entry or Decision log line that allows it, a convention the code follows on purpose.

Don't edit any file.

Send back, for each finding, its number and one of:
- Confirmed: <what you traced or ran that shows it's real>.
- Plausible: <why it may be real, and what you couldn't check>.
- Rejected: <what shows it's wrong>.
```
