# Design System — Monica Muthukumaran, Portfolio

A single-page editorial site. The governing idea is **"instrument, not brochure."**
Monica builds systems that move events between services and refuse to state a
number they cannot prove. The site should read like the readout of such a system:
precise labels, generous margins, real data, and motion that only ever reports
something true about the content.

Everything below is a constraint, not a suggestion. If a component needs a value
that is not in here, the value is wrong.

---

## 1. Concept

**Ink and bone.** The page alternates between two grounds:

- **Ink** (near-black, warm) — the default. Hero, work, engineering, contact.
- **Bone** (warm off-white) — used twice, for the editorial statement and the
  thinking section.

The inversion is the site's primary structural device. It replaces the usual
"cards on a dark page" rhythm with something closer to a printed publication
where signatures alternate stock. Transitions between grounds are cinematic
(a full-bleed wipe driven by scroll), which is where the budget for "cinematic"
is spent — not on every element.

**Vermilion** is the only chromatic accent. One colour, used sparingly, reads as
deliberate. Two or more reads as a template.

**No glassmorphism. No floating blobs. No 3D.** Depth comes from type scale,
ground inversion, and hairlines — not from blur and translucency. Three.js was
considered and rejected: nothing here is genuinely volumetric.

**One system drawing, and one only.** The hero originally carried a Canvas 2D
particle topology as well as the engineering graph. Two dot-and-line networks on
one page is the house style of generated portfolios, and it was the single thing
that made the page read as machine-made. The decorative one was deleted; the
meaningful, interactive one stayed. In its place the hero is **typographic**: the
name is set as individual letters that lift toward the pointer, so the
interaction is the word rather than a background effect.

**No chips.** Bordered pills listing technologies appeared in three sections and
were the most template-looking element on the site. Technologies are set as a
mono run — `PYTHON / FLASK / GEMINI` — everywhere they appear.

**Nothing may repeat a shape more than twice.** Four sections had converged on
the same "title, small caption, hairline rule" list. Exploring became a
mixed-size cloud, the Introduction became a lead plus a two-column set, and the
engineering panel lost its box. If a third section reaches for a shape, the
shape is wrong, not the section.

---

## 2. Colour

Defined once as CSS custom properties in `src/styles/tokens.css`. Never hard-code
a hex value in a component.

| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#08080A` | Page ground (dark sections) |
| `--ink-800` | `#0E0E11` | Raised ground, sticky nav fill |
| `--ink-700` | `#16161A` | Panel fill |
| `--ink-600` | `#212127` | Hairline on dark |
| `--bone-100` | `#F4F2ED` | Page ground (light sections) |
| `--bone-200` | `#E8E4DC` | Raised ground on light |
| `--bone-300` | `#D6D1C6` | Hairline on light |
| `--graphite` | `#8A8A94` | Secondary text on dark |
| `--slate` | `#5C5C66` | Tertiary text, mono labels |
| `--vermilion` | `#E2542C` | The accent. Links, active states, key data |
| `--vermilion-dim` | `#A83D1E` | Accent on bone (contrast-corrected) |
| `--amber` | `#E3A24A` | Gradient partner only; never a solid UI fill |

Contrast rules:

- Body text on ink: `--bone-100` at 78% opacity minimum (≥ 7:1).
- `--graphite` is for text ≥ 14px only, never for anything load-bearing.
- `--vermilion` on `--ink-900` is 5.4:1 — fine for large text and UI, **not** for
  body copy. On bone, use `--vermilion-dim`.
- Focus ring is always `--vermilion`, 2px, 3px offset, never removed.

**Grain.** A single 128×128 tiling SVG-generated noise, applied once as a fixed
overlay at `opacity: 0.035`, `mix-blend-mode: overlay`, `pointer-events: none`.
One node for the whole document. It is what stops the flat fills from looking
like a template, and it costs nothing after first paint.

---

## 3. Typography

Three families, each with one job. The mix is the point: a site that uses a
single grotesk for everything is the house style of generated portfolios.

| Role | Family | Notes |
|---|---|---|
| Display / UI | **Instrument Sans** (variable) | Structure, names, headings, nav |
| Editorial emphasis | **Instrument Serif**, italic | Only for the emphasised clause inside a statement, and for numerals in metrics |
| Metadata | **JetBrains Mono**, 400/500 | Section indices, labels, tech names, dates, anything that is a value rather than prose |

Instrument Sans and Instrument Serif are a designed pair. The serif italic
appears at most once per statement — it marks the word the sentence turns on.

**Loading.** Preconnect to `fonts.gstatic.com`; a single stylesheet request with
`display=swap`; only the weights used (Sans 400/500/600/700 variable, Serif 400
italic, Mono 400/500). Fallback stacks carry `size-adjust` so the swap does not
shift the huge type.

### Scale

Fluid, `clamp()`-based, defined as tokens. Ratio ≈ 1.333 at the top end,
tightening to 1.2 for body sizes.

| Token | clamp | Use |
|---|---|---|
| `--fs-mega` | `clamp(3.5rem, 14vw, 13rem)` | The name in the hero. Nothing else. |
| `--fs-display` | `clamp(2.5rem, 7.5vw, 6.5rem)` | Editorial statements, contact headline |
| `--fs-h2` | `clamp(2rem, 4.5vw, 3.75rem)` | Section headings, project names |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.75rem)` | Sub-headings, principle titles |
| `--fs-lead` | `clamp(1.0625rem, 1.35vw, 1.375rem)` | Lead paragraphs |
| `--fs-body` | `1rem` / `1.0625rem` | Body copy |
| `--fs-meta` | `0.8125rem` | Mono labels |
| `--fs-micro` | `0.6875rem` | Section indices, eyebrow labels |

### Rules

- Display sizes (`--fs-mega`, `--fs-display`): `letter-spacing: -0.035em`,
  `line-height: 0.92`. Large type must be tracked in, or it reads as default.
- A `ch` measure must sit on the element whose font-size it describes. Putting
  `max-width: 22ch` on a wrapper resolves it against the wrapper's body-size
  font and crushes the display type inside it.
- Body: `line-height: 1.6`, `max-width: 62ch`. No exceptions — a full-width
  paragraph is the fastest way to look unconsidered.
- Mono labels: `letter-spacing: 0.14em`, uppercase, `--slate`.
- Numerals in metrics use `font-variant-numeric: tabular-nums`.
- Never centre a paragraph. Centre only single-line display statements.

---

## 4. Spacing & layout

8px base. Tokens: `--s-1: 4px` through `--s-16: 160px`, plus fluid section
padding `--pad-section: clamp(5rem, 12vh, 10rem)`.

**Grid.** 12 columns, `--gutter: clamp(1.25rem, 4vw, 2.5rem)`, max content width
`1440px` with a `1180px` reading measure for text-led sections. Content is
deliberately *not* centred everywhere — the editorial sections use an asymmetric
7/5 split, which is what stops the page from feeling like a stack of centred hero
blocks.

**A pinned scene has a minimum viewport.** It is given one screen and cannot
scroll, so every time the text column grows — an award badge, another
architecture line — the minimum grows with it. The threshold lives in
`useEnvironment` as `roomy`; re-measure it after changing that column rather
than assuming it still holds. Below it, the flat layout carries the identical
content.

**Whitespace is the budget item — up to a point.** `--pad-section` was originally
`clamp(5rem, 12vh, 10rem)`, which put ~220px of nothing at every seam. Across
eight sections that reads as unfinished rather than generous; it is now
`clamp(4rem, 8.5vh, 7rem)`. Sections never touch. If two things are related, they get 24px; if they
are separate, they get 96px. Nothing in between.

**No `overflow` on `html`/`body`.** Setting one axis to `clip` or `hidden` makes
the other compute to `auto`, which turns the body into a scroll container and
silently breaks every viewport-relative `position: sticky` beneath it — that is,
the entire Work section. Horizontal overflow is contained per element instead.

**Hairlines** (`1px solid var(--ink-600)`) do the work that borders-plus-radius
usually does. Radius is `0` for panels, `2px` for small inputs, `999px` only for
the two pill buttons. There are no rounded cards on this site.

---

## 5. Motion

### Principles

1. **Motion reports state.** An element moves because it entered the viewport,
   was pointed at, or was activated. Nothing loops for decoration except the hero
   field, which represents a running event stream.
2. **Transform and opacity only.** Never animate `width`, `height`, `top`, `left`,
   `filter` or `box-shadow` in a scroll handler. Clip reveals use `clip-path`
   on a composited layer.
3. **One idea per transition.** Fade *or* slide *or* clip. Combining three is what
   makes a page feel generated.
4. **Enter fast, settle slow.** Reveals are 700–900ms; interactions are 180–320ms.
5. **Nothing blocks first paint.** The hero's canvas mounts after first paint;
   Lenis is dynamically imported once the page is idle, and only on desktop.

### Values

```
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1)     /* reveals, section enters   */
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)    /* ground inversions, pins   */
--ease-snap:  cubic-bezier(0.34, 1.32, 0.64, 1) /* magnetic release only     */

--dur-micro: 180ms   --dur-ui: 320ms   --dur-reveal: 800ms   --dur-scene: 1200ms
```

Stagger between siblings: **60ms**, capped at 8 items (beyond that the last item
arrives too late to feel connected).

### Vocabulary

| Name | Definition |
|---|---|
| **Mask reveal** | Text in a `overflow:hidden` line-box, child translates `Y: 105% → 0`, per line, staggered. The hero name and every section heading. |
| **Clip reveal** | Visual revealed by `clip-path: inset(...)` animating from one edge, 900ms, `--ease-out`. Project visuals only. |
| **Ground wipe** | Ink↔bone inversion. The incoming ground is a fixed layer whose `clip-path` inset is driven by scroll progress. |
| **Scene pin** | A project's text column is `position: sticky` while its diagram assembles band by band beside it. CSS for the pin, `useScroll` for the step. Desktop only. |
| **Kinetic name** | The hero name split into letters; each lifts up to 18px toward the pointer with a squared falloff over 260px, eased at 0.16 and parked when nothing moves. Transform only — weight is left alone because the variable font changes advance width and the line would jitter. |
| **Magnetic** | Pointer within 90px translates the element up to 10px toward the cursor at 0.18 lerp; release springs back with `--ease-snap`. Desktop, fine pointer only. |
| **Cursor** | A 8px dot + 32px ring, ring lerped at 0.14. Ring scales to 2.6× and inverts over interactive elements. `pointer: fine` only; never rendered on touch. |

### Reduced motion

`prefers-reduced-motion: reduce` is honoured as a **structural** branch, not a
CSS afterthought:

- All ScrollTrigger scrubs, pins and parallax are not registered at all.
- Reveals become a 200ms opacity fade with no transform.
- The kinetic name never binds a pointer listener at all.
- Custom cursor, magnetic buttons and Lenis smooth scroll are disabled; native
  scrolling is restored.
- Marquees and the exploring field freeze.

The setting is read once into a `useReducedMotion` hook and threaded through, so
no animated code path even mounts.

---

## 6. Component architecture

```
src/
  main.tsx                 mount, font/CSS side-effects only
  App.tsx                  section order, providers, one <Grain/>
  data/
    profile.ts             name, contacts, links, meta
    projects.ts            the 4 case studies (see "images" below)
    stack.ts               engineering graph: nodes, edges, "built with" copy
    experience.ts          roles, dates, responsibilities, systems
    principles.ts          the five thinking steps
    exploring.ts           current explorations
  components/
    chrome/                Nav, Cursor, Grain, ScrollProgress, SkipLink
    primitives/            MaskText, Reveal, Magnetic, Eyebrow, Hairline, Metric
    sections/              Hero, Statement, Work, Engineering (+ Fundamentals),
                           Thinking, Experience, Exploring, Contact
    visuals/               ProjectVisual (+ 4 diagram components), HeroField,
                           StackGraph
  hooks/                   useEnvironment (reduced/fine/ready, read
                           synchronously on first render), useSmoothScroll,
                           useOnscreen, useGroundTracker
  lib/                     math (lerp, clamp, seeded rng), scroller (anchor
                           navigation + focus handoff)
  styles/                  tokens.css, base.css, utilities.css
```

Rules:

- **All copy lives in `src/data/`.** No prose is typed inside a component. This is
  what makes the site editable without touching JSX.
- `primitives/` components are unstyled behaviour. `sections/` compose them and
  own layout. `visuals/` are pure, deterministic renderers — no data fetching, no
  randomness that is not seeded.
- Looping CSS animations are parked with `animation-play-state: paused` and
  released by `useOnscreen` — an `infinite` keyframe animation keeps burning
  compositor time thousands of pixels off-screen otherwise.
- **Motion library: `motion/react` only.** GSAP and ScrollTrigger were in the
  original plan and were removed after the scenes were built, because nothing
  was left for them to do: the Work section pins with CSS `position: sticky`
  (no JS, no layout reads, no pin-spacer) and every scrubbed value comes from
  motion's `useScroll` + `useTransform`. What remained was a registered plugin
  with zero triggers, calling `ScrollTrigger.update()` on every Lenis frame —
  50KB gzipped of dead weight on a page whose first requirement is speed. If a
  future section genuinely needs timeline scrubbing across pinned elements,
  bring it back behind the same lazy-import boundary Lenis uses.

### Fundamentals

System design and DSA are claimed on every engineer's portfolio, so the claim
carries no information. The section is written as evidence instead: each entry
names a decision, the trade-off it bought, and the system it was made in. An
entry that cannot name a system does not belong in `fundamentals.ts`. It lives
inside the Engineering section — the graph says what is used, this says how it
is reasoned about — so the navigation stays five items long.

### Project imagery

Project visuals are **generated SVG diagrams**, one per project, drawn in the same
visual language: hairline architecture on ink, vermilion marking the path that
matters, mono labels. They are components, not files, so they are sharp at every
size and cost ~2KB each instead of ~200KB.

Each entry in `projects.ts` has an optional `image` field:

```ts
image: { src: '/projects/proofaegis.png', alt: '...', width: 1600, height: 1000 }
```

If `image` is present the site renders that file (lazy, `decoding="async"`,
explicit dimensions to reserve space); if absent it falls back to the generated
diagram. Dropping a screenshot into `public/projects/` and adding three lines is
the entire replacement procedure. Documented in the README.

---

## 7. Responsive strategy

Mobile is designed, not derived. Breakpoints: `640` / `900` / `1200`.

| Concern | Desktop (≥900) | Mobile (<900) |
|---|---|---|
| Work section | Sticky text column, pinned scenes, visual advances through states — but only above 900×840, since a pinned scene gets exactly one screen and the tallest column will not fit in less | Linear stack: visual, then name, then problem/solution/architecture as a labelled list. Story order preserved, no pinning. |
| Engineering graph | Interactive force-ish node graph, hover + click | Static laid-out graph with tap targets ≥ 44px; the detail panel opens inline below |
| Hero | Kinetic letters tracking the pointer | Static type; the column rules drop to one at the margin, and the block centres rather than sitting under a third of an empty screen |
| Engineering graph | Interactive node diagram | A tap-selectable mono index — squeezed into a phone the diagram became a horizontal scroll with its right-hand labels sliced in half |
| Cursor / magnetic | On | Not mounted |
| Lenis smooth scroll | On | Off — native momentum is better on iOS |
| Type | Full fluid scale | `--fs-mega` bottoms out at 3.5rem; hierarchy ratios held, not flattened |
| Nav | Inline links, morphs on scroll | Index button → full-screen overlay |

The mobile rule: **remove interactions, never remove content.** Every problem,
solution, architecture note and metric present on desktop is present on mobile.

---

## 8. Performance budget

Hard targets, verified before ship:

- **JS ≤ 180KB gzipped** on the critical path. Measured: ~150KB (React 66,
  motion 48, app 25, CSS 11). Lenis is a lazy 5.8KB chunk fetched only on
  desktop with motion enabled. Deleting the hero canvas removed a permanent RAF
  loop and its per-frame trigonometry from the most performance-sensitive
  screen on the site.
- **LCP element is the hero name** — real text, in the initial HTML, no
  animation that delays its paint (it masks *in*, but the glyphs are painted).
- **CLS ≈ 0** — every image has explicit `width`/`height`; fonts carry adjusted
  fallback metrics.
- No layout thrash: all scroll work is in `requestAnimationFrame`, reads batched
  before writes, `will-change` applied only while an element is actually moving.
- Canvas loops throttle to 30fps on mobile and pause via `IntersectionObserver`
  when off-screen and on `visibilitychange`.
- Route is static; no backend, no database, no runtime data fetching.

## 9. SEO & accessibility

- `<title>`, meta description, canonical, Open Graph + Twitter card, generated
  SVG favicon, `theme-color`, JSON-LD `Person` schema.
- Semantic landmarks: one `<h1>` (the name), `<nav>`, `<main>`, `<section>` each
  with `aria-labelledby`, `<footer>`. Heading order never skips a level.
- Skip link, visible focus on everything focusable, `aria-current` on the active
  nav item, `aria-expanded` on the mobile menu, focus trap + `Esc` in the overlay.
- Canvas and decorative SVG are `aria-hidden`; the stack graph is additionally
  navigable by keyboard with a real list fallback.
- Anchor scrolling is smooth but sets focus on the target section so keyboard and
  screen-reader users land where sighted users do.
