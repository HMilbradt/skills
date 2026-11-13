# Good and bad reviews

Each example shows a plan, a review that went badly, and one that went well. Plans, names and systems are invented. Read these before your first review in a session.

## A plan that builds a framework for one caller

The plan:

```markdown
## Reliable webhook delivery

Problem: webhooks to the billing partner fail during short 503 outages, and we drop them.

1. Add a `RetryPolicy` interface with `ExponentialBackoff`, `LinearBackoff` and `FixedDelay` implementations.
2. Add a strategy registry so other teams can register their own policies.
3. Add config keys `webhooks.retry.strategy`, `webhooks.retry.max_attempts` and `webhooks.retry.base_delay_ms`, with per-endpoint overrides.
4. Wrap the webhook sender in the configured policy.
5. Add tests for each strategy.
```

Bad review: praises the plan as extensible, then suggests adding a circuit breaker and a dead-letter queue. The plan was already bigger than the problem, and the review made it bigger again.

Good review:

```markdown
## Plan review: retry failed webhooks

Simplify: the problem needs one retry loop, and the plan builds a framework around it.

### Problem

Webhooks to the billing partner fail during short 503 outages and are dropped. Stated requirement: deliver them once the partner recovers.

### Smallest version

1. In the existing webhook sender, retry on 5xx responses and timeouts with exponential backoff and jitter. Set the attempt limit as a constant.
2. When the last attempt fails, log the event ID so a dropped webhook can be found.
3. Add two tests: one where the partner fails twice and then succeeds, and one where every attempt fails.

### Cuts

| Plan element | Why it goes | Add it back when |
| :- | :- | :- |
| `RetryPolicy` interface and its three strategies | One sender uses one strategy. | A second sender needs a different policy. |
| Strategy registry | No other team has asked to register a policy. | Another team asks. |
| Config keys and per-endpoint overrides | Nobody has asked to tune retries, and a constant changes in a one-line commit. | Operators need to change retries without a deploy. |
| Tests for each strategy | They test code that is cut. The two retry tests replace them. | The strategies come back. |

### Decisions

| Decision | Kind | Options and cost | Pick |
| :- | :- | :- | :- |
| Retries can deliver the same webhook twice | Significant: the partner would notice | Rely on the event ID every webhook already carries (no cost if the partner deduplicates); add an idempotency header (needs the partner's support); never retry some event types (those stay dropped) | Event ID |
| Backoff base delay | Reversible | Not worth debating | Start from the length of a typical outage |

### Open questions

1. Is it acceptable for the partner to receive a duplicate webhook during an outage? Recommended: yes, because every webhook carries an event ID they can match on.

### Not checked

Whether the partner's docs say they deduplicate by event ID. Not read.
```

The good review keeps the tests, because they prove the retry works. It cuts the tests only for code that no longer exists.

## A padded review and a sharp one

The plan:

```markdown
## Monthly orders export

Problem: finance needs last month's orders as a CSV for their monthly reconciliation.

1. Add an "Export orders" button with a month picker to the existing admin orders page.
2. The button calls a new endpoint that runs the existing orders query for that month and streams the rows as CSV.
3. Columns: order ID, date, customer ID, total, tax, status.
```

Bad review:

```markdown
Overall this is a solid plan! A few things to consider:

- Consider moving the export to a background job queue in case it grows.
- You might want to support Excel and JSON as well.
- Consider a scheduled email so finance gets the file automatically.
- Think about security.
- It may be worth building a dedicated reporting service instead.
- Make sure to add monitoring and alerting.
```

Every item starts with "consider" or its cousins, so the author can't tell which ones matter. Most would make the plan bigger, and none is tied to the problem. The one thing that does matter, the column set, is missing.

Good review:

```markdown
## Plan review: monthly orders export

Already minimal: it extends the existing admin page and query and adds one endpoint.

### Decisions

| Decision | Kind | Options and cost | Pick |
| :- | :- | :- | :- |
| The CSV columns | Significant: finance's spreadsheets will depend on them | Agree the columns with finance before shipping (one conversation); ship and change them later (breaks their formulas) | Agree first |

### Not checked

How many orders a month holds. If one month can't stream within the request timeout, a background job becomes part of the smallest version.
```

Instead of "consider a background job", the good review names the fact that would make one necessary.

## A plan that is already minimal

The plan:

```markdown
The daily report shows yesterday's date for users west of UTC. Pass the user's timezone to the
existing `formatDate` call in the report builder, and add a test for a user at UTC-8.
```

Bad review: suggests moving the whole app to a new date library, auditing every date the app displays, and asks whether the fix should handle daylight saving time. The plan fixes one bug, and the review turned it into a project.

Good review:

```markdown
Already minimal: one changed call in existing code, and a test that reproduces the bug.
```

## A one-way door hidden in a small plan

The plan speeds up the dashboard by caching each user's stats. Its last step reads: "While we're in there, rename `users.last_login` to `users.last_seen_at`, since the name is misleading."

Bad review: agrees the new name is clearer and moves on.

Good review: cuts the rename and marks it significant.

```markdown
### Cuts

| Plan element | Why it goes | Add it back when |
| :- | :- | :- |
| Rename `users.last_login` | The dashboard speed problem doesn't need it, and renaming a column changes stored data that other code and reports read. | It's its own change, with a list of what reads the column and a migration. |
```

## A rethink

The plan adds a nightly cron job and a script that truncates container log files once they pass a size limit.

Bad review: suggests better error handling in the script and a test for the size check. The review polishes a script that shouldn't exist.

Good review:

```markdown
## Plan review: cap container log size

Rethink: the container runtime's log driver already rotates logs by size, so no script is needed.

### Smallest version

1. Set the log driver's maximum size and file count in the existing daemon config.
2. Restart the daemon, then recreate the containers. Existing containers keep their old log settings until they are recreated.

### Decisions

| Decision | Kind | Options and cost | Pick |
| :- | :- | :- | :- |
| Recreating the containers | Significant: each service stops briefly | Recreate all of them in a quiet window (short outage per service); recreate only those with large logs (the rest stay uncapped until their next recreate) | Quiet window |
```

## Questions that hold up the review

Bad review: asks "First question: which database does this use?" and stops to wait for an answer. The database is in the config file, and the author now has to answer a quiz one question at a time.

Good review: reads the config, settles every fact it can look up, and returns the whole review at once. Its open questions cover only decisions the author owns, each with a recommended answer the author can accept with "yes".
