---
name: file-followups
description: Turn deferred work from a plan, review findings, a pull request or the conversation into issues in the tracker the repository uses, such as Linear, GitHub Issues or Jira. Works out the tracker and team from the repository, skips anything already filed, and returns the issues it filed, or drafts ready to paste when the tracker is unclear or out of reach. Run only when the user asks to file, ticket or track follow-ups.
disable-model-invocation: true
---

# File follow-ups

Turn a list of follow-up work into issues in the tracker this repository uses, and return what you filed. Issues are read by people who weren't in the conversation, so each one has to stand on its own.

## 1. Collect the follow-ups

Use the items you were given. Otherwise take them from where the request points: a plan's "Follow-ups" section, review findings that weren't fixed, a pull request's description or comments, or the conversation.

For each item, note what the work is, why it matters, where in the code it applies, and where it came from (the pull request, commit or issue). Only work marked as deferred counts: a Follow-ups section, findings left unfixed, items someone said to do later. Open questions, accepted risks and assumptions aren't follow-ups: leave them out and list them under "Left out", so whoever called you can decide whether to track them. If an item is too vague to act on, it isn't ready to file; list it under "Not filed".

## 2. Find the tracker

Look for these signals, strongest first:

1. The repository's agent instructions or contributing guide (AGENTS.md, CLAUDE.md, CONTRIBUTING.md) naming a tracker, team or project.
2. Links in recent commits, branch names and pull request descriptions: `linear.app/...`, `*.atlassian.net/browse/...`, `github.com/<owner>/<repo>/issues/...`.
3. Issue keys in branch names and commit messages, such as `ENG-1234`. A key alone doesn't tell Linear from Jira; a link or the tools you have access to does.
4. Issue templates in `.github/ISSUE_TEMPLATE/`, which point to GitHub Issues.
5. Where the repository is hosted. A GitHub repository with issues turned on is the fallback guess when nothing else points anywhere.

A connected tool on its own is not a signal. A Linear or Jira connector reaches whatever workspace it was set up for, which may have nothing to do with this repository; never file into one just because you can reach it.

```bash
git log -50 --format='%s%n%b' | grep -oE '(https?://[^ )]+(issues|browse|issue)/[^ ),]*[^ ).,]|[A-Z][A-Z0-9]+-[0-9]+)' | sort | uniq -c | sort -rn | head
git branch -a --format='%(refname:short)' | grep -oE '[A-Za-z]+-[0-9]+' | sort | uniq -c | sort -rn | head
```

The key pattern also matches names like `UTF-8` and `SHA-256`. Count a prefix as an issue key only when it repeats across commits or appears in a tracker link.

Use the same signals to pick the team and project: the key prefix most commits use, and the project of the source pull request or issue.

On GitHub, check the repository before treating it as the tracker:

```bash
gh repo view --json nameWithOwner,isFork,isPrivate,hasIssuesEnabled,parent
```

A fork's upstream belongs to someone else, so never file there unless the user names it, even when the fork has issues turned off. When the tracker is public and the follow-ups came from private work, keep internal names, customers and deployment details out of the issue.

Ask before filing when the signals point to more than one tracker or team, when none point anywhere, or when the follow-ups belong somewhere other than where this repository's work usually goes. Offer your best guess first. If no one can answer, carry on through step 4 and return drafts instead of filing, with the question at the top of your result.

## 3. Skip what's already filed

Search the tracker for open issues on the same work, using the code names and key words from each item. Search even while the tracker is undecided, but only in trackers a step 2 signal points to, and say in your result which tracker each match is in. Where one exists, don't file a duplicate. Add the new context to it as a comment only if the request asked you to, and list it in your result either way.

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
Question: <only when asking before filing: the question and your recommended answer>

Tracker: <tracker, team and project>, because <the signal that decided it>.

Filed:
- <key or link>: <title>

Already filed:
- <key or link>: <title>, matches <follow-up>

Not filed:
- <follow-up>: <why: too vague, or waiting on an answer>

Left out:
- <open question, accepted risk or assumption>: not deferred work

Drafts:
<only when you didn't file: each issue's title and body in full, ready to paste>
```

Put the question first and the drafts last, so the answer can be "yes, file these".
