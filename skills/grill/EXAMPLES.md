# Grill examples

Each pair shows a round that wastes the requester's time and one that doesn't. The names are invented.

## A request with a ticket link and "build this"

The ticket asks for a "save for later" button on the checkout page.

Bad:

```markdown
Before I start, a few questions:
1. Which framework is the checkout page built in?
2. Where should saved items be stored?
3. Should this have tests?
4. Any design preferences?
5. What's the timeline?
```

Good:

```markdown
The checkout page already has a wishlist (`WishlistButton`, backed by the `wishlist_items` table). Two things only you can decide:

1. Is "save for later" the wishlist under a second name, or a separate list?
   Recommended: reuse the wishlist, and the button adds the item to it and removes it from the cart. One table, one page to maintain. Yes?
   Other option: a separate "saved" list. Needs a table, a page and a rule for items in both.

2. A saved item goes out of stock. Does it stay in the list marked unavailable, or disappear?
   Recommended: stay, marked unavailable, which is what the wishlist does. Yes?
```

What changed: the bad round asks facts the code answers (the framework, where things are stored) and things nobody needs to decide yet. The good round did the reading first, found the mechanism that already exists, and asks the two decisions that would be built differently, each answerable with "yes".

## A request that names the cause

The request says: "Publishing takes 30 seconds because of the link scan. Cache the scan results."

Bad:

```markdown
1. How long should cached scan results live?
2. Should the cache be per site or global?
```

Good:

```markdown
I timed a publish on the staging copy of the Larch site: 31 s total, 0.4 s of it in the link scan. 27 s is the image upload, which runs one file at a time.

1. Caching the scan would save under half a second. Shall I leave the scan alone and make the uploads run in parallel instead?
   Recommended: yes. Same result for the user, and the change is in one function.
```

What changed: the bad round accepts the cause and asks how to build the prescribed fix. The good round measured first, and the one question is whether to fix what's slow.

## Nothing to decide

The request: "Rename the `usr_nm` column to `username` in the admin export; ticket OPS-311 has the details." The ticket names the column, the file and the expected header.

Bad: three questions about naming conventions and whether other columns should be renamed too.

Good: no questions. The result says "Asked: nothing. The ticket names the column, the file and the expected output, and the export has one caller."

What changed: a request that leaves nothing to decide gets no interview. Whether to rename other columns isn't a question, because nobody asked for it.
