# Motion

Motion explains a change: where something came from, where it went, and that the app heard the user. Good motion feels continuous and is barely noticed. Bad motion pauses, steps, jumps or decorates.

## When to animate

- Animate state changes the user would otherwise lose track of: opening and closing panels, sheets, menus and dialogs; items being added, removed or reordered; sections expanding; toasts arriving.
- Don't let content pop in. Something that appears or disappears without a transition feels jarring.
- Don't animate what people do many times a minute, or actions started from the keyboard. Instant feels faster there.
- Give a page one orchestrated moment at most, such as a hero entrance or a first-run reveal. Don't fade up every section on scroll.
- Keep celebrations rare and earned, for example when a whole list is done. A cheap effect is worse than none.

## How to animate

- Animate `transform` and `opacity`. Use `clip-path` for a wipe or reveal. Avoid animating width, height, top or left, which make the page re-layout and stutter.
- Use 100 to 200ms for feedback and small overlays, and 200 to 300ms for panels and sheets. Nothing in the interface takes longer than about 400ms.
- Ease out on entrances, so things arrive fast and settle. Ease in on exits. Never use linear easing for movement.
- Enter from somewhere meaningful: a menu grows from its trigger, a sheet rises from the bottom edge, a toast slides from where toasts live. Scale from about 0.95, never from 0.
- Run one smooth curve from start to end. A transition that pauses midway, or a fade that moves in visible steps, reads as broken. Use stepped motion only when the style calls for it, such as pixel art.
- Name the properties in a transition. Never `transition: all`.
- Hiding or showing an element must not push other content around. Reserve its space, or animate the space opening and closing.
- Stack toasts, and animate the ones already showing as a new one arrives.
- Press feedback on buttons is a small scale-down, about 0.97, on `:active`.

## Loops and live activity

- Loop only while something is really happening, such as an agent working or content loading. A soft shimmer or a slowly moving border fits; stop it the moment the work ends.
- Show a spinner only after a short delay (about 150 to 300ms), and once shown, keep it long enough not to flash.

## Reduced motion

Under `prefers-reduced-motion: reduce`, replace movement with a quick fade or an instant change, and stop every loop.
