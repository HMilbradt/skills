---
name: design-ui
description: Design and build UI that looks considered rather than generic, with generous white space and no clutter. Covers new screens, pages, components and landing pages, redesigns and polish passes, and exploring several design directions. Reads the project's design system first, writes a short direction, builds to a quality floor and checks the real render at desktop and phone width. Use when asked to design, build, style, redesign or polish a UI, to "make it look nice", when a page looks cluttered, generic or AI-made, or when implementing a design from a mockup. Not for charts and data visualisation, or for writing a design system's documentation.
---

# Design UI

Design and build interface that feels calm, spacious and specific to its product, then check it on the real render. Returns the built UI, the direction it follows and what was checked.

Left alone, an agent lands on the centre of everything it has seen: the eyebrow over the headline, a hero with two buttons, a grid of identical cards, soft shadows and big radii everywhere, a purple or blue glow. Every step below exists to pull away from that centre and toward something chosen for this product.

## Start from what exists

1. Read the project's design system before anything else: the theme or token file, the component library and two or three existing screens. If one exists, compose its components and use its tokens. Don't invent new colours, radii, shadows or one-off components. The brief and the design system beat this skill's taste every time.
2. If the design system lacks something you need, build the smallest addition from its tokens and name the gap in your result. Never change a logo or brand mark. If there's no design system at all, the direction you write below becomes one: put its values in tokens.
3. Name the product, the user and the one thing the user came to do. You should be able to write each in a sentence. If you can't, and there's no design system or existing screen to infer from, ask once for the audience and the tone, with your recommended answer first. If no one can answer, take your recommendation and list it as an assumption.

When asked to polish or fix existing UI rather than design something new, skip the direction. Render it, find the problems with [SIGNS.md](SIGNS.md), and fix only those, in this order: spacing, colour, icons, copy, type, layout, motion. Spacing goes first because everything reads differently once the rhythm is right. A screen with no signs stays as it is; don't change a good screen just to make it different.

## Use space, not boxes

White space is the main design material on every surface, app or marketing.

- Group with space. Keep things in a group close together and put clearly more space between groups. Put more space above a heading than below it.
- Give each view one primary action. Show few elements and put detail behind a click.
- Use a card only for a distinct object or something you interact with. Never put a card inside a card. Don't draw a divider between every row; space and alignment already separate them.
- Write labels a non-technical person understands at a glance. Cut helper text that repeats its label, and keep IDs and jargon out of the main view.
- When in doubt, remove. A finished screen usually has fewer elements than the first draft.

Space between groups is not padding around the edges. On phones keep edge padding tight (about 16px) and controls compact, and spend the space between groups instead. Oversized mobile padding and inputs are the most common spacing mistake.

Product UI stays quiet and familiar; patterns users already know are correct there. Marketing pages, first-run and empty states, and moments where an AI is working get one signature element as well: the one place the boldness goes. Everything around it stays quiet.

## Write the direction before code

For a new screen or page, write this block in your result before you build. With a design system, type, colour and shape come from it.

```markdown
Product: <what it is, in one sentence>
User and action: <who, and the one thing they came to do>
World: <the material, place or object this belongs to, taken from the subject>
Type: <one or two faces and their roles; a scale of four or five sizes>
Colour: <a neutral ramp and one accent, as four to six named hex values>
Shape: <radius, and depth as either borders or shadows, not both>
Signature: <the one bold element, or "none" for product UI>
```

"Clean", "modern", "sleek", "minimal" and "premium" are not a world; every generic page claims them. Take the world from the subject: a gardening app might borrow seed packets and soil tones, a chess app might borrow paper and ink.

Then run the mirror test: would a similar prompt for a different product land on this exact combination? If yes, change one decision, using the subject to choose. Watch for the "tasteful" default too: a cream paper background, a serif headline and one deep green or terracotta accent is where agents land when they try to avoid the obvious. Keep it only when the world really is paper. Don't pick fonts or colours from a list of safe or banned options. Banning a default only moves you to the next one: ban Inter and you get Space Grotesk.

## Build to the floor

1. Read [FLOOR.md](FLOOR.md) before writing UI code, and build to it without listing it back.
2. Read [MOTION.md](MOTION.md) before adding any animation or transition.
3. Use real copy and plausible data. Never invent metrics, testimonials, customer logos or reviews. Where a fact is missing, show a clear placeholder instead of making one up.

## Check the render

You haven't seen the design until you've looked at a screenshot of it. Agents regularly report "looks good" over broken spacing, so this step is not optional.

1. Render the UI at 1440x900 and at 390x844, in light and dark if both exist. Use whatever the session has: a browser tool, Playwright, or the project's dev server. Serve a standalone HTML file over a local HTTP server rather than opening it as `file://`, which some browser tools won't resize. Wait for entrance animations to finish before taking a screenshot, or a working page can look broken.
2. Look at each screenshot closely. Check edge padding, gaps between groups, alignment, overlap, clipped tooltips and menus, text that overflows or wraps badly, and horizontal scroll on the phone width. Zoom in on anything small.
3. Compare against [SIGNS.md](SIGNS.md) and [FLOOR.md](FLOOR.md). Fix everything you found in one batch, then render again.
4. Stop after three rounds and list what's left in your result.

If you can't render at all, say so in your result and list the UI as not visually checked.

## Explore directions

When asked for options or directions, or for a new product's first screens:

1. Make three to five numbered directions that differ in structure and idea, not only in colour.
2. Title each with its idea in a few words, and give it a one-line rationale and its trade-off. Put your recommendation first.
3. In the next round, combine the parts that were picked into one direction. Label it as the pick and keep the others as the record.

## Your result

```markdown
Built: <files or artboards, and what each shows>
Direction: <the direction block, or "Followed <design system>">
Checked: <widths and themes rendered, rounds run, what was fixed>
Not checked: <what wasn't rendered or verified>
Gaps: <design system gaps and placeholders for missing content>
Assumptions: <answers taken without asking>
```

Leave out a line that has nothing to say.
