# Good and bad findings

Each pair shows a finding that went badly and one that went well, followed by what changed. Code and names are invented.

## A correctness finding

Bad:

```markdown
1. billing/refund.go:42 This might have race conditions. Consider adding locking.
```

Good:

```markdown
1. billing/refund.go:42 Two refund requests for one order can both succeed.
   Lens: Correctness. Verdict: Confirmed.
   Evidence: `handleRefund` reads `refunded_at` at line 38 and writes it at line 51, outside a transaction. Two requests that both read `NULL` both call `payments.Refund`. The verifier reproduced it with two goroutines in `refund_test.go`.
   Fix: claim the order with `UPDATE orders SET refunded_at = now() WHERE id = $1 AND refunded_at IS NULL` before calling the provider, and return `ErrAlreadyRefunded` when no row changes.
```

What changed: the good finding names the input (two concurrent requests), the wrong result, the lines involved, and the smallest fix. "Might have" and "consider" leave the reader to do the review again.

## A plan finding

Bad:

```markdown
1. The implementation doesn't fully follow the plan.
```

Good:

```markdown
1. reports/csv.go:88 The change also rewrites `exportCustomers`, which the plan lists under "Stays the same".
   Lens: Plan. Verdict: Confirmed.
   Evidence: the plan's "Stays the same" says "`exportCustomers`: its date format is a separate request". The diff changes its layout at line 88, and the Decision log has no entry for it.
   Fix: revert line 88, or add a Decision log entry if the change is wanted.
```

What changed: the good finding quotes the plan line and the code that departs from it, and offers both ways out, because the plan can be the thing that's wrong.

## A simplicity finding the verifier rejected

The finding:

```markdown
1. webhooks/send.go:15 `Sender` is an interface with one implementation. Cut it and use the struct.
```

Verifier:

```markdown
1. Rejected: `webhooks/send_test.go` uses a fake `Sender` to simulate partner outages. The interface is how the retry tests work.
```

What changed: nothing in the review; this is the verify round doing its job. The finding fit the lens's checklist, but the code had a reason the reviewer didn't look for. It goes under "Rejected" in the result, so a person can check the verifier.

## A finding that isn't one

Bad:

```markdown
1. cache/store.go:30 The variable `ttl` should be named `timeToLive` for clarity.
2. cache/store.go:55 Add a test for when the clock goes backwards.
```

Good: "No findings" from the Simplicity and Tests lenses.

What changed: the first is style, which no lens reports. The second asks for a test of a case the change doesn't touch: `store.go` reads a monotonic clock. A reviewer that reaches for something to say costs the author time and makes real findings harder to spot.
