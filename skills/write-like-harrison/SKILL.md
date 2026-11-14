---
name: write-like-harrison
description: Draft or rewrite messages in Harrison's own voice so they sound like him, not corporate or robotic. Covers standups, Slack messages and replies, status updates, emails, code review comments, requests for help, and notes to friends or family. Use when writing something Harrison will send or post as himself, or when he asks to clean up, tighten or reword a message he wrote, or how to reply to someone. Drafts the text only; it doesn't send or post it. Not for documentation, READMEs, runbooks or agent instruction files (use write-docs), or for commit messages and PR descriptions (use write-pr).
---

# Write like Harrison

Draft text that Harrison will send as himself. It should read the way he'd say it out loud to a friend: plain, relaxed and pointed at what comes next. The target sits between robotic and chatty.

Your result is the drafted text, ready to paste, followed by any gaps. Don't send or post it, even when a messaging tool is available: Harrison or the caller sends it.

Draft without stopping to ask. A draft is cheap to redo, and a question costs a round trip.

- If a fact the reader needs is missing (a date, a name, what's blocked), put a bracketed gap like `[which day?]` in the draft and list the gaps after it. Don't invent the fact.
- If the message carries his own decision, such as accept or decline, or yes or no, give both short versions instead of a bracketed gap.
- Don't bracket what the reader already knows, such as the name of a system his own team works on.
- If the reader isn't clear, infer it from the channel or the person named. When there's nothing to go on, write for his team and say so after the draft.

Read [EXAMPLES.md](EXAMPLES.md) before drafting. The pairs there show the voice better than the rules below.

## This skill or write-docs

Use this skill when Harrison is talking to particular people at a point in time: standups, Slack, status updates, emails, code review comments, notes to himself or to family. Use `write-docs` when the text is a page people or agents will come back to and act on later, often without knowing who wrote it: READMEs, how-tos, runbooks, reference pages, postmortems, AGENTS.md and SKILL.md files. Use `write-pr` for commit messages and PR descriptions.

If a message turns into instructions someone will follow later, such as setup steps posted in Slack, write the steps with `write-docs` and keep the message around them in this voice.

Some `write-docs` rules apply here too:

- No em dashes and no double hyphens. Use a period, comma, colon or parentheses.
- No emoji, unless Harrison asks for them.
- Avoid the words and phrases in the "Words to avoid" and "Phrases to avoid" tables in the `write-docs` skill's [VOICE.md](../write-docs/VOICE.md). If that skill isn't installed, at least cut delve, leverage, robust, seamless, crucial, streamline, "It's worth noting" and "I hope this helps".

Its rules about durable facts don't apply, including the time words in VOICE.md's tables. A message is dated, so "now", "currently", today's numbers and people's names are fine.

## Rewriting his own draft

When Harrison gives you a message he wrote, fix what breaks the voice and keep the rest.

- Keep his words where they already fit. "the migration to the new queue" stays; don't swap in a more formal name or bracket it.
- Keep the facts and the certainty he gave. Cut filler hedges ("just", "I think" before a plain fact), but keep a real one: "mostly done" and "should be done by end of week" say how sure he is.
- Add nothing he didn't say. Don't turn "noisy alerts" into "alerts that kept firing" or invent what the work unblocks.
- Fix the mechanics: lowercase starts, run-on clauses, double hyphens, "just wanted to give a quick update".

## The voice

- Write it the way he'd say it. Plain, declarative sentences. Past tense for what happened, present for what's next.
- Use loose, everyday verbs: "knocked out a bunch of", "got it running fast again", "getting back to", "stuff". Prefer them to formal ones like "cleared out", "restored performance" or "resuming the remaining work".
- Cut sentiment and self-narration. Say what happened, not how it felt. "Feels good to have it off my plate" is too much.
- Frame work by what it unblocks, not by justifying it. "Once that's done we can put all our focus on the search rewrite", not "it's a heavier lift but I'd rather get it right". Only when you know what it unblocks; otherwise leave it out, without a gap.
- Keep technical nouns when the reader knows them. They're the names of the work, not jargon. For a reader who doesn't know them, say what they'll see instead.
- Use his abbreviations, spelled his way: ie, e2e, QA, devx, g2g.
- Lead with the answer. A yes/no question gets "yes" or "not yet" first, then the reason.
- Give numbers meaning. "4 min locally, times out at 20 on CI" beats "it's slow on CI".
- Short sentences. Joining two related things with "and" is fine, the way people talk. Stacked clauses aren't.
- Don't overcorrect into filler. No "Hey!", "So basically", "Great question", exclamation marks for energy, or a sign-off.

## Tone by reader

The voice stays the same. What changes is how much detail and which words.

| Reader | Adjust |
| :- | :- |
| Team (standup, Slack, PRs) | Technical nouns and his abbreviations. Two to four sentences for a standup. |
| Non-technical person at work | What changed for them, what's next and when. Swap technical nouns for what they see. |
| Friends or family | What they'll notice and what, if anything, they need to do. No jargon, no setup details. |
| Asking for help | The question first, then what he's seen and what he's ruled out. No apology. |

## Words he doesn't use

Corporate verbs and filler that turn up in AI drafts of messages: pivot, leverage, align, circle back, touch base, sync up (as a verb for talking), bandwidth, heads-down, on my plate, workstream, cluster (for a group of tasks), deliverables, "just wanted to", "quick update", "excited to share", "per my last message".

## Check the draft

1. Read each sentence as if he were saying it to a friend. Rewrite any he wouldn't say.
2. If the first sentence is a greeting or a preamble, cut it so the answer comes first.
3. Look for feelings, justifications and a closing line. Cut them.
4. Search for em dashes, double hyphens, emoji and the words above.
5. Check every fact against what you were given. Remove anything you added, and mark only the gaps the reader needs filled.

## Your result

Give the draft first, ready to paste and not in a code block. After it, add a line starting "Gaps:" with each bracketed gap and what's needed to fill it, and a line starting "Assumed:" with the reader, if you had to guess it. Leave out either line when it has nothing to say; don't write "Gaps: None".
