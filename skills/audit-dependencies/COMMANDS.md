# Audit commands

Commands for each step of the audit, by ecosystem. Run `<tool> <command> --help` when a flag fails, because flags change between major versions. Write regular expressions with `[[:space:]]`, not `\s`: `git grep` on macOS treats `\s` as a plain `s` and silently matches nothing.

Contents:

- Make the scratch checkout from the default branch
- Scripts that work for any JavaScript repository
- Analyzers for unused dependencies
- JavaScript and TypeScript by package manager
- Python, Go and Rust
- Any ecosystem
- Update bots
- GitHub Actions
- Docker base images
- End-of-life dates

Run every command that installs, removes or dedupes in the scratch checkout, never in the working tree.

## Make the scratch checkout from the default branch

From the repository, fetch and check out the remote's default branch in a separate folder. `ls-remote` asks the remote for its default branch, because the local `origin/HEAD` can be stale.

```bash
branch=$(git ls-remote --symref origin HEAD | sed -n 's|^ref: refs/heads/\(.*\)\tHEAD$|\1|p')
git fetch origin "$branch"
git -c core.hooksPath=/dev/null worktree add --detach <scratch>/dep-audit "origin/$branch"
git -C <scratch>/dep-audit log -1 --format='%H %cd'
```

`core.hooksPath=/dev/null` stops the repository's Git hooks from running on the checkout; a `post-checkout` hook can copy `.env` files into it. The last command prints the commit to record in the result.

Install with the deploy's flags and with lifecycle hooks off, for example `HUSKY=0 pnpm install --frozen-lockfile`. Without `HUSKY=0`, husky's `prepare` script writes `core.hooksPath` into the Git config the worktree shares with the user's repository. When the request names a branch, use it in place of `$branch`. Remove the checkout afterwards with `git worktree remove --force <scratch>/dep-audit`.

If some results came from an earlier checkout, this shows which ones to redo:

```bash
git diff --stat <old commit> "origin/$branch" -- '*package.json' '*lock*' '*.toml' go.mod go.sum .github '*Dockerfile*' '*compose*'
```

## Scripts that work for any JavaScript repository

Count the production files that import each runtime dependency of one `package.json`, fewest first, split by top-level folder, with the count of test files after. Run it from the folder that holds that `package.json`; for a monorepo, run it once per workspace. A production count of 0 means "check the config, binary, side-effect, compiler and codegen uses", not "unused". A runtime dependency imported only from tests, `client` or build folders is a "move to dev" candidate. The script counts `import type` as use; check the import lines of any package with a low count.

```bash
jq -r '.dependencies // {} | keys[]' package.json | while read -r p; do
  files=$(git grep -lE "(from |require\(|import\(|import )[[:space:]]*['\"]$p(/[^'\"]*)?['\"]" -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs' '*.vue' '*.svelte' | grep .)
  test=$(printf '%s\n' "$files" | grep -cE '\.(test|spec|stories)\.|__tests__/|(^|/)(tests?|e2e)/')
  prod=$(printf '%s\n' "$files" | grep -vE '\.(test|spec|stories)\.|__tests__/|(^|/)(tests?|e2e)/' | grep .)
  n=$(printf '%s' "$prod" | grep -c .)
  dirs=$(printf '%s' "$prod" | grep . | cut -d/ -f1 | sort | uniq -c | awk '{printf "%s:%s ", $2, $1}')
  echo "$n $p  $dirs test:$test"
done | sort -n
```

List every package declared with more than one version range across the workspaces of a monorepo. Peer ranges are left out, because a wide peer range beside a narrow dependency range is normal:

```bash
git ls-files '*package.json' | xargs jq -r '(.dependencies // {}) + (.devDependencies // {}) + (.optionalDependencies // {}) | to_entries[] | "\(.key)\t\(.value)\t\(input_filename)"' \
  | sort -u -t$'\t' -k1,2 \
  | awk -F'\t' '{n[$1]++; r[$1]=r[$1] "  " $2 " (" $3 ")"} END {for (k in n) if (n[k] > 1) print k ":" r[k]}'
```

The rest of this section reads `package-lock.json` and needs no install.

List every package installed at more than one version. The filter drops platform-specific builds such as `lightningcss-darwin-arm64`, which differ by design:

```bash
jq -r '.packages | to_entries[] | select(.key != "" and (.value.link | not) and .value.os == null and .value.cpu == null) | "\(.key | sub(".*node_modules/"; ""))\t\(.value.version)"' package-lock.json \
  | sort -u | awk -F'\t' '{v[$1]=v[$1] " " $2; n[$1]++} END {for (k in n) if (n[k] > 1) print k ":" v[k]}' | sort
```

Count the whole tree and the production tree:

```bash
jq '[.packages | to_entries[] | select(.key != "")] | length' package-lock.json
jq '[.packages | to_entries[] | select(.key != "" and (.value.dev | not))] | length' package-lock.json
```

Measure what removing one package frees by diffing the tree as `name@version` lists. With npm, `--package-lock-only` rewrites the lockfile without touching `node_modules`:

```bash
tree() { jq -r '.packages | to_entries[] | select(.key != "" and (.value.dev | not)) | "\(.key | sub(".*node_modules/"; ""))@\(.value.version)"' package-lock.json | sort -u; }
tree > <scratch>/before.txt
npm uninstall <package> --package-lock-only
tree > <scratch>/after.txt
comm -23 <scratch>/before.txt <scratch>/after.txt
git checkout -- package.json package-lock.json
```

Drop `and (.value.dev | not)` to diff the whole tree instead of the production tree. To measure moving a package to dev, run `npm install <package>@<its version> --save-dev --package-lock-only` in place of the uninstall.

With pnpm, `pnpm remove <package>` reinstalls (it doesn't accept `--ignore-scripts`), and the parseable paths and `node_modules` size are both misleading: peer hashes rename unrelated folders, and orphans stay in `node_modules/.pnpm`. Diff `name@version` lists instead. Add `--filter <workspace>` to measure one workspace; `-r` covers them all:

```bash
pnpm list -r --depth Infinity --prod --json | jq -r '[.. | objects | .dependencies? // empty | to_entries[] | "\(.key)@\(.value.version)"] | unique[]'
```

Size the packages that disappeared from the registry, not from disk:

```bash
comm -23 <scratch>/before.txt <scratch>/after.txt | while read -r p; do npm view "$p" dist.unpackedSize; done | awk '{s+=$1} END {print s/1024 " KB"}'
```

For a bundled target, measure each package's share of the bundle with an esbuild metafile. Use the target's real entry point and platform:

```bash
npx -y esbuild <entry> --bundle --minify --platform=<node or browser> --metafile=<scratch>/meta.json --outfile=<scratch>/out.js --log-level=error
jq -r '.outputs[].inputs | to_entries[] | select(.key | contains("node_modules/")) | "\(.key | capture(".*node_modules/(?<p>(@[^/]+/)?[^/]+)").p)\t\(.value.bytesInOutput)"' <scratch>/meta.json \
  | awk -F'\t' '{s[$1]+=$2} END {for (k in s) print s[k], k}' | sort -rn | head -20
```

List packages that run code on install, including native modules that build from `binding.gyp` without a declared script:

```bash
jq -r '.packages | to_entries[] | select(.value.hasInstallScript) | "\(.key | sub(".*node_modules/"; ""))\t\(if .value.dev then "dev" else "prod" end)"' package-lock.json
```

List licenses in the production tree:

```bash
jq -r '.packages | to_entries[] | select(.key != "" and (.value.dev | not)) | "\(.key | sub(".*node_modules/"; ""))\t\(.value.license)"' package-lock.json
```

## Analyzers for unused dependencies

Use fallow, or knip if the repository already configures it.

| Purpose | Command |
| :- | :- |
| Unused dependencies, dev dependencies and dev-in-production dependencies | `npx -y fallow@latest dead-code --unused-deps` |
| Imported but not declared | `npx -y fallow@latest dead-code --unlisted-deps` |
| Where one dependency is used | `npx -y fallow@latest dead-code --trace-dependency <package>` |
| Dependencies only, with knip | `npx knip --dependencies` |

fallow exits 1 whenever it finds anything, so a non-zero exit with output is a normal run. With `--lean`, empty lists are left out of the JSON, so "no unused dependencies" shows up as a missing key; run `--unused-deps` and `--unlisted-deps` on their own to be sure. It can miss a front-end entry point and report every client file unused. The dependency findings are still usable, but don't read the file findings from that run.

## JavaScript and TypeScript by package manager

| Purpose | npm | pnpm | Yarn 2 or later | Bun |
| :- | :- | :- | :- | :- |
| Why a package is installed | `npm explain <package>` | `pnpm why -r <package>` | `yarn why -R <package>` | `bun why <package>` |
| Every installed version of one package | `npm ls <package> --all` | `pnpm list -r --depth Infinity <package>` | `yarn why -R <package>` | `bun pm ls --all` |
| Would a dedupe change anything | `npm dedupe --dry-run` | `pnpm dedupe --check` | `yarn dedupe --check` | none |
| Outdated packages | `npm outdated --json` | `pnpm outdated -r --format json` | `npx -y npm-check-updates --workspaces` | `bun outdated` |
| Advisories, production only | `npm audit --omit=dev --json` | `pnpm audit --prod --json` | `yarn npm audit --all --recursive --environment production --json` | `bun audit` |
| Licenses, production only | the lockfile query above | `pnpm licenses list --prod --json` | none | none |
| Packages with install scripts | the lockfile query above | `pnpm ignored-builds`, and `onlyBuiltDependencies` in the config | none | `trustedDependencies` in `package.json` |

Yarn 1 uses `yarn why <package>`, `yarn outdated` and `yarn audit --json`.

pnpm prints `Unsupported engine` warnings into its JSON output when the local Node doesn't match `engines`. Switch to the pinned version first (`nvm use` or `fnm use` in the scratch checkout). If you can't, strip everything before the first `{` or `[` with `sed -n '/^[[{]/,$p'`.

`npm outdated --json` leaves `type` empty, so it can't tell runtime from dev dependencies. Read which section each package is in from `package.json`.

Deprecation, latest version and last publish for every direct dependency in the repository, one JSON line each:

```bash
git ls-files '*package.json' | xargs jq -r '(.dependencies // {}) + (.devDependencies // {}) | to_entries[] | select(.value | startswith("workspace:") | not) | .key' | sort -u \
  | while read -r p; do
      npm view "$p" --json 2>/dev/null | jq -c '{name, latest: .version, deprecated: (.deprecated // null), last_publish: (.time | del(.created, .modified) | to_entries | max_by(.value) | .value)}'
    done
```

It reads the full registry record, because `npm view <package> deprecated time` leaves out `deprecated` when it's empty. `time.modified` is the last change to the registry record, not the last publish. For one package's peers and dependencies, use `npm view <package>@<version> peerDependencies dependencies --json`. For the archive state of its repository, use `gh repo view <owner>/<repo> --json isArchived,pushedAt`.

Find when an override was added. A plain `git log -S<name>` finds the package's first appearance anywhere, so scope it to the override line in the file that holds the overrides:

```bash
git log --format='%cs %h %s' -G '<name>.*:' -- <package.json or pnpm-workspace.yaml> | tail -1
```

## Python, Go and Rust

| Purpose | Python | Go | Rust |
| :- | :- | :- | :- |
| Unused and undeclared | `uvx deptry .` | `go mod tidy -diff` | `cargo machete` if installed |
| Why a package is installed | `uv tree --invert --package <package>` | `go mod why -m <module>` | `cargo tree -i <crate>` |
| Duplicate versions | none, one version per environment | `go list -m all`, then look for `/v2`, `/v3` of one module | `cargo tree --duplicates` |
| Outdated | `uv pip list --outdated` or `pip list --outdated --format json` | `go list -m -u all` | `cargo outdated` if installed |
| Advisories | `uvx pip-audit` | `govulncheck ./...`, which also reports whether the code reaches the vulnerable function | `cargo audit` if installed |

## Any ecosystem

`osv-scanner scan source -r .` reads every lockfile it finds and checks each package against the OSV advisory database. Use it as a second source next to the ecosystem's own audit, and as the only source for ecosystems without one. It's a standalone binary, not an npm package, so `npx` can't run it. If it isn't installed, mark it not run.

## Update bots

List open update pull requests and when each was opened:

```bash
gh pr list --author app/dependabot --json number,title,createdAt --limit 100
gh pr list --author app/renovate --json number,title,createdAt --limit 100
```

Dependabot opens at most five pull requests per ecosystem unless `open-pull-requests-limit` in `.github/dependabot.yml` says otherwise. An ecosystem at its limit gets no new updates until some are merged or closed.

## GitHub Actions

List every action and the ref it pins, with how often each appears:

```bash
grep -rhE '^[[:space:]]*(-[[:space:]]*)?uses:' .github | sed -E 's/.*uses:[[:space:]]*//; s/[[:space:]]*#.*//' | sort | uniq -c | sort -rn
```

A ref of 40 hex characters is a SHA. Anything else is a tag or a branch. Lines starting `./` are local actions.

| Purpose | Command |
| :- | :- |
| Latest release of an action | `gh release view --repo <owner>/<repo> --json tagName,publishedAt` |
| The commit a tag points to | `gh api repos/<owner>/<repo>/commits/<tag> --jq .sha` |
| Whether its repository is archived | `gh repo view <owner>/<repo> --json isArchived,pushedAt` |
| The runtime it runs on | `gh api 'repos/<owner>/<repo>/contents/action.yml?ref=<ref>' --jq .content \| base64 -d \| grep -E '^[[:space:]]*using:'` (try `action.yaml` if that fails) |

## Docker base images

List every base image. `|| true` keeps a repository with no Compose file from ending the script:

```bash
git grep -nE '^[[:space:]]*FROM[[:space:]]' -- '*Dockerfile*' '*.dockerfile'
git grep -nE '^[[:space:]]*image:' -- '*compose*.yml' '*compose*.yaml' '.devcontainer/*' || true
```

A `FROM` that uses `${...}` takes its value from an `ARG`; read the default in the same file.

| Purpose | Command |
| :- | :- |
| The digest a tag points to now, to compare with a pinned digest | `docker buildx imagetools inspect <image>:<tag>` |
| Vulnerabilities in an image | `trivy image <image>`, `grype <image>` or `docker scout cves registry://<image>:<tag>`, whichever is installed |
| Size of a pulled image | `docker image inspect --format '{{.Size}}' <image>:<tag>` |

The `registry://` prefix makes `docker scout` read the image from the registry instead of pulling it. `docker scout` uploads the image's package list to Docker's service.

## End-of-life dates

endoflife.date publishes the support dates for runtimes and base operating systems. Use the product name from its site, such as `nodejs`, `python`, `go`, `alpine-linux`, `debian`, `ubuntu`, `mysql` or `traefik`. Some names redirect, so follow redirects with `-L`:

```bash
curl -sL https://endoflife.date/api/<product>.json | jq '.[] | {cycle, eol}' | head -40
```
