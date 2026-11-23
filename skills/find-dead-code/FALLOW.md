# Running fallow

Commands for the static pass with [fallow](https://fallow.tools), and the false positives it reports on common frameworks. Run `npx fallow@latest <command> --help` for every flag.

## Commands

Run these from the repository root. `npx -y fallow@latest` works without installing anything.

| Purpose | Command |
| :- | :- |
| Every unused-code finding, as JSON for an agent | `fallow dead-code --format json --lean -q -o <scratch>/dead-code.json` |
| Counts only, to see the shape first | `fallow dead-code --summary -q` |
| Code that only tests, stories and dev tooling use | `fallow dead-code --production --format json --lean -q -o <scratch>/prod.json` |
| One workspace package of a monorepo | add `-w <package name>` |
| Why one export is reported | `fallow dead-code --trace <file>:<export>` |
| Every edge into and out of one file | `fallow dead-code --trace-file <file>` |
| Where a dependency is used | `fallow dead-code --trace-dependency <package>` |
| Feature flags, and flags that do nothing | `fallow flags --retirement --format json -q` |
| Entry points and active framework plugins | `fallow list --entry-points --plugins` |

Exit code 1 means fallow found issues, not that it failed. Read the output either way.

`-o` writes only inside the project, its Git work tree or a temp directory. Give it an absolute path in a temp or scratch folder, so the report doesn't land in the repository when a script changes directory.

## Check the graph before the findings

- A warning that `node_modules` does not exist, or tsconfig files that can't be found, means the repository isn't installed. Framework plugins stay off and imports between workspace packages don't resolve. Install with the repository's package manager and run its code generation, then run fallow again.
- Count the `unresolved_imports` that point at the repository's own packages. Any at all means generated code or a package build is missing.
- Findings marked with the caveat `incomplete-import-graph` may be false. The caveat attaches to every finding when anything is missing from the graph, so find its cause before you act on it. After a full install, the usual cause is a folder in `workspace_diagnostics`.
- `workspace_diagnostics` lists folders fallow skipped, such as hidden directories with source files. Code used only from there is reported as unused. If nothing in the skipped folder imports the area you are reviewing, the caveat doesn't apply there.

## False positives by kind

These are reported as unused but are usually alive. Confirm by hand before you rate one "remove".

- **Fields of request and response classes** (DTOs), ORM entities and serialised models. Validation, serialisation and the database read them through reflection, so no code references the property. In a NestJS project these are most of the unused class members.
- **Decorated handlers and injected classes.** Controllers, resolvers, event handlers, queue processors and cron methods are called by the framework. fallow treats them as used when its framework plugin is on; check `fallow list --plugins` if they show up.
- **Standalone scripts** run by hand or from CI with `node scripts/x.mjs`. Nothing imports them, so they show as unused files. Check `package.json` scripts, CI config and docs for the file name. A one-off migration or backfill script that already ran is a real candidate, with the verdict "ask owner".
- **Index files of folders** that re-export for convenience. The index is unused, but the files behind it may not be.
- **Exports read by name at runtime**: plugin registries, `import()` with a built string, config that names a module. Search the repository for the export's name as a string.
- **Durable Object and Worker class methods** called through a stub or RPC binding from another worker.

Each false positive that repeats across the repository is worth a line in your result with the fallow config that silences it (`ignoreExports`, `entry` or `ignorePatterns`), so the next run is cleaner. Don't write that config yourself; the result is a report.
