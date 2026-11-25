# Audit commands

Commands for each step of the audit, by ecosystem. Run `<tool> <command> --help` when a flag fails, because flags change between major versions.

Contents:

- Scripts that work for any JavaScript repository
- JavaScript and TypeScript by package manager
- Python, Go and Rust
- Any ecosystem
- GitHub Actions
- Docker base images
- End-of-life dates

Run every command that installs, removes or dedupes in the scratch checkout, never in the working tree.

## Scripts that work for any JavaScript repository

Count the files that import each runtime dependency of one `package.json`, fewest first. Run it from the folder that holds that `package.json`; for a monorepo, run it once per workspace. A count of 0 means "check the config, binary and side-effect uses", not "unused".

```bash
jq -r '.dependencies // {} | keys[]' package.json | while read -r p; do
  n=$(git grep -lE "(from |require\(|import\()[[:space:]]*['\"]$p(/[^'\"]*)?['\"]" -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs' '*.vue' '*.svelte' | wc -l | tr -d ' ')
  echo "$n $p"
done | sort -n
```

List every package declared with more than one version range across the workspaces of a monorepo:

```bash
git ls-files '*package.json' | xargs jq -r '(.dependencies // {}) + (.devDependencies // {}) + (.peerDependencies // {}) + (.optionalDependencies // {}) | to_entries[] | "\(.key)\t\(.value)\t\(input_filename)"' \
  | sort -u -t$'\t' -k1,2 \
  | awk -F'\t' '{n[$1]++; r[$1]=r[$1] "  " $2 " (" $3 ")"} END {for (k in n) if (n[k] > 1) print k ":" r[k]}'
```

Measure what removing one package frees. In the scratch checkout, with dependencies installed:

```bash
npm ls --all --parseable | sort -u | wc -l; du -sk node_modules
npm uninstall <package>
npm ls --all --parseable | sort -u | wc -l; du -sk node_modules
git checkout -- package.json package-lock.json && npm ci
```

With pnpm, use `pnpm list -r --depth Infinity --parseable` and `pnpm remove <package>`. Restore the manifest and lockfile before you measure the next package.

Find unused, unlisted and misplaced dependencies with fallow, or with knip if the repository already configures it:

| Purpose | Command |
| :- | :- |
| Every unused-code finding, including dependencies | `npx -y fallow@latest dead-code --format json --lean -q -o <scratch>/dead-code.json` |
| Where one dependency is used | `npx -y fallow@latest dead-code --trace-dependency <package>` |
| Dependencies only, with knip | `npx knip --dependencies` |

## JavaScript and TypeScript by package manager

| Purpose | npm | pnpm | Yarn 2 or later | Bun |
| :- | :- | :- | :- | :- |
| Why a package is installed | `npm explain <package>` | `pnpm why -r <package>` | `yarn why -R <package>` | `bun why <package>` |
| Every installed version of a package | `npm ls <package> --all` | `pnpm list -r --depth Infinity <package>` | `yarn why -R <package>` | `bun pm ls --all` |
| Would a dedupe change anything | `npm dedupe --dry-run` | `pnpm dedupe --check` | `yarn dedupe --check` | none |
| Outdated packages | `npm outdated --json` | `pnpm outdated -r --format json` | `npx -y npm-check-updates --workspaces` | `bun outdated` |
| Advisories, production only | `npm audit --omit=dev --json` | `pnpm audit --prod --json` | `yarn npm audit --all --recursive --environment production --json` | `bun audit` |
| Licenses | `npm query '*' \| jq -r '.[] \| "\(.name)\t\(.license)"'` | `pnpm licenses list --prod --json` | none | none |
| Packages with install scripts | `npm query ':attr(scripts, [postinstall]), :attr(scripts, [install]), :attr(scripts, [preinstall])'` | `pnpm ignored-builds`, and `onlyBuiltDependencies` in the config | none | `trustedDependencies` in `package.json` |

Yarn 1 uses `yarn why <package>`, `yarn outdated` and `yarn audit --json`.

Registry facts for one package, from any manager:

```bash
npm view <package> deprecated time.modified maintainers repository.url --json
npm view <package>@<version> peerDependencies --json
```

`time.modified` is the last publish. For the archive state of its repository, use `gh repo view <owner>/<repo> --json isArchived,pushedAt`.

## Python, Go and Rust

| Purpose | Python | Go | Rust |
| :- | :- | :- | :- |
| Unused and undeclared | `uvx deptry .` | `go mod tidy -diff` | `cargo machete` if installed |
| Why a package is installed | `uv tree --invert --package <package>` | `go mod why -m <module>` | `cargo tree -i <crate>` |
| Duplicate versions | none, one version per environment | `go list -m all`, then look for `/v2`, `/v3` of one module | `cargo tree --duplicates` |
| Outdated | `uv pip list --outdated` or `pip list --outdated --format json` | `go list -m -u all` | `cargo outdated` if installed |
| Advisories | `uvx pip-audit` | `govulncheck ./...`, which also reports whether the code reaches the vulnerable function | `cargo audit` if installed |

## Any ecosystem

`osv-scanner scan source -r .` reads every lockfile it finds and checks each package against the OSV advisory database. Use it as a second source next to the ecosystem's own audit, and as the only source for ecosystems without one.

## GitHub Actions

List every action and the ref it pins, with how often each appears:

```bash
grep -rhE '^\s*(-\s*)?uses:' .github | sed -E 's/.*uses:[[:space:]]*//; s/[[:space:]]*#.*//' | sort | uniq -c | sort -rn
```

A ref of 40 hex characters is a SHA. Anything else is a tag or a branch. Lines starting `./` are local actions.

| Purpose | Command |
| :- | :- |
| Latest release of an action | `gh release view --repo <owner>/<repo> --json tagName,publishedAt` |
| The commit a tag points to | `gh api repos/<owner>/<repo>/commits/<tag> --jq .sha` |
| Whether its repository is archived | `gh repo view <owner>/<repo> --json isArchived,pushedAt` |
| The runtime it runs on | `gh api 'repos/<owner>/<repo>/contents/action.yml?ref=<ref>' --jq .content \| base64 -d \| grep -E '^\s*using:'` (try `action.yaml` if that fails) |

## Docker base images

List every base image:

```bash
git grep -nE '^\s*FROM\s' -- '*Dockerfile*' '*.dockerfile'
git grep -nE '^\s*image:' -- '*compose*.yml' '*compose*.yaml' '.devcontainer/*'
```

A `FROM` that uses `${...}` takes its value from an `ARG`; read the default in the same file.

| Purpose | Command |
| :- | :- |
| The digest a tag points to | `docker buildx imagetools inspect <image>:<tag>` |
| Vulnerabilities in an image | `trivy image <image>`, `grype <image>` or `docker scout cves <image>`, whichever is installed |
| Size of a pulled image | `docker image inspect --format '{{.Size}}' <image>:<tag>` |

## End-of-life dates

endoflife.date publishes the support dates for runtimes and base operating systems. Use the product name from its site, such as `nodejs`, `python`, `go`, `alpine`, `debian` or `ubuntu`:

```bash
curl -s https://endoflife.date/api/<product>.json | jq '.[] | {cycle, eol}' | head -40
```
