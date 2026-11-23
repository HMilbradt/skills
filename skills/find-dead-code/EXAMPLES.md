# Verdict examples

Pairs of weak and sound verdicts on invented candidates. Use them to calibrate a close call, not as templates.

## A public endpoint with no callers in the code

Weak

```markdown
## Remove
1. GET /v1/orders/export (orders.controller.ts)
   Evidence: no references to "/v1/orders/export" in the repository.
```

Sound

```markdown
## Ask owner
1. GET /v1/orders/export (orders.controller.ts): billing team, "Does any partner or
   finance script pull this export?"
   Evidence: no call to the generated `exportOrders` client function in any app; no hits
   in other repositories in the organisation; request logs reachable for 30 days only,
   with zero requests. Last real change two years ago, in a pull request titled "CSV
   export for accounting".
   Not checked: traffic older than 30 days.
```

What changed: the weak verdict searched for the path string, which callers of a generated client never write, and treated the repository as the only caller. The sound one searches the client function and other repositories, reads traffic, and stops at "ask owner" because a monthly finance export would not show in 30 days of logs.

## A flag that has been on for a long time

Weak

```markdown
## Keep
- `new-checkout` flag: still read in three places.
```

Sound

```markdown
## Remove
1. The old checkout path behind the `new-checkout` flag (checkout/legacy/)
   Evidence: the flag service shows the flag at 100% for every environment for eight
   months. The `false` branch renders `LegacyCheckout`, which nothing else imports.
   Frees: checkout/legacy/ (about 1,400 lines), two API routes only it calls, and the
   flag itself.
```

What changed: the weak verdict asked whether the flag is read, which it always is. The sound one asks which branch can still run. A flag fixed at one value makes the other branch dead, and everything only that branch reaches dies with it.

## A cluster of unused files

Weak

```markdown
## Remove
1. reports/summary-card.tsx
2. reports/summary-chart.tsx
3. reports/use-summary.ts
...
```

Sound

```markdown
## Remove
1. The old reports page (reports/, 9 files)
   Evidence: the route to it was removed in a pull request a year ago, "Replace reports
   with dashboard". Nothing imports any file in the folder; fallow's graph was complete.
   Frees: the folder, the `recharts` dependency (used only here), and the
   `GET /reports/summary` endpoint, which only `use-summary.ts` calls.
```

What changed: the files are one finding, not nine. The sound verdict names the change that orphaned them and follows the chain: a dependency and an endpoint that become dead once the folder goes.

## A webhook handler that looks idle

Weak

```markdown
## Remove
1. POST /webhooks/payment-disputes: no code calls it and logs show no requests in 90 days.
```

Sound

```markdown
## Keep
- POST /webhooks/payment-disputes: the payment provider calls it, and only when a customer
  disputes a charge. Zero requests in 90 days means no disputes, not a dead handler. The
  provider's dashboard lists it as a registered endpoint.
```

What changed: a handler for a rare event looks idle by design. The caller is outside the code, so the check is the provider's webhook registration, not the request count.
