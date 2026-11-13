# Good and bad issues

Each pair shows an issue that went badly and one that went well, followed by what changed. Names and systems are invented.

## An issue only its author could act on

Bad:

```markdown
Title: Follow-up from refund PR

As discussed, we should handle the idempotency thing properly. See the plan.
```

Good:

```markdown
Title: Accept an idempotency key on refund requests

Why: a double-clicked refund button sent two refund requests for one order (SUP-812). #482 now rejects a second refund for an already refunded order, but a client that retries after a timeout still gets an error instead of the first result.

What: accept an `Idempotency-Key` header on `POST /orders/{id}/refund` in `billing/refund.go`. Store the key with the refund, and return the stored response when the same key arrives again.

Done when: two requests with the same key return the same refund and move money once, covered by a test in `billing/refund_test.go`.

From: review of #482, finding 3.
```

What changed: the good issue copies the reasoning in instead of pointing at a conversation and a local plan file the reader can't open, names the code, and says how to tell it's done.

## Duplicates and over-splitting

Bad: files three issues, "Add retry to webhook sender", "Add jitter to webhook retries" and "Log the event ID when webhook retries run out", when an open issue "Webhooks are dropped during partner outages" already covers the first two.

Good: files one issue, "Log the event ID when webhook retries run out", and lists the open issue under "Already filed" as matching the retry and jitter items.

What changed: the good run searched the tracker first, and didn't split work that ships together into separate issues.
