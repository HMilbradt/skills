# Templates

Formats for a commit message, a pull request title and a pull request body. Text in angle brackets is a placeholder. Drop any optional part that has nothing true to say.

## Commit message

```text
<What the commit does, imperative, sentence case, no period>

<Why: what was wrong or missing, and its effect. One short paragraph.>

<What this commit does about it, as behaviour, when the subject doesn't
already say it. Side effects and anything users will notice.>

<Optional: Considered <option>; <why not>.>

<Optional, for a commit that lands without a pull request:
Tested: <command or action>, <result>.
Not tested: <what>.>

<Trailers the repository uses, such as Fixes #<issue>>
```

- Aim for a subject of about 50 characters, and never more than 72. Start with a capital letter and leave off the trailing period.
- Leave a blank line between the subject and the body. Git tools rely on it.
- Wrap the body at 72 columns. Git doesn't wrap it for you.
- Use a subject on its own when it says everything: "Fix typo in the install command".
- If the subject needs "and" to join unrelated changes, the commit probably holds two changes. Say so in your result.

## Pull request title

Follow the rules for a commit subject. When a pull request is squash merged, its title often becomes the commit subject.

## Pull request body

```markdown
<Why, in one to three sentences: the problem, who or what it affects,
and what happens without this change. Link the issue and state its key
fact.>

<What this change does about it, in one or two sentences, or a short
list when the change has several parts. Describe behaviour, not files.>

## Alternatives considered

- <Option>: <why this change was chosen over it>.

## Testing

- Ran `<command>`: <result>.
- <Manual check>: <what you saw>.
- Not tested: <what, and why>.

## Risk

<What breaks if this is wrong, whether it is easy to undo, and what the
reviewer should read slowly. Steps needed at deploy time. Follow-ups
this change leaves out.>
```

| Part | Include it when |
| :- | :- |
| Opening paragraph | Always. It has no heading, so the why is the first thing a reviewer reads. |
| What it does | The title doesn't already say all of it. |
| Alternatives considered | Real alternatives were weighed. Otherwise leave the heading out. |
| Testing | Always. Write "Not tested." when nothing was run. |
| Risk | The change is hard to undo, touches something many callers use, needs a step at deploy time, or leaves known follow-ups. |
