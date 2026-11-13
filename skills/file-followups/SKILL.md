---
name: file-followups
description: Turn follow-up work into issues in whatever tracker the repository uses, such as Linear, GitHub Issues or Jira. Works out the tracker, team and project from the repository and asks when that's unclear, skips anything already filed, and writes each issue so someone with no context can pick it up. Takes follow-ups from a plan, review findings, a pull request or the conversation. Returns the issues it filed, or drafts when it can't reach the tracker. Run only when the user asks to file, ticket or track follow-ups.
disable-model-invocation: true
---

# File follow-ups

Turn a list of follow-up work into issues in the tracker this repository uses, and return what you filed. Issues are read by people who weren't in the conversation, so each one has to stand on its own.

## 1. Collect the follow-ups

Use the items you were given. Otherwise take them from where the request points: a plan's "Follow-ups" section, review findings that weren't fixed, a pull request's description or comments, or the conversation.

For each item, note what the work is, why it matters, where in the code it applies, and where it came from (the pull request, commit or issue). Only work marked as deferred counts: a Follow-ups section, findings left unfixed, items someone said to do later. Open questions, accepted risks and assumptions aren't follow-ups; ask before filing them. If an item is too vague to act on, it isn't ready to file; list it in your result instead.

## 2. Find the tracker

Look for these signals, strongest first:

1. The repository's agent instructions or contributing guide (AGENTS.md, CLAUDE.md, CONTRIBUTING.md) naming a tracker, team or project.
2. Links in recent commits, branch names and pull request descriptions: `linear.app/...`, `*.atlassian.net/browse/...`, `github.com/<owner>/<repo>/issues/...`.
3. Issue keys in branch names and commit messages, such as `ENG-1234`. A key alone doesn't tell Linear from Jira; a link or the tools you have access to does.
4. Issue templates in `.github/ISSUE_TEMPLATE/`, which point to GitHub Issues.
5. Where the repository is hosted. A GitHub repository with issues turned on is the fallback guess when nothing else points anywhere.

A connected tool on its own is not a signal. A Linear or Jira connector reaches whatever workspace it was set up for, which may have nothing to do with this repository; never file into one just because you can reach it.

```bash
git log -50 --format='%s%n%b' | grep -oE '(https?://[^ )]+(issues|browse|issue)/[^ )]+|[A-Z][A-Z0-9]+-[0-9]+)' | sort | uniq -c | sort -rn | head
git branch -a --format='%(refname:short)' | grep -oE '[A-Za-z]+-[0-9]+' | sort | uniq -c | sort -rn | head
```

Use the same signals to pick the team or project: the key prefix most commits use, or the project the source pull request links to.

Ask before filing when the signals point to more than one tracker or team, when none point anywhere, or when the follow-ups belong somewhere other than where this repository's work usually goes. Offer your best guess first. If nobody can answer, return drafts and say what you couldn't decide.

## 3. Skip what's already filed

Search the tracker for open issues on the same work, using the code names and key words from each item. Where one exists, don't file a duplicate. Add the new context to it as a comment only if the request asked you to, and list it in your result either way.

## 4. Write each issue

- Title: the change, verb first, specific enough to tell apart from its neighbours. "Retry webhook delivery on 503", not "Webhook improvements".
- Body: why it matters, what to change and where (exact file and function names), how to tell it's done, and a link to where it came from. Copy the reasoning in: a link to a conversation or a local plan file is useless to the reader.
- Use the team, project, labels and priority the tracker already has. Don't create new labels or projects unless asked. Set priority only when the source gives one, such as a P2 finding.
- One issue per piece of work someone could pick up alone. Group closely related items into one issue rather than filing several that must ship together.

Read [EXAMPLES.md](EXAMPLES.md) before your first issue in a session.

## 5. File them

Filing creates records other people see. File when the request asked for it and step 2 settled the tracker without asking. Otherwise, or when you've added items the request didn't name, show the list (titles, tracker and team) and ask first.

If you can't reach the tracker, don't file through a workaround. Return the drafts, ready to paste.

When the request asks for it, link each issue from its source: a comment on the pull request, or a line in its description.

## Your result

```markdown
Tracker: <tracker, team and project>, because <the signal that decided it>.

Filed:
- <key or link>: <title>

Already filed:
- <key or link>: <title>, matches <follow-up>

Not filed:
- <follow-up>: <why: too vague, or waiting on an answer>
```

When you return drafts instead of filing, give each issue's title and body in full under "Drafts". When you're asking before filing, put the question first, then the drafts, so the answer can be "yes, file these".
