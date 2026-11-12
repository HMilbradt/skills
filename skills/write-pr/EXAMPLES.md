# Good and bad descriptions

Each pair shows a description written the way agents and rushed engineers often write them, and one that follows [SKILL.md](SKILL.md). Projects, issues and numbers are invented.

## A body that restates the diff

Before

```markdown
## Summary

This PR makes the following changes:
- Updated `src/upload/client.ts` to add a `timeoutMs` parameter
- Modified `src/upload/retry.ts` to use the new parameter
- Added tests in `src/upload/client.test.ts`
- Updated the README

## Testing

- Added unit tests
- All tests pass ✅
```

After

```markdown
Large uploads on slow connections fail at exactly 30 seconds, even while
data is still moving (#412). The client applied one timeout to the whole
request, so a file that takes longer than 30 seconds to send could never
succeed.

The timeout now counts idle time instead: a request fails only after 30
seconds with no bytes sent. A stalled connection still fails at the same
point as before.

## Testing

- Ran `npm test`: passes, including new tests for a stalled upload and
  for a slow upload that keeps sending.
- Uploaded a 2 GB file over a connection throttled to 1 MB/s: it
  completed.
- Not tested: uploads through a proxy that buffers the whole request,
  which may hide progress from the client.
```

What changed: the reviewer already has the file list in the diff. The after version opens with the failure a user saw and why it happened, then states the new behaviour in one paragraph. "All tests pass" became the command that was run, a manual check with its result, and the case nobody checked.

## Alternatives that were never considered

Before

```markdown
## Alternatives considered

- Do nothing: rejected because the bug would remain.
- Rewrite the upload client in Rust: rejected as too much work.
- Use a third-party library: rejected for simplicity.
```

After

```markdown
## Alternatives considered

- Raise the timeout to 10 minutes: the largest files would still fail,
  and a dead connection would hang for 10 minutes before the user saw
  an error.
- Resumable chunked uploads: this fixes the bug and survives a dropped
  connection, but needs a server change and a storage migration.
  Tracked in #430.
```

What changed: the before list is filler. Nobody weighed those options, and each verdict is too vague to check. The after list holds the two options that came up in the issue, each with a concrete reason it lost. For a typo fix or a version bump, the right section is no section at all.

## Vague and specific subjects

| Before | After | Why |
| :- | :- | :- |
| Fix bug | Stop duplicate invoices when a payment webhook retries | Says which bug, so the log is searchable. |
| Refactor auth | Move session checks into one middleware | Names the change a reader would look for. |
| Address review comments | Reject empty display names at sign-up | Review history is not the change. Say what changed. |
| Fixed the thing where users couldn't log in. | Accept email addresses with capital letters at login | Imperative, no period, and specific about the cause. |
| feat(api): add endpoint | Add an endpoint to export a project as JSON | The repository's history has no prefixes, so none is added. |

## Claiming it was tested

Before

```markdown
## Testing

Tested and verified that everything works as expected. CI is green.
```

The tests were never run in the session, and nobody saw a CI result.

After

```markdown
## Testing

- Ran `go test ./billing/...`: passes.
- Ran `go vet ./...`: no findings.
- Not tested: the webhook path against the payment provider's sandbox,
  which needs credentials this environment doesn't have.
- CI had not finished when this was written.
```

What changed: every claim names the check behind it. The linter is listed as a linter, not as proof the code works. The gap that matters most, the real webhook, is stated plainly instead of hidden behind "everything works".

## A reason nobody gave

The request was "write a PR for this branch". The branch removes the in-memory cache from account lookups. No issue is linked, and the commits say only "remove cache".

Before

```markdown
The account cache served stale data to users and added memory pressure,
so this PR removes it to improve reliability.
```

Nothing in the branch, the commits or the conversation says the cache served stale data or used too much memory. Both reasons were made up to fill the gap.

After

```markdown
<Why: not recorded. Add the reason before merging.>

Account lookups no longer use the in-memory cache. Every lookup now
reads from the database.

## Testing

Not tested.
```

And in the result, after the text:

```markdown
- The reason for removing the cache isn't in the branch, the commits or
  a linked issue. I left a placeholder.
- Every account lookup now hits the database. A reviewer will likely ask
  whether the extra load was measured.
```

What changed: the description says only what the diff supports, and the gap is marked where it will be seen before merging. The likely reviewer question goes in the result, not into the description as a verdict.

## A commit message that narrates the session

Before

```text
Fix login

As discussed, I first tried lowercasing emails in the frontend, but that
didn't work because the mobile app sends them as typed. Then I found the
lookup is case-sensitive. After that I updated the query and ran the
tests, which all passed. Hope this helps!
```

After

```text
Accept email addresses with capital letters at login

The mobile app stores the email address as the user typed it, but login
lowercased the input before looking it up. Anyone who signed up on
mobile with a capital letter in their address could not log in.

Login now compares addresses case-insensitively. Lowercasing in the web
form alone would not fix it, because the mobile app sends addresses as
typed.

Fixes #388
```

What changed: the subject says what the commit does. The body explains the cause and who it hit, then the fix as behaviour. The approach that was dropped survives as one sentence with its reason, which is the part a later reader needs. The story of the session, the reference to a discussion the reader never saw, and the sign-off are gone.
