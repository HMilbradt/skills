---
name: grill
description: Interview the requester about a change before anything is planned or built, until no decision is left to guess, and return the settled decisions. Looks up every fact itself, checks the request against the code first, and asks only what the requester alone can decide, in rounds with a recommended answer for each question. Use before building or planning from a ticket, design link or short request such as "build this", "fix this" or "implement this spec", when a request proposes a fix for a cause nobody has measured, and when asked to "grill me", "ask me questions first" or to stress-test an idea. Asks and records only; it writes no plan (use write-plan) and builds nothing.
---

# Grill

Find every decision a change needs that only the requester can make, get each one answered, and return them as a list a planner or implementer can work from. Build nothing and write no plan.

Requirements that come out after the build cost a rebuild. The questions that prevent it are few and specific to the request, and most of the work is finding out which ones they are.

## 1. Check the request before asking anything

A fact you can look up isn't a question. Look these up first. When that means reading more than a handful of files, use subagents for the reading, so the questions don't wait on it.

1. Read the whole request: the ticket with its comments, the linked design, the thread. Constraints often sit in a comment, not the description.
2. Check that the checkout is current. Run `git fetch`, then `git rev-list --count HEAD..origin/HEAD`. If the count isn't 0, read the code as it is on the default branch with `git show origin/HEAD:<path>`. A checkout that is behind can show a screen or function that has since been replaced, and the change then lands on the wrong thing. If the repository has no remote, skip this check and say so in your result.
3. Find the code the request is about and confirm it's the code the requester means. Where the ticket and the code disagree, such as a ticket that names a step the code doesn't have, that's the first question.
4. If the request names a cause or prescribes a fix ("the scan makes publishing slow, cache it"), measure the cause before accepting the fix. If the evidence doesn't support it, say so in the first round with what you measured.
5. Look for what already does the job: a component, helper, table or pattern the change can extend. Building beside an existing mechanism is the most common thing a requester rejects after the fact.
6. Read the project's own record of its terms and decisions, if it has one: a glossary file such as `GLOSSARY.md` or `CONTEXT.md`, and decision records, often in `docs/adr/`. A decision recorded there is settled, and you don't ask it again. If the request contradicts one, that is a question: name the record, and recommend that it stands unless the requester chooses to overturn it. Use the glossary's terms in your questions.

## 2. Work out what's left to decide

List every decision the change needs. Drop each one the request, the code or a recorded decision already settles, and each small one that's cheap to change later: those are yours to pick, and you report the pick.

What remains is usually some of these. Use them to find the questions, and skip any that doesn't apply:

- Which existing mechanism the change extends, when you found more than one, or none.
- What may be changed or removed to get there, and what must stay as it is.
- What a user sees in the states the request doesn't mention: partway through, empty, failed, done twice, undone.
- A word the request uses loosely, when two readings would be built differently ("take down" could mean revert or remove).
- Where the change stops: what's named in passing that could be in or out.
- Anything hard to undo: stored data, an interface others call, behaviour users will notice.
- What only the requester has: a reproduction, an affected record, an account to test with.

If nothing remains, don't invent questions. Return the result with "Asked: nothing" and the checks you made. A change with nothing to decide gets built, not interviewed.

## 3. Ask in rounds

Some decisions depend on others: whether to migrate old rows only matters once the new column is agreed. Ask in rounds, so no question is asked before the answer it depends on.

1. Take every open decision that doesn't depend on another open one. That's the round.
2. Ask the round in one message. Number each question, give the options with what each costs, and put your recommendation first, worded so "yes" accepts it. Use the host's question tool if it has one.
3. Keep a round to what the requester can answer in a minute or two. If a round has more than about five questions, you're asking things you could pick yourself; cut it down.
4. When the answers come, challenge any that the code contradicts ("you said partial refunds exist; `refundOrder` only refunds whole orders. Which is right?"), then work out the next round from what's now settled.
5. Stop when no decision is open. Two rounds settle most changes.

Ask about one concrete case when a rule is fuzzy: "A user closes the tab on step 3 and comes back tomorrow. Do they land on step 3 or step 1?" gets a better answer than "how should resuming work?".

If no one can answer, as when you run as a subagent, don't stop. Take your recommended answer for each question and list each under "Assumed" in your result.

Read [EXAMPLES.md](EXAMPLES.md) before your first round in a session.

## 4. Record what was settled

Answers kept only in the conversation are lost at the next compaction or session, and the next change re-asks them.

- If the repository has a glossary file, add or correct a term there the moment it's settled: the term, one plain sentence, and the names it replaces. No implementation detail.
- If the repository keeps decision records, offer one for a decision only when it's hard to reverse, would surprise a later reader, and came from a real choice between options. Write it in the form the existing records use.
- Record only what the requester answered. An answer you assumed because no one could reply isn't settled; list it under "Worth recording" instead.
- If the repository has neither, create neither. List the terms and decisions under "Worth recording" in your result, so the requester can decide whether to start one.

## Your result

```markdown
Change: <the request in one sentence, in the settled terms>

Settled:
- <decision>: <the answer, and who gave it: the requester, the code, or a recorded decision>

Picked by me:
- <small choice>: <the pick, in a line>

Assumed:
- <question nobody could answer>: <the recommended answer taken>

Found while checking:
- <what the checks in step 1 showed that changes the request, with the evidence>

Recorded: <glossary terms and decision records written, with paths>
Worth recording: <terms and decisions that have no home in this repository, or that wait on an assumed answer>
Asked: <number of rounds, or "nothing", and why>
```

Leave out empty sections.
