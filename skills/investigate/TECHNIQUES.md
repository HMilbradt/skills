# Techniques

Ways to reproduce a failure and narrow down its cause. Use them in the steps of [SKILL.md](SKILL.md): building the reproduction, and testing hypotheses when ideas run out.

## Build a reproduction

Pick the cheapest check that reaches the failure and shows the symptom.

For code, in rough order of preference:

1. A failing test at the level that reaches the bug: unit, integration or end to end.
2. A command line run with a saved input, compared against the expected output.
3. A request against a local server.
4. A captured input from the real failure (a request, a file, an event) replayed through the code on its own.
5. A small script that calls the failing function with the failing input.

For running systems, use checks that only read wherever you can: the health check or request that fails, the service's status and logs, a DNS lookup, a connection test, disk and memory use. Rerunning a failed job is a change if the job writes anything. Use its dry run mode if it has one.

Then tighten the check:

- Make it test the specific symptom, not "didn't crash".
- Make it give the same answer every run: fix the clock, seed random numbers, and keep files and network out where you can.
- Make it fast enough to run many times.

## Intermittent failures

You don't need a check that fails every time. You need one that fails often enough to measure.

1. Run the check in a loop and count failures.
2. If failures are rare, raise the rate: run in parallel, add load, shorten timeouts, or add delays near the suspected race.
3. Record the rate before any fix.
4. After the fix, run enough times that the old rate would have shown several failures. Zero failures in fewer runs than that proves nothing.

## Check what changed

Systems that worked usually keep working until something changes them. Look at the history of the code near the failure, the dependency lock file, deploys, config, data and the host. A change at the same time as the failure is a hypothesis, not a cause. Test it like any other.

## Bisect the history

When the check passes at one known commit and fails at a later one, let `git bisect` find the first bad commit.

```bash
git bisect start <bad-commit> <good-commit>
git bisect run <check-command>
git bisect reset
```

`git bisect run` reads the check's exit code: 0 means good, 125 means skip this commit because it can't be tested, and any other code from 1 to 127 means bad. If the check can't build a commit, make it exit 125, so a build failure isn't mistaken for the bug. `git bisect reset` returns the working tree to where it started. Run it even if the bisect fails.

The same halving works outside git: between two dependency versions, two config files, or two deploys.

## Shrink the input

When a large input fails, cut it down until every part left is needed for the failure. This is delta debugging.

1. Remove half the input and run the check.
2. If it still fails, keep the smaller input and repeat.
3. If it passes, put that half back and remove the other half.
4. When neither half fails alone, remove smaller pieces.

Treat a different failure as a pass. You are hunting this bug, not another one.

## Compare working and broken

Find a case that works: another environment, another input, the previous version, or similar code that behaves. List every difference between it and the broken case: versions, config, environment variables, data, permissions, time zone, locale. Test the differences one at a time.

## Instrument

- Prefer a debugger or a REPL to log lines. One breakpoint shows every variable at that moment.
- Put log lines at the boundaries between components, to find where good data turns bad.
- Trace a bad value backward to where it was produced, not forward from where it crashed.
- Mark every temporary log line with one unique string, such as `INVESTIGATE-PROBE`, and search for that string before you finish.

## Performance problems

Measure before you change anything. Time the slow case with the same input each run, or use a profiler, and record the baseline. Find the slow part from the measurement, not from reading code. Measure again after the fix, with the same input and the same method.

## Sources

- Andreas Zeller, [The Debugging Book: Introduction to Debugging](https://www.debuggingbook.org/html/Intro_Debugging.html) (scientific debugging, keeping a log, checking a diagnosis) and [Reducing Failure-Inducing Inputs](https://www.debuggingbook.org/html/DeltaDebugger.html) (delta debugging).
- Google, [Site Reliability Engineering: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/) (triage, what changed, correlation and causation, negative results).
- Git, [git-bisect documentation](https://git-scm.com/docs/git-bisect).
- Julia Evans, [A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/).
