---
name: audit-dependencies
description: Audit a repository's dependencies and return a ranked report of what to remove, replace, consolidate, upgrade or fix, with the evidence for each. Finds packages used so narrowly that a built-in or a few lines could replace them, packages that overlap or are unused, duplicate and mismatched versions, outdated and abandoned packages, vulnerabilities triaged by whether they ship and are reachable, license problems, and outdated GitHub Actions and Docker base images. Use when asked to audit dependencies, shrink the package footprint, find packages we can drop, check for outdated or vulnerable packages, or clean up package.json or a lockfile. Reports only; it changes no manifest or lockfile. For unused code, endpoints and features, use find-dead-code.
---

# Audit dependencies

Audit everything the repository pulls in from outside: packages in every ecosystem it uses, GitHub Actions, and Docker base images. Return one report, ranked by what each change saves against what it costs. The main goal is a smaller footprint, so removal candidates come first and get the most care.

Nothing in the working tree changes. A wrong "remove" breaks a build or a customer, so every verdict says what was checked and what wasn't.

## Where to ask and where to proceed

- Audit the whole repository unless the request names a part of it. Say in your result what you covered.
- Audit the default branch as it is on the remote, unless the request names another branch. The local checkout is often an old or feature branch, and an audit of it reports problems already fixed and misses new packages. Fetch first and build the scratch checkout from the remote's default branch (COMMANDS.md). Record the commit you audited in your result.
- Run read-only queries without asking: package registries, advisory databases, `gh` and the endoflife.date API.
- Never edit manifests, lockfiles, workflows or Dockerfiles in the working tree. Run anything that installs, removes or dedupes in the scratch checkout, because these commands rewrite the lockfile.
- The audit needs no answers from its user. Where a fact needs access you don't have, such as a private registry or a scanner that isn't installed, mark it not checked and name what was missing.
- In a monorepo with many apps, split the removal review into one subagent per app if you can start subagents, and say so before you start them.

[COMMANDS.md](COMMANDS.md) has the commands for each step and ecosystem. Read it before step 1.

## 1. Find every dependency source

1. List every manifest and lockfile, per ecosystem and per workspace: `package.json`, `pyproject.toml`, `requirements*.txt`, `go.mod`, `Cargo.toml`, `Gemfile` and their lockfiles.
2. List what pins a runtime version: `engines`, `.nvmrc`, `.node-version`, `.tool-versions`, `.python-version`, `browserslist`, `setup-*` steps in CI and `FROM` lines. These decide which built-in replacements and which polyfill removals are safe.
3. List every workflow and composite action under `.github/`, every Dockerfile, every Compose file and the dev container config.
4. Note whether Dependabot or Renovate is configured and which ecosystems it covers. A main package ecosystem it skips is a top finding, because nothing proposes updates there. List its open pull requests too (COMMANDS.md). An ecosystem at the bot's open pull request limit gets no new updates, and an open update can contradict a runtime pin, such as a base image bump past the `engines` range.
5. Find the install command each deploy runs, in the Dockerfile, CI or deploy config, with its flags: `--omit=dev`, `--prod`, `--ignore-scripts`, `--frozen-lockfile`. These flags decide what ships. Use the same flags for every install in the scratch checkout, because some repositories only install with them.
6. Install every dependency in the scratch checkout, dev ones included, with the deploy's other flags such as `--ignore-scripts`. The analyzers need the dev tree; step 2 measures the production tree separately.

The step is done when you can name every ecosystem in the repository, the runtime versions it targets, and the install command that decides what ships.

## 2. Find removal candidates

This is the part of the audit that matters most. Check each direct dependency, starting with runtime dependencies, because they ship.

1. **Unused.** Run fallow or knip (see COMMANDS.md). Both also report dependencies that are imported but not declared (phantom dependencies, which work only because another package installs them).
2. **Narrow use.** Count the files that import each package, split by top-level folder, and the functions they use from it. Run the usage script in COMMANDS.md rather than guessing. A package imported in one or two files, or a large library used for one or two functions, is a candidate.
3. **Shipped but not needed at runtime.** Compare what the production install from step 1 puts in the deployed artifact with what the deployed entry points import. Read the folder split from the usage script: a package that only the client bundle, the build or the tests import, but that sits in `dependencies`, ships to the server for nothing. Front-end frameworks, CSS tools and UI kits in a server image are the usual case, and they can be most of its size. Analyzers often miss this, because the package is used, just not where it ships. The fix is moving it to `devDependencies`, so it counts as a removal from the production tree.
4. **A replacement exists.** For each narrow candidate, find what replaces it: a built-in the target runtime has ([REPLACEMENTS.md](REPLACEMENTS.md)), a few lines of the repository's own code, or another package already in the tree. Check the runtime version from step 1 before you suggest a built-in. Check that the replacement does the same thing for how this code uses it: `crypto.randomUUID` makes only version 4 IDs, and `URLSearchParams` doesn't parse nested objects the way `qs` does.
5. **Overlap.** Group packages by the job they do and look for two doing one job: two date libraries, two HTTP clients, two schema validators, two test runners, two icon sets, two CSS-in-JS libraries. Before you call it an overlap, check whether one depends on the other (`npm view <package> dependencies`); then removing one saves nothing. Count the call sites of each. The one with fewer call sites is usually the candidate.
6. **Polyfills and shims.** Compare each polyfill against the runtime targets from step 1. A polyfill for a feature every target already has is dead weight. So is an `@types/*` package for a library that now ships its own types, or for one that was removed.
7. **Used only by an old feature or a script.** If every import of a package sits in one folder, one feature or a one-off script, and that code hasn't changed in a long time, the package goes when the feature goes. Mark it "check with find-dead-code", which checks callers and traffic. Don't judge the feature here.
8. **Measure what removal frees.** In the scratch checkout, remove the package or move it to dev, and compare the package count of the whole tree and of the production tree before and after (COMMANDS.md). Measure install size with the deploy's install flags from step 1. For a front end, read the package's share of the bundle from the repository's bundle analyzer if it has one. Report measured numbers, not estimates; a package with a large tree that other packages also need frees little.

Before you mark anything unused, rule out the ways a package is used without an import:

- named in a config file: ESLint, Prettier, Babel, PostCSS, Tailwind, Jest or Vitest presets and plugins
- run as a binary from a `package.json` script, a CI step, a Dockerfile or a Makefile
- a peer dependency that another installed package requires
- imported for its side effects only (`import "reflect-metadata"`) or as a stylesheet
- loaded by name at runtime, such as a plugin list in config

Search the scripts, CI config and Dockerfiles for the package name before you rate it "remove".

## 3. Find duplicates and mismatched versions

1. List packages installed at more than one version. For each, find which top-level dependency pulls in the old copy, and whether a dedupe would merge them (dry run only).
2. Flag any duplicate of a package that must be single: React, React DOM, GraphQL, `@types/react`, and any library that keeps module-level state or checks `instanceof`. Two copies of these cause bugs, not only extra size.
3. Compare the version range of each package across the workspaces of a monorepo. List every package with more than one range.
4. For every override, resolution and patch (`overrides`, `resolutions`, `pnpm.overrides`, `patches/`), find why it was added (`git log -S`) and whether it is still needed. Most were added for a bug or vulnerability that a newer upstream version has since fixed.
5. Flag more than one lockfile for the same manifest, and a lockfile that a frozen install in the scratch checkout rejects.
6. Compare the runtime versions found in step 1. A Node or Python version that differs between the version file, `engines`, CI and the Dockerfile is a finding.

## 4. Find outdated and abandoned packages

1. List packages one or more major versions behind. Rank runtime dependencies above dev dependencies.
2. Flag every package the registry marks deprecated.
3. Flag abandoned packages: no release in two years, an archived repository, or a single maintainer on a package the product depends on. An abandoned package that is also narrow (step 2) is a strong removal candidate.
4. For each major upgrade, check the peer dependencies of the new version and name what blocks it: "can't move X to the next major until Y does". An upgrade list without its blockers can't be acted on.
5. Check every runtime version from step 1 against its end-of-life date (COMMANDS.md).

## 5. Find vulnerabilities and supply-chain risk

1. Run the ecosystem's audit command and `osv-scanner` if it's installed.
2. Triage each advisory instead of listing it:
   - Does the package ship to production, or is it dev-only?
   - Is the vulnerable function called? `govulncheck` answers this for Go. Elsewhere, search for the function or option the advisory names.
   - Does a fixed version exist, and which top-level dependency must move to get it?
3. Group advisories by the top-level upgrade that fixes them. One upgrade often clears several advisories. Rank by whether the package ships and the code is reachable, then by severity.
4. Flag packages that run install scripts, dependencies installed from a git URL or tarball, and ranges such as `*` or `latest`. Read install scripts from the lockfile (COMMANDS.md): native modules build on install without declaring a script, and a query of `scripts` misses them.
5. List each license in the production tree, not the whole tree. Flag GPL and AGPL in a product that isn't open source, unknown or missing licenses, and a license that changed in a version the repository upgraded to. Don't judge whether a license is acceptable; report it for someone who can.

## 6. Check GitHub Actions

Skip this step if the repository has no workflows.

1. List every `uses:` in workflows and composite actions, with the ref it pins: a full commit SHA, a tag or a branch.
2. Flag third-party actions pinned to a branch or a tag rather than a SHA. A tag can be moved to point at other code.
3. Compare each action's ref with its latest release and flag major versions behind. Flag actions whose `runs.using` is a Node version GitHub no longer supports, archived action repositories, and runner labels for retired images.
4. Flag the same action at different versions across workflows.
5. Flag third-party actions that only wrap a command a `run:` step could do. Each one is a dependency with access to the workflow's token and secrets.
6. Compare the runtime versions set in `setup-*` steps with the version files from step 1.

## 7. Check Docker base images

Skip this step if the repository has no Dockerfiles or Compose files.

1. List every base image: each `FROM` (including every stage of a multi-stage build, and values set through `ARG`), and each `image:` in Compose and dev container files.
2. Flag `latest` and missing tags. Note which images are pinned to a digest and which float on a tag. For each digest pin, compare it with the digest its tag points to now; an old pin misses the base image's security fixes.
3. Check the runtime and the OS of each image against their end-of-life dates.
4. Flag a runtime version that differs from the repository's version files.
5. Flag a full image where a slim or distroless one would do, build tools left in the final stage, and system packages installed but not used.
6. If `trivy`, `grype` or `docker scout` is installed, scan each final image, or each base image if building the final one needs secrets or another platform. Don't install a scanner unasked; mark the scan not run instead. Report findings in tools the image carries but the app never runs, such as the npm CLI in a Node image, apart from findings in the app's own packages. Removing those tools from the final stage clears them.
7. Flag Dockerfiles that use different base images for the same runtime.

## 8. Give verdicts and rank

Give each removal candidate one verdict:

| Verdict | When |
| :- | :- |
| Remove | Nothing uses it, after the checks for config, binary, peer and side-effect use. |
| Move to dev | Only the build, the client bundle or the tests use it, but the production install ships it. |
| Replace | It's used, narrowly, and a built-in or a few lines do the same job for how this code uses it. Name the replacement and the files that change. |
| Consolidate | Another package already in the tree does the same job. Name which stays and how many call sites move. |
| Check with find-dead-code | It's used only by a feature or script that may itself be dead. |
| Keep | It looked like a candidate but isn't. Say why, so nobody checks it again. |

Rank everything in the report by what it saves against what it costs. Savings are packages removed from the tree, install and bundle size, attack surface, and things people must understand. Costs are files touched, migration risk and how sure the evidence is. Put quick wins first: unused packages, packages that ship but belong in dev, polyfills for features every target has, and duplicates a dedupe merges.

## Your result

```markdown
Audited: <branch and commit, and when it was fetched>
Scope: <ecosystems, workspaces, workflows and Dockerfiles covered, and what wasn't>
Runtime targets: <each runtime and version, and where they disagree>
Update automation: <Dependabot or Renovate, which ecosystems it skips, and open update pull requests that are stuck or conflict>

## Quick wins
1. <change>: <what it saves>. Evidence: <...>

## Removal candidates
1. <package> (<ecosystem, workspace>): <Remove, Move to dev, Replace, Consolidate or Check with find-dead-code>
   Used in: <files, and the functions used>
   Replacement: <built-in, own code of about N lines, or the package that stays>
   Frees: <packages removed from the tree, install size, bundle size, as measured>
   Not checked: <anything>

## Duplicates and mismatched versions
- <package>: <versions, who pulls each, fix>

## Outdated and abandoned
- <package>: <current, latest, why it matters, what blocks the upgrade>

## Vulnerabilities
- <top-level upgrade>: fixes <advisories>. Ships: <yes or dev only>. Reachable: <yes, no or not checked>

## Licenses
- <package>: <license and why it's flagged>

## GitHub Actions
- <action>: <finding and fix>

## Docker base images
- <image> (<file>): <finding and fix>

## Looked removable, kept
- <package>: <why it stays>

Not run: <commands and scanners that weren't available, and what they would have checked>
```

Leave out a section with nothing in it.
