# Good and bad drafts

Each section has a good draft in Harrison's voice and one or more bad drafts. Each bad draft is labelled with the failure it shows. The projects and people are invented.

Use these to calibrate, not as templates. When a draft of yours looks like a bad one, fix that failure.

## Standup

Good

> Yesterday I knocked out a bunch of flaky e2e tests and got CI running fast again. Today I'm getting back to the permissions stuff. Once that's done we can put all our focus on the search rewrite.

Bad: self-narrating

> Yesterday was heads-down clearing out flaky e2e tests and getting CI back where it should be, which feels good to have off my plate.

It describes the feeling and stacks clauses. Say what got done.

Bad: too corporate

> Today I'm pivoting to the permissions cluster and aligning with the team on next steps.

"Pivoting", "cluster" and "aligning" are dressing. He'd say "getting back to the permissions stuff".

Bad: self-justifying

> It's a heavier lift, but it's the kind of thing I'd rather get fully right than leave half-done behind flags.

It defends the choice instead of saying what it unblocks. "Once that's done we can..." points forward.

Bad: too robotic

> Completed: resolved 7 flaky e2e tests; restored CI performance. In progress: permissions. Next: search rewrite.

A list of accomplishments with no verbs a person would say. Write sentences.

## Slack reply to a question

The question: "is the export fix in prod yet?"

Good

> Not yet. It's merged and goes out with tomorrow's deploy. I'll ping you when it's live.

Bad: too chatty

> Hey! Great question, so basically the fix is technically merged but it hasn't quite made it out to prod yet, should be going out tomorrow-ish I think? Let me know if you need anything else!

The answer is buried under a greeting, hedges and a sign-off. Lead with "Not yet".

Bad: too robotic

> The fix has been merged into the main branch. It is scheduled for deployment in tomorrow's release. A notification will be provided upon deployment.

Passive voice and formal words. Nobody talks like this in Slack.

## Status update to a non-technical person

Good

> Login was slow this week because of how we were checking accounts on each page. That's fixed, and it's back to normal. Next up is the new export, which should be ready for you to try on Thursday.

Bad: too technical

> We found an N+1 query in the session middleware that was regressing p95 latency, refactored it to batch the lookups, and rolled it out behind a feature flag.

Accurate, but the reader can't tell what changed for them. Say what they saw, that it's fixed, and what's next.

Bad: too corporate

> I wanted to provide a quick update on our progress. We've made significant strides in improving login performance and are well positioned to deliver the export functionality in the coming days.

Preamble, "significant strides", "well positioned", and no date. Say what happened and when.

## Note to family about a tech thing

Good

> Hey, I set up your laptop to back up your photos every night to the drive in my closet, so they're safe if the laptop dies. You don't need to do anything. If you ever see a message saying the backup failed, text me.

Bad: too technical

> I set up a nightly rsync job that copies ~/Pictures to the NAS over SMB, with 30 days of snapshot retention.

Setup details the reader can't use. Say what it means for them and the one thing to watch for.

Bad: self-narrating

> Okay so I finally got around to sorting out your photos!! It took way longer than I thought it would (classic me) but I think it's all good now, fingers crossed haha.

All about how it went for him. The reader needs to know their photos are safe and what to do if something goes wrong.

## Asking for help

Good

> Anyone know why the e2e suite times out only on CI? It runs in about 4 min locally and dies at the 20 min limit on CI. I've ruled out the cache and the node version. Happy to pair if someone has 15 min.

Bad: self-justifying

> Sorry to bother everyone, I know it's a busy week. I've been stuck on this for most of the day and have tried a lot of things, but I was wondering if anyone might possibly have some insight into why the e2e tests could be timing out?

Apology and effort come before the question, and "a lot of things" doesn't say what was tried. Ask first, then give what he's seen.

Bad: too vague

> CI is broken again, anyone?

Short, but nobody can help without the symptom and what's been ruled out.

## PR review comment

Good

> This works, but it refetches on every render. Could we move it into the loader, ie fetch once per page? g2g otherwise.

Bad: too corporate and hedged

> Great work on this! One small thought: I'm wondering if it might potentially be worth considering whether we could leverage the loader here to help ensure we aren't fetching unnecessarily. Totally up to you though!

Praise, hedges and "leverage" wrap a one-line suggestion. Name the problem, suggest the fix, say if it's otherwise good to merge.
