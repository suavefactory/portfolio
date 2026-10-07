# ruisimoes.com — v2

An ASCII/HUD index. One horizontal bar, centred; the ruler across it is the
work — **each project is one segment of 6 ticks**.

## Running it

Static files, no build step:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

Every stylesheet and script in `index.html` carries a `?v=` stamp. GitHub
Pages lets browsers keep a file for 10 minutes, so after changing any of them
bump the stamp, or visitors keep running the old copy.

## Layout

Geometry is 1:1 with the reference frame, measured off it pixel by pixel:

| element            | reference position                       |
|--------------------|------------------------------------------|
| bar                | 1881 × 76, centred                       |
| inner band         | y 515 → 561 (8px inset from both edges)  |
| divider B          | x 217                                    |
| ruler ticks        | x 360 → 1788, every 17px (85 ticks)      |
| contact cell       | x 17 → 217 (name + emblem cells merged)  |
| border dash        | 3px on / 2px off                         |
| tick dash          | 2px on / 2px off                         |
| background         | `#004795`                                |

`#stage` is a 1920×1080 frame pinned top-left and scaled by `--s =
innerWidth/1920`, so every child sits on a whole reference pixel and the
render is exact at a 1920px viewport. Below 760px the bar is swapped for a
vertical ASCII index.

## The ruler

**85 columns on a 17px pitch** — the same scale as the Virgil Abloh bar,
measured off it: ticks at ruler x0, 17, 34 … 1428.

The 14 projects **cycle** across those columns, `column index % 14`. So
column 1 and column 15 and column 29 are all sesh.pt, column 2 and 16 are
A Noite, and so on.

**Only the column under the cursor lights up, never its repeats.** It goes to
full white and nothing else — the tick never changes height. The whole
selection model is the CSS `:hover` / `:focus-visible` pair on the individual
`.tab`, so there is nothing that *could* spread to a project's twins — no JS
anywhere maps a project to more than one column. (`.tab.on` exists only for
the one-off intro sweep.)

- **Hover a column** → that project runs in the strip, and the bar reads it out
- **Click a column** → opens the player window
- Arrow keys move along the scale; every column is a real `<button>`

Hovering is debounced by 90ms: sweeping the ruler crosses a column every 17px,
so the strip only follows once the cursor settles.

The bar splits the read-out in two, with nothing repeated between them:

- **left cell** — which project: its month/year over `[ NAME ]`
- **right cell** — what it is and what the work was: `↗TITLE` over `ROLE`

At rest, before any hover, the strip is empty and the page is just the bar on
blue — the state the original reference frame shows.

## The strip

The active project's media running right to left behind the bar on a seamless
loop. 550px tall on a 1920×1080 frame, centred on the bar rather than the
viewport (y263–812), with **24px of page blue between slides** — all measured
off the mockup.

**Uniform height, natural width.** Every slide is the same height and keeps
its own aspect ratio, so tops and bottoms line up while the widths vary
(727px, 698px, and so on). Each media's real ratio is read off `naturalWidth`
/ `videoWidth` on load and applied to *every* copy of it at once, so both
halves of the loop stay identical. Until then a slide holds a provisional 16:9
box, so nothing collapses or jumps.

**Full colour, nothing laid over them.** No scrim, no tint, no hover fade. The
bar overlaps the stills and can be hard to read over a bright one — that is
intended.

- **Hovering a column is what starts it.** The strip is empty until then, and
  fades up rather than cutting in.
- **Clicking a slide opens the project link.** Projects without one render as
  plain `div`s rather than dead links. (Clicking a *column* opens the player
  instead — see below.)
- **Short projects still get a slideshow.** The media list repeats until there
  are at least 3 slides *and* two screens' worth — so a project with a single
  video, like CyberCafé, comes round 10 times rather than sitting still.
  Repeats cost nothing; the browser caches them.
- The loop renders the sequence twice and resets by one copy's width. Since
  `scrollWidth` carries the gaps *between* items but not a trailing one, the
  period is `(scrollWidth + gap) / 2`.
- First 3 slides load eagerly, the rest lazily as they track in.

Hidden below 760px, where the vertical index takes over.

### Motion

A slow constant drift that the wheel can shove along. A scroll adds an impulse
to the velocity, which then relaxes back to the drift speed on an exponential
curve — `vel += (DRIFT - vel) * (1 - exp(-EASE * dt))`. Framerate-independent,
no steps and no snapping.

| | px/s |
|---|---|
| `DRIFT` — resting speed | 46 |
| six wheel notches | ~1414 |
| 0.5s later | ~419 |
| 2.5s later | ~48, back to rest |
| scrolled the other way | negative — it runs backwards |
| `MAXV` ceiling | 2800 |

`dt` is clamped to 50ms so returning to a backgrounded tab never lurches.
Tunable at the top of [`assets/js/strip.js`](assets/js/strip.js): `DRIFT`,
`PUSH` (impulse per wheel notch), `EASE` (how fast it settles), `MAXV`.

## Adding or editing work

Everything lives in [`assets/js/projects.js`](assets/js/projects.js). Field
limits are set by the cells they render into:

- `name` — **≤ 18 chars**, uppercase with spaces (no underscores); shows as
  the `[ NAME ]` line in the left cell
- `title` and `role` — **≤ 15 chars** each; the two status lines, right cell
- `date` — `"MM/YYYY"`, shown verbatim. **Only three months are known**
  (sesh.pt `08/2026`, two A Noite entries `07/2026`), read off dated
  screenshot filenames in the media. The other eleven read `XX/<year>`
  pending the real ones — replace the `XX` and it appears, nothing else to
  change.
- `link` — `null` where there is no public URL; the `↗` follows from it
- `media` — paths relative to `MEDIA_BASE`, each `type: "image"` or `"video"`

The column count follows the array length, so the ruler re-divides on its own
— add a fifteenth project and you get fifteen columns.

### Media weight

`MEDIA_BASE` points at `https://ruisimoes.com/`, so the originals stream from
the current site. They are **full-resolution PNGs — some over 5MB** — and the
strip now puts them on screen at full width. Lazy loading keeps the first
paint cheap, but exporting web-sized copies (~1920px, WebP or JPEG) and
repointing `MEDIA_BASE` is the single biggest win available here.

## The player window

Clicking a column opens a small window at a **random spot on screen**, scaling
out of wherever the cursor was. Chrome and motion are lifted from
`virgilabloh.com/usmnt`, read off its stylesheet: `#1d1d1d` body at 10px
radius, `#252525` title bar at 2px/6px, 12px round close button, 10px mono
filename, and `opacity 0→1, scale(.92)→1` over **0.18s ease-out**.

480px wide with a 16:9 body, draggable by the title bar, Esc or the close
button to dismiss. Closing empties the body, which stops the video dead rather
than leaving it playing behind the scenes.

What plays depends on the project:

| link | plays |
|---|---|
| Vimeo | `player.vimeo.com/video/<id>` with the original site's params |
| YouTube | `youtube.com/embed/<id>?autoplay=1&rel=0` |
| anything else (sesh.pt) | framed directly |
| no link | the project's own media — its video if it has one |

The embed endpoints are framable; the `SAMEORIGIN` headers those services send
are on their root URLs, not on `/embed/` or `/video/`. sesh.pt sets no framing
restriction at all. `OPEN ↗` in the title bar goes to the real link, and is
hidden for projects that have none.

## The rotating name

`assets/js/name3d.js` — the rotating name from ruisimoes.com, same
construction: per-character tracking, the `Õ` hand-built as an `O` with a `~`
placed over it, bevelled extrusion, a spin group nested inside a mouse-tilt
group. Changed from the original: **white instead of near-black**, sized to
80% of the viewport width (so it dominates and runs off the edges), and
drifting slowly around the screen on two slow sine waves with coprime periods
(37s and 29s) so the path never repeats tightly.

It keeps the original's continuous Y spin and cursor-follow tilt, but the spin
is now per-second rather than per-frame so it holds its speed at any
framerate. It sits at the back of the stack, ignores the pointer, and is
skipped entirely on touch devices and under 760px.

Three.js and the Helvetiker font both load from CDNs, exactly as the current
site does. Worth vendoring both locally at some point — the font in particular
comes from `threejs.org`.

## Contact cell

`@ruipepo` over the address, the address rotated 180°. It spans x17→217 —
what used to be the name cell plus the emblem cell, both now gone. The 26
characters of `ruipedrosimoes14@gmail.com` need that width: in the old 127px
name cell they would have had to drop to about 7px.

Sizes come from the mockup, measured against the meta text as a ruler:
`@ruipepo` renders 140px wide (drawn at 139) and the address 151px (drawn at
152), both centred in the cell.

## Grain

`assets/js/grain.js` bakes 12 noise tiles once and cycles them at 24fps with a
random offset per frame. Per-frame full-screen noise was far too expensive;
this is indistinguishable and nearly free. It backs off under
`prefers-reduced-motion`.

**It sits on the page background only.** The layering is `#grain` z0, `#strip`
z1, `#stage` z2 — so the stills and the bar both paint over it and the grain
never crawls across the images. Verified by painting the grain layer solid
red: the background came back 100% red, inside a still 12%, which is exactly
the 24px gaps between slides (24/200 of the sample).
