---
name: explain-system
description: Explain how an existing system, feature or piece of code works, and why it was built that way, in plain words with a diagram where the flow has several steps. Reads the code and its history first, cites where each part lives, and pitches the explanation at the reader's level. Use when asked "how does this work?", "what does this do?", "walk me through X", "why is Y needed?", "what alternatives were rejected?", or to explain it again more simply. For a lasting document, use write-docs. For something broken, use investigate.
---

# Explain a system

Explain how one system, feature or piece of code works, and why it's built that way, so the reader can reason about it on their own. The result is the explanation itself: a one-off answer, not a document to maintain.

## 1. Read before you explain

1. Pin down the question: how it works, why it's this way, or both, and for which part. If the request could mean two different systems (two jobs with similar names, or a feature with a client and a server half), pick the one the reader most likely means and say in one line which you explained. Ask first only when your user is there to answer and reading both would be costly; otherwise explain the likelier one and name the other in one line.
2. Read the code that answers it: the entry points, the path a typical request or job takes, where state is stored, and where it hands off to other systems. Follow the real path; don't infer it from names. Searches also match copies of the code in worktrees (such as `.claude/worktrees/`), vendored folders and build output. Explain the checkout the reader is in, and skip the copies.
3. For "why" questions, look for the reasoning where it was written down: design docs, ADRs, plan files, comments, commit messages and the pull requests that introduced the code (`git log -S '<name>'` and `git log --follow <file>` find them). A searched-for name often isn't in the commit that explains it, so also read the full message of the commit that added the file. If no record says why, say that, and label any reason you infer as your inference.
4. Where the path leaves the repository (a service, a vendor API, a third-party tool such as a plugin host or a CI runner), check that tool's docs for the steps the answer rests on, and cite them. Skip tools that only carry the flow along; leave out a detail rather than state it from memory. If you can't check a step the answer needs, mark it as unchecked.

Never describe behaviour you haven't read.

## 2. Pitch it at the reader

Assume a capable reader who doesn't know this codebase: define this codebase's names, but not general engineering terms. If they ask for it simpler, or say they're new to the field, also drop jargon and add one analogy you hold all the way through, and move file locations out of the walk-through into "Where to look next". If they're deep in the code, skip what they already know.

Name every component in full the first time, with what it does in a few words: "the edge worker (the code that answers every request before it reaches the origin)", not "the worker". Use the same name every time after.

## 3. Explain

Use this shape, and cut any part the question doesn't need:

1. The answer in two or three sentences: what it does and the one idea that makes it work.
2. The walk-through: the path a real example takes, step by step, each step naming where it happens (a file, function, config key or doc section).
3. A diagram when the path has several steps or crosses several components. Draw what actually happens: boxes for real components, arrows for real calls or data. Use Mermaid, or a picture if your host can show one; fall back to a small text diagram.
4. Why it's built this way: the constraint or decision behind each surprising part, and the rejected alternatives that bear on the question, each with where you found it.
5. What you didn't check: steps marked as inference or taken from an external tool you couldn't check. Leave this out when there are none.
6. Where to look next: the two or three files a reader would open first.

Spend the words where the question is: on the walk-through for "how", on the reasoning for "why". Keep it to what fits on a screen or two unless asked for more. Don't suggest changes unless asked; an explanation that turns into a review answers a different question.
