---
name: find-dead-code
description: Find code, endpoints and features that nothing needs any more, and return a ranked report with the evidence for each. Covers unused files, exports, types and dependencies, legacy API endpoints, stale feature flags, old jobs and features nobody uses. Runs a static analyzer such as fallow or knip, then checks each endpoint and feature for callers, traffic and history. Use when asked to find dead code, unused or legacy endpoints, features we can remove, cruft or cleanup candidates, or "is this still used?" and "can we delete X?". Reports only; it deletes nothing. To remove what it finds, plan the removal with write-plan.
---

# Find dead code

Find what a codebase no longer needs and return a report that ranks each candidate with its evidence. Nothing is deleted. A wrong "remove" breaks a customer, so every verdict says what was checked and what wasn't.

There are two kinds of dead code, and they need different methods:

- **Unreferenced code**: files, exports, types, class members and dependencies that nothing in the repository imports. A static analyzer finds these well.
- **Unused surfaces**: endpoints, jobs, webhooks, pages and features that the framework still wires up, so they look alive to the analyzer, but that no client calls and no user reaches. Only callers, traffic and history show these.

Most of the value in a large codebase is in the second kind, and an analyzer reports none of it.

## Where to ask and where to proceed

- Proceed on the scope you were given. With no scope, run the static pass over the whole repository and review the surfaces of the area the request names, or of every app if it names none. Say in your result what you covered.
- Run read-only queries against monitoring and analytics without asking. Never run anything that writes to a shared system.
- If a source of traffic data needs a login or credentials you don't have, don't ask for them. Mark the candidates that needed it "no traffic data" and name the source in your result.
- For a sweep across many apps, split the surface review into one subagent per app if you can start subagents, and say so before you start them.

## 1. Get a trustworthy graph

A static analyzer is only as good as its import graph. A missing install or missing generated code makes everything behind it look unused.

1. Pick the analyzer. For JavaScript and TypeScript, use fallow; read [FALLOW.md](FALLOW.md) for the commands and its false positives. Use knip instead if the repository already configures it. For other languages, use the analyzer the repository already runs; if it has none, skip to step 2 and say so in your result.
2. Install dependencies and run the repository's code generation the way its setup docs say, in a scratch checkout if the working tree has someone else's changes. Generated clients and built workspace packages are usually not committed.
3. Run the analyzer and check its unresolved imports and diagnostics first. If imports between the repository's own packages don't resolve, the graph is incomplete: fix the setup and run again. If you can't, treat every finding in the affected areas as "check by hand".

## 2. Triage the static findings

1. Group findings by area and kind. Don't review a list of thousands one by one; look for clusters, such as a whole folder of unused files, which usually means a removed feature left its pieces behind.
2. Drop the known false positives for the framework, listed in [FALLOW.md](FALLOW.md). Code reached through decorators, dependency injection, reflection, string-based registration or a config file looks unused to every analyzer.
3. Run the analyzer a second time in production mode, which ignores tests. Code that only tests use is dead too, and the first run hides it.
4. Before you rate a finding "remove", trace it (`fallow dead-code --trace <file>:<export>`) and search the repository for its name as a string, which catches dynamic imports and lookups by name.

## 3. Inventory the surfaces

List every way into the system in the scope: HTTP routes and controllers, RPC and GraphQL operations, worker `fetch` handlers, cron and scheduled jobs, queue consumers, webhooks, CLI commands, pages and UI routes, and feature flags. Read the framework's routing, not a guess from file names. A route table, an OpenAPI spec or `fallow list --entry-points` is a good start.

## 4. Check each surface

For each surface, collect four kinds of evidence, then give a verdict.

1. **Callers in the repository.** Search for how a client actually calls it, not only its path string. If the API has a generated client, search for the generated function or hook name, because callers never write the URL. Check other apps and workers in the repository, service bindings, scripts and tests. A surface only tests call is a candidate. Before you search, find the files that list every surface, such as the OpenAPI spec, the generated client and generated path manifests (search for one known path and see which files match it). Leave them out of the search: they match everything and hide the dead ones. With more than a handful of surfaces, write a short script that cross-references the inventory against the search instead of checking each by hand.
2. **Callers outside the repository.** Search the organisation's other repositories (`gh search code --owner <org> "<path or name>"`). Note callers the code can't show: mobile apps, partners, browser extensions, links in sent emails, payment and other provider webhooks, search engines, and old client versions still installed.
3. **Traffic.** Find where the repository's runtime data lives from the repository itself: its docs, its logging, tracing and analytics code, the observability settings in its deploy config, and the tools and connectors available in your session. Don't assume a vendor. Query a window long enough to cover monthly and yearly jobs, and at least as long as the surface has existed if it's younger. If the logs keep less than that, say how long they keep. Paths in logs carry ids, so query per route with a pattern built from its template rather than grouping by raw path. Zero requests over a long window is strong evidence; no data is not evidence. Admin tools and handlers for rare events are quiet by design, so for them history and the owner's answer count more than traffic.
4. **History.** Find when the surface was added and last changed in a meaningful way (`git log --follow`), and the pull request or issue behind it. Search for "deprecated", "legacy", "v1", "old", "TODO remove" and a replacement that does the same job. Feature flags that have been fully on or fully off for months mean the other branch is dead; `fallow flags --retirement` finds flags that do nothing, and the flag service shows each flag's state. `fallow flags` misses flags read through a constants registry, so also check each key in the repository's flag registry for a reader.

## 5. Give each candidate a verdict

| Verdict | When |
| :- | :- |
| Remove | Nothing calls it, in or out of the repository, and either traffic is zero over a long window or it has no runtime surface at all. |
| Ask owner | No callers found, but an outside caller can't be ruled out, or there is no traffic data. Name the owner from CODEOWNERS or history, and the question to ask. |
| Keep | It has a caller or traffic, or a framework reaches it. Report it only if it looked dead, so nobody checks it again. |

Never rate a public endpoint "remove" on static evidence alone. Absence of callers in the code is weak for anything reachable over the network. Read [EXAMPLES.md](EXAMPLES.md) when a verdict is a close call.

Give the verdict per feature, not per route: a controller or module whose routes are all uncalled is one candidate. A list of a hundred uncalled endpoints with no verdicts hands the work back to the reader.

Rank the candidates by what removing them saves (lines, dependencies, things people must understand) and by how sure the verdict is. Removing a surface usually frees a chain behind it: services, tables, jobs, flags and tests. List that chain under the candidate.

## Your result

```markdown
Scope: <what was analyzed, and what wasn't>
Analyzer: <tool and command, and whether the graph was complete>
Traffic data: <sources used, window, and sources found but not reachable>

## Remove
1. <surface or code> (<path>)
   Evidence: <callers searched and found none, traffic, history>
   Frees: <what goes with it>
   Not checked: <anything>

## Ask owner
1. <surface or code> (<path>): <owner>, <the question to ask>
   Evidence: <...>

## Static findings
<counts by kind and area after false positives were dropped, the largest clusters, and the
false-positive patterns found, with the analyzer config that would silence each>

## Looked dead, kept
- <item>: <why it is alive>
```

Leave out a section with nothing in it.
