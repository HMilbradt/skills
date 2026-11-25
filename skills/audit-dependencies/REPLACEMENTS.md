# Built-in replacements

Packages that a built-in of the runtime often replaces, with the lowest runtime version that has the built-in. Check the repository's runtime targets before you suggest one, and check the "Differs" column against how the code uses the package. A replacement that changes behaviour isn't a removal; it's a migration.

These are starting points. Any package used for one small function is a candidate, listed here or not.

## Node.js

| Package | Built-in | Needs | Differs |
| :- | :- | :- | :- |
| `node-fetch`, `cross-fetch`, `isomorphic-fetch` | global `fetch` | Node 18 | No `agent` option; set proxies and keep-alive through undici. |
| `axios`, `got`, `superagent` for plain requests | global `fetch` | Node 18 | No interceptors, automatic JSON or retries. Worth it only when the code uses none of them. |
| `form-data` | global `FormData` | Node 18 | Streams append differently. |
| `abort-controller`, `node-abort-controller` | global `AbortController` | Node 15 | None. |
| `uuid` for random IDs | `crypto.randomUUID()` | Node 19 global, or `node:crypto` from 14.17 | Version 4 only. Keep `uuid` for versions 1, 5 and 7. |
| `rimraf`, `del` | `fs.rm(path, { recursive: true, force: true })` | Node 14.14 | No glob patterns. |
| `mkdirp`, `make-dir` | `fs.mkdir(path, { recursive: true })` | Node 10.12 | None. |
| `glob`, `fast-glob` for simple patterns | `fs.glob` | Node 22 | Fewer options. Check it isn't marked experimental on the target version. |
| `dotenv` | `node --env-file=.env` or `process.loadEnvFile()` | Node 20.6 for the flag, 20.12 for the function | No variable expansion. |
| `chalk`, `kleur`, `colors` | `util.styleText` | Node 20.12 | No chaining syntax. |
| `minimist`, `yargs`, `commander` for small CLIs | `util.parseArgs` | Node 18.3 | No help text or subcommands. |
| `lodash.clonedeep`, `clone-deep` | `structuredClone` | Node 17 | Drops functions and class prototypes. |
| `deep-equal`, `fast-deep-equal`, `lodash.isequal` | `util.isDeepStrictEqual` | Node 9 | Strict: `1` and `"1"` differ. Node only. |
| `lodash.groupby` | `Object.groupBy` | Node 21 | Returns an object with a null prototype. |
| `pify`, `es6-promisify` | `util.promisify` | Node 8 | None for callback-last functions. |
| `p-timeout` around `fetch` | `AbortSignal.timeout(ms)` | Node 17.3 | Works only where the call takes a signal. |
| `escape-string-regexp` | `RegExp.escape` | Node 24 | None. |
| `url-parse`, `url` (the package) | global `URL` | Node 10 | Relative URLs need a base. |
| `qs`, `query-string` | `URLSearchParams` | Node 10 | No nested objects or arrays in brackets. |

## Browsers

Compare against the repository's `browserslist` or the build tool's target.

| Package | Built-in | Differs |
| :- | :- | :- |
| `whatwg-fetch`, `unfetch` | `fetch` | None in current browsers. |
| `core-js` modules, `@babel/polyfill`, `regenerator-runtime` | native features of the targets | Remove only the modules every target supports. Set the build tool to add polyfills by usage instead. |
| `es6-promise`, `promise-polyfill`, `object-assign` | native | None in current browsers. |
| `intersection-observer`, `resize-observer-polyfill` | native | None in current browsers. |
| `moment` | `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` for formatting | Date maths and time zones need a small library such as `date-fns` or `dayjs`, or `Temporal` where the targets have it. |
| `classnames` beside `clsx` | one of them | Keep whichever has more call sites. |

## Python

| Package | Built-in | Needs |
| :- | :- | :- |
| `pytz` | `zoneinfo` | Python 3.9 |
| `toml`, `tomli` for reading | `tomllib` | Python 3.11. Read only; keep a package to write TOML. |
| `importlib-metadata`, `importlib-resources` | `importlib.metadata`, `importlib.resources` | Python 3.8 and 3.9 |
| `mock` | `unittest.mock` | Python 3.3 |
| `six`, `future` | nothing | Python 3 only code |
| `dataclasses`, `typing` backports | standard library | Python 3.7 and 3.5 |

## Go

| Module | Built-in | Needs |
| :- | :- | :- |
| `golang.org/x/exp/slices`, `golang.org/x/exp/maps` | `slices`, `maps` | Go 1.21 |
| `github.com/pkg/errors` | `errors` and `fmt.Errorf` with `%w`, `errors.Join` | Go 1.20 for `Join`. Stack traces are lost. |
