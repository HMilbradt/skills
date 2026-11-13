# Good and bad plans

Each example shows a request, a plan that went badly, and one that went well, followed by what changed. Names and systems are invented.

## A plan only its author could follow

Request: "Customers can refund an order twice if they double-click. Fix it."

Bad plan:

```markdown
## Plan

1. Add a check for already-refunded orders in the refund handler.
2. Make the button disable on click.
3. Add tests.
4. Clean up the refund service while we're in there.
```

Good plan:

```markdown
# Reject a second refund for the same order

A second refund request for an order that is already refunded returns an error and moves no money.

## Why

Support reported two double refunds (tickets SUP-812, SUP-830). Both orders show two `refund.created` events a few hundred milliseconds apart. Intent: an order can be refunded at most once, whatever the client does. Stated requirement: no double refunds.

## Done when

- `go test ./billing -run Refund` passes, including a new test that sends two refund requests for one order and expects one refund and one `ErrAlreadyRefunded`.
- Two concurrent requests in the new test produce one row in `refunds`.

## Context

`POST /orders/{id}/refund` is handled by `handleRefund` in `billing/refund.go`. It loads the order with `orders.Get`, calls the payment provider through `payments.Refund`, then sets `orders.refunded_at`. Nothing checks `refunded_at` first, and the read and the write aren't in one transaction, so two requests can both pass.

## Changes

In `handleRefund`, claim the refund before calling the provider, with a conditional update: `UPDATE orders SET refunded_at = now() WHERE id = $1 AND refunded_at IS NULL`. If no row changes, return `ErrAlreadyRefunded` (HTTP 409). If the provider call then fails, set `refunded_at` back to `NULL` and return the provider's error.

## Stays the same

- The refund button. Disabling it is a nice touch but doesn't fix the bug, because the API can be called directly.
- The rest of `billing/refund.go`. It's untidy, but tidying it isn't needed for this fix.

## Milestones

### 1. Make refunds claim the order first

One pull request. Afterwards a second refund for the same order gets a 409 and moves no money.

1. Add `ErrAlreadyRefunded` next to the other errors in `billing/errors.go`, mapped to 409 in `billing/http.go` the way `ErrOrderNotFound` maps to 404.
   Check: `go build ./...` succeeds.
2. In `handleRefund`, replace the plain read with the conditional update above, before `payments.Refund` is called.
   Check: existing tests in `go test ./billing` still pass.
3. On a provider error, reset `refunded_at` to `NULL` in the same function.
   Check: a new test with a failing fake provider leaves `refunded_at` as `NULL`.
4. Add the double-request and concurrent-request tests from "Done when".
   Check: both fail on the code before step 2 and pass after it.

Proof: `go test ./billing` passes from the repository root.

## Alternatives considered

| Option | Why not |
| :- | :- |
| Disable the button on click | Doesn't stop retries, scripts or a second tab. |
| An idempotency key on the request | Fixes it more generally, but needs a client change and a new table. The conditional update fixes this bug alone. |
| Do nothing | Each double refund is money lost and a manual clawback for support. |

```

What changed: the bad plan names nothing a newcomer could find, says nothing about how to check each step, and slips in an unrelated clean-up. The good plan names the function, the race and the exact fix; says what it leaves alone and why; and rejects the button fix with a reason, so the implementer doesn't add it back.

## A plan that hides the real problem

Request: "Add a `cancelled` status for subscriptions."

Bad plan: adds `cancelled` to the 11 `switch` statements over subscription status that are spread across the codebase, with a step for each, and says nothing about why there are 11. Or the opposite: quietly plans a refactor of every status check first, because the planner thought it was cleaner.

Good plan: before writing the milestones, asks this:

```markdown
Adding `cancelled` means editing 11 `switch` statements over subscription status (`grep -rn "case StatusActive" ./`). Each one decides for itself which statuses can be billed or have access, which is also why `paused` was missed in `access/check.go` and `email/digest.go`.

How should the plan handle that?

1. Refactor first (recommended). Add `CanBill()` and `HasAccess()` on `Status` and replace the 11 switches, as its own pull request ahead of the feature. About the same size as the feature, fixes the two `paused` bugs, and makes the next status a one-file change.
2. Add `cancelled` to all 11 switches. Smallest change now; the next status costs the same again, and the `paused` bugs stay.
3. Add `cancelled` now and plan the refactor as a follow-up.
```

The answer goes into the plan. If it was option 1, the refactor is milestone 1 and the feature is milestone 2. If it was option 2 or 3, the plan takes the simple route and keeps the write-up under "Wider change" with the answer.

What changed: the first bad plan treats the design's cost as normal, and the second decides a bigger change on the requester's behalf. The good plan names the cause, shows the evidence, prices each route, and lets the person who asked choose.

## A plan heavier than the change

Request: "The CSV export puts dates in US format. Use ISO 8601."

Bad plan: a page and a half with Context, Decisions, Risks and a pre-mortem, plus a new `DateFormatter` interface "so other formats can be added later".

Good plan:

```markdown
# Write ISO 8601 dates in the CSV export

## Why

`exportOrders` in `reports/csv.go` formats dates with `"01/02/2006"`, which customers outside the US misread. Requirement: ISO 8601 dates.

## Done when

- An exported file shows `2024-03-07` where it showed `03/07/2024`.

## Milestones

### 1. Switch the date layout

1. In `exportOrders`, change the layout to `time.RFC3339` for timestamps and `"2006-01-02"` for the `ship_date` column.
   Check: `go test ./reports` passes after updating the expected dates in `reports/csv_test.go`.

```

What changed: the change is one line, so the plan is a few. The interface is gone because nobody asked for a second format.
