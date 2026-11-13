# Lenses

Each lens is one question asked of the change. A reviewer works one lens, reads the diff and enough of the surrounding code to judge it, and reports only findings that answer its question.

## Rules for every lens

- Every finding cites a file and line in the change, or in code the change calls.
- Every finding has evidence a verifier can check: a concrete input and the wrong result, a plan line and the code that departs from it, or the existing code that already does the job.
- Report what someone would act on. Skip style, naming and formatting unless they hide a bug or break a convention the code follows everywhere else.
- Never propose something bigger than the change.
- Say what's wrong. Don't write "consider" or "you might want to".
- Finding nothing is a good result. Return "No findings" rather than reaching.

## Plan

Does the change do what the plan says, and only that?

- Each item in "Done when" is met by the change. Name the item and the code that meets it, or say it isn't met.
- Each step in the milestone being built is done as written: the named functions, contracts, error cases and checks.
- Nothing listed under "Stays the same" was touched.
- Nothing outside the plan was added. Extra work is a finding unless the plan's Decision log records why.
- Where the code departs from the plan, the Decision log or Surprises section says why. A departure that's logged and reasoned is fine; flag only the reasoning if it doesn't hold.

The plan can be wrong. If the code is right and the plan isn't, say so, and say which to change.

## Correctness

What input makes this code do the wrong thing?

- Trace the changed paths with real inputs: empty, one, many, missing, malformed, at each limit, and at each limit plus one.
- Look at what the change calls and what calls it. A change that's right on its own can break a caller.
- Check error handling the problem needs: a failure that's swallowed, a partial write with no rollback, a retry that repeats a side effect.
- Check concurrency where the code shares state: two requests at once, a read and a write that aren't atomic.
- Each finding gives the input, what the code does with it, and what it should do. If you can't name an input, it isn't a finding.

## Simplicity

What could go and still solve the problem?

- Measure against the problem the change was made for, from the plan or description, not against what might be useful later.
- Look for: an abstraction with one implementation, config or flags nobody asked for, generality for a future case, a new dependency for what a few lines would do, and code that duplicates something already in the repository.
- Keep what keeps the change safe: tests, error handling the problem needs, and rollback for stored data aren't extras.
- Each finding names what to cut or which existing code to use instead, and what would make it worth adding back.

## Tests

Would the tests catch this change breaking?

- Each behaviour the change adds or fixes has a test that would fail without the change. Say which behaviour has none.
- A test that asserts nothing useful, mocks the thing under test, or passes whatever the code does counts as missing.
- No existing test was weakened to pass: a loosened assertion, a deleted case, a new skip, a widened tolerance. Each one is a finding unless the change makes the old behaviour wrong on purpose.
- Don't ask for tests of code the change didn't touch, or of cases that can't happen.
