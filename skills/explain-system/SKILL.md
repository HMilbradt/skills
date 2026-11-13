---
name: explain-system
description: Explain how an existing system, feature or piece of code works, and why it was built that way, in plain words with a diagram where the flow has several steps. Reads the code and its history first, cites where each part lives, and pitches the explanation at the reader's level. Use when asked "how does this work?", "walk me through X", "why is Y needed?", "what alternatives were rejected?", or to explain it again more simply. For a lasting document, use write-docs.
---

# Explain a system

Explain how one system, feature or piece of code works, and why it's built that way, so the reader can reason about it on their own. The explanation is a one-off answer, not a document to maintain.

## 1. Read before you explain

1. Pin down the question: how it works, why it's this way, or both, and for which part.
2. Read the code that answers it: the entry points, the path a typical request or job takes, where state is stored, and where it hands off to other systems. Follow the real path; don't infer it from names.
3. For "why" questions, look for the reasoning where it was written down: design docs, ADRs, plan files, comments, commit messages and the pull requests that introduced the code (`git log -S '<name>'` and `git log --follow <file>` find them). If no record says why, say that, and label any reason you infer as your inference.

Never describe behaviour you haven't read. Where the path leaves the repository (a service, a vendor API, a third-party tool), say so, and mark which steps come from that tool's docs rather than from code you read.

## 2. Pitch it at the reader

Assume a capable reader who doesn't know this codebase: define this codebase's names, but not general engineering terms. If they ask for it simpler, or say they're new to the field, also drop jargon and add one analogy you hold all the way through. If they're deep in the code, skip what they already know.

Name every component in full the first time, with what it does in a few words: "the edge worker (the code that answers every request before it reaches the origin)", not "the worker". Use the same name every time after.

## 3. Explain

Use this shape, and cut any part the question doesn't need:

1. The answer in two or three sentences: what it does and the one idea that makes it work.
2. The walk-through: the path a real example takes, step by step, each step naming where it happens (a file, function, config key or doc section).
3. A diagram when the path has several steps or crosses several components. Draw what actually happens: boxes for real components, arrows for real calls or data. Use Mermaid, or a picture if your host can show one; fall back to a small text diagram.
4. Why it's built this way: the constraint or decision behind each surprising part, the alternatives that were rejected and why, each with where you found it.
5. Where to look next: the two or three files a reader would open first.

Spend the words where the question is: on the walk-through for "how", on the reasoning for "why". Keep it to what fits on a screen or two unless asked for more. Don't suggest changes unless asked; an explanation that turns into a review answers a different question.
