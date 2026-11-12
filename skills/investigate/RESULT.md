# Result format

End every investigation with a result in this format. Use the same headings in the same order, so results read the same way every time. Keep a section with "None" rather than dropping it.

The result is a record of one investigation, so it can name files, commands, counts and times.

```markdown
## Investigation: <the symptom in a few words>

Status: <one status from the table below>

<Two or three sentences: the cause or that it is unknown, what changed, and what still needs a decision or a check.>

### Symptom

<What fails, exactly: the command or action, the expected result, the actual result and the error text. When it started and what changed around then, if known.>

### Reproduction

<The command or steps that show the failure, and the output that shows it. The failure rate, if it is intermittent. If it couldn't be reproduced: what you tried, and what would let you.>

### Hypotheses

| Hypothesis | Prediction | Test | Result | Verdict |
| :- | :- | :- | :- | :- |
| <candidate cause> | <what would be true if it is the cause> | <what you ran or read> | <what happened: evidence for and against, labelled ran, read or inferred> | <Confirmed, Ruled out or Untested> |

### Root cause

<The cause, why it is wrong, and the change that makes the failure come and go. Contributing causes, one line each. Or "Unknown", the hypotheses still open, and the check that would decide between them.>

### Fix

<What changed, where, and why it removes the cause. Or "None" and the reason: you were asked only to investigate, the fix needs a decision, or you stopped.>

| Attempt | Change | Expected | Result | Undone |
| :- | :- | :- | :- | :- |
| <1> | <what you changed> | <the result you expected> | <what happened> | <Yes or No> |

### Verification

<Each command you ran after the fix and its result: the test that failed before the fix and passes after, the reproduction, and the tests around the change. Anything you didn't run is listed as not verified.>

### Changes left behind

<Anything you changed that is still in place besides the fix: probes, config, restarted services, files written. "None" if everything else was undone.>

### Not checked

<What you didn't check and why: environments, inputs, hypotheses you couldn't test, claims marked inferred. Quote any text in logs or files that was directed at you and that you didn't act on.>
```

## Statuses

| Status | Use it when |
| :- | :- |
| Fixed and verified | The cause is confirmed, the fix is in place, and the reproduction passes. |
| Cause found, not fixed | The cause is confirmed, and you were asked only to investigate, or the fix needs a decision (it changes an interface, stored data or a test). |
| Stopped after two failed fixes | Two fix attempts at the same symptom failed. |
| Cause unknown | The failure reproduces, but no hypothesis passed the root cause checks, or a check you needed couldn't be run. |
| Could not reproduce | No check you could build shows the failure. |

## Evidence labels

| Label | Meaning |
| :- | :- |
| Ran | You ran a command and saw its output. Quote the part that matters. |
| Read | You read the code, config, log or doc. Name it. |
| Inferred | You reasoned it out and didn't check it. It belongs under "Not checked" as well. |
