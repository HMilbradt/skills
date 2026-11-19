# Quality floor

The floor is what every screen gets, whatever its direction. The brief or the project's design system can override any line here except the ones about accessibility and invented content.

Contents: tokens, type, colour, space and layout, depth and shape, states, mobile, browser details, copy.

## Tokens

- Every colour, font, size, radius, shadow and spacing value comes from a token or CSS variable. A one-off value like `margin-top: 13px` is a bug.
- Light and dark themes are two sets of the same tokens. Switch them by the theme, not by rewriting components.

## Type

- Use one or two typefaces. Give each a role, such as headings and body, or interface and code.
- Use a scale of four or five sizes, and make each step clearly different. Build hierarchy from size and weight first; muted colour is for secondary text only.
- Body text sits at 16px or more on marketing pages and 14 to 16px in app UI. Keep a line to 65 to 75 characters.
- Tighten large headings slightly, about -0.02em. Don't go past -0.04em, and don't track body text.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs. Use `font-variant-numeric: tabular-nums` wherever numbers line up or change.
- Use monospace for code, IDs and measurements only, never as a "technical" costume.
- Write secondary text in a muted colour token, not with opacity or a thinner weight.

## Colour

- Use one neutral ramp and one accent. The accent marks the primary action, selection and focus, and little else.
- Keep the neutrals all warm or all cool; don't mix them.
- Body text needs a contrast ratio of at least 4.5:1, and large text and icons at least 3:1. Check the muted text in both themes; it fails most often.
- On a coloured surface, tint secondary text from that colour rather than using grey.
- Never show status by colour alone. Pair it with a word or an icon, and make danger and success differ in lightness, not only hue.
- Design dark mode rather than inverting light mode. Raise surfaces by making them lighter, lift the accent so it reads on dark, and keep the background neutral or warm rather than blue-black.
- Gradients belong in a signature element at most, never spread across the chrome as decoration.

## Space and layout

- Use a 4px base scale, and only values from it.
- Keep space inside a group clearly smaller than space between groups. Put more space above a heading than below it.
- Cap content width and let only the side margins grow on wide screens.
- Align to a few strong edges. Left-align text in app UI; keep sidebar and menu titles left-aligned too.
- Use `min-height: 100dvh` rather than `100vh`, and `minmax(0, 1fr)` for grid tracks so long content can't blow a column out.
- On a short page the footer still sits at the bottom of the viewport.

## Depth and shape

- Show elevation with either a border or a shadow, not both. A hairline border under a wide soft shadow looks muddy.
- Give shadows an offset and a soft blur. A zero-offset coloured halo is a glow, not depth.
- Use one radius family, scaled by size: small for inputs and buttons, larger for cards and sheets. Keep pill shapes for small things such as badges, chips and toggles, not every button.

## States

Build every state the UI can reach, not just the happy path:

- hover, active and visible keyboard focus (`:focus-visible`) on every control
- disabled, with a reason when it isn't obvious
- loading, keeping the button's label and width so nothing jumps
- empty, saying what's missing and the one action that fixes it
- error, next to the field or item it's about, saying what went wrong and how to recover
- long content: long names, long words and many items, with text that wraps instead of overflowing

## Mobile

- Design every screen to work at 390px wide with no horizontal scroll.
- Keep edge padding around 16px. Use compact controls and smaller buttons than on desktop.
- Make touch targets at least 44px, growing the hit area rather than the visible art.
- Make text inputs at least 16px so the phone doesn't zoom in. Keep an input visible above the on-screen keyboard.
- Keep headers, tooltips and menus inside the viewport; flip or shift them rather than clipping.
- Hiding or showing something must not shift the layout around it.

## Browser details

These ship with browser defaults unless you style them, and they're what makes a page look built rather than assembled:

- Scrollbars: thin, themed from the palette, on a transparent track, in both themes.
- Text selection colour and the caret colour.
- Focus rings that match the design and appear instantly.
- Underline offset and thickness on links.
- No flash of the wrong theme on load: set the theme before first paint.
- A `color-scheme` that matches the theme, so form controls and scrollbars follow it.

## Copy

- Titles are nouns and buttons are verbs with an object: "Save changes", not "Submit". The action keeps one name through the flow: "Publish" leads to a "Published" message.
- Write in sentence case, without exclamation marks.
- Give numbers units and context: "+12% vs last month", not "+12%!".
- Errors say what happened and what to do, without apologising or blaming the user.
- Use real words for icons: every icon-only button gets an accessible label.
