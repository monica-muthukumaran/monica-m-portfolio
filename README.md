# Portfolio — Monica Muthukumaran

A static, single-page portfolio. React + Vite + TypeScript, no backend, no
database, no runtime data fetching.

Read [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) before changing anything visual —
it is the source of truth for type, colour, spacing and motion, and every
decision in the code refers back to it.

---

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview
```

`dist/` is the whole site. It can be dropped on Firebase Hosting, Netlify,
Vercel, GitHub Pages or any static host with no configuration.

---

## Where the content lives

**No prose is written inside a component.** Everything editable is in
`src/data/`, so copy changes never touch JSX.

| File | Holds |
|---|---|
| `src/data/profile.ts` | Name, role, location, hero statement, intro paragraphs, contact links, closing copy |
| `src/data/projects.ts` | The case studies — problem, solution, architecture, metrics, award, the "note". Two are live, two are archived |
| `src/data/diagrams.ts` | Each project's architecture diagram, as bands of boxes |
| `src/data/stack.ts` | The engineering graph: nodes, their positions, and what was built with each |
| `src/data/experience.ts` | Roles, dates, responsibilities, systems, education, certifications |
| `src/data/fundamentals.ts` | System-design and DSA entries, and the optional practice-profile link |
| `src/data/principles.ts` | The six "how I think" entries |
| `src/data/exploring.ts` | Current explorations |
| `src/components/sections/Exploring.tsx` | `PLACEMENT` — where each exploration sits in the field (layout, not content) |

### Archiving a project

Set `archived: true` on it in `src/data/projects.ts`. It stays in the file,
keeps its diagram in `diagrams.ts`, and simply stops rendering. Delete the line
to bring it back — nothing else needs to change, and the Work heading counts
the visible projects itself, so the copy never goes stale.

Currently archived: **Sahayak AI** and **Distributed Event Platform**.

### Recognition

A project can carry one award, rendered as a single badge under its concept
line:

```ts
award: { title: 'Google Patchamomma', placement: 'Top 100 Build', year: '2026' },
```

Keep it to one per site — a second badge turns a credential into decoration. The
same recognition is also listed in `experience.ts` under `recognition`.

### Practice profiles

`src/data/fundamentals.ts` exports `practice`, which is `undefined` by default
and renders nothing. Fill it in to add a single line under the fundamentals
lists:

```ts
export const practice = { label: 'LeetCode', handle: 'your-handle', href: 'https://leetcode.com/u/your-handle' }
```

### Adding a project

Append to `projects` in `src/data/projects.ts` and add a matching entry in
`diagrams.ts` keyed by the same `id`. The diagram takes bands top to bottom;
mark the band carrying the project's actual claim with `accent: true` and it is
drawn in vermilion. Four bands is the design; three or five will still render.

---

## Replacing a project image

Project visuals are **generated SVG diagrams** by default — sharp at any size,
about 2KB each, and always in the same visual language. To use a real
screenshot or mockup instead:

1. Put the file in `public/projects/` (e.g. `public/projects/proofaegis.png`).
2. Add an `image` field to that project in `src/data/projects.ts`:

```ts
image: {
  src: '/projects/proofaegis.png',
  alt: 'ProofAegis exception queue, showing a duplicate-invoice finding',
  width: 1600,
  height: 1000,
},
```

That is the whole change. The site renders the file instead of the diagram,
lazily, with a clip reveal, and `width`/`height` reserve the space so the page
does not shift while it loads. Remove the `image` field to go back to the
diagram.

Guidance: use 2× the display size (~1600px wide is plenty), export as WebP or
AVIF where you can, and keep every project image the same aspect ratio so the
scenes do not jump.

Other assets:

- `public/Monica_Muthukumaran_Resume.pdf` — the résumé the nav and contact
  section link to. Replace the file, keep the name.
- `public/og.png` — the 1200×630 social preview card.
- `public/favicon.svg`.

Before publishing, set the real domain in `index.html` (`canonical`, `og:url`,
`og:image`, `twitter:image`) and in the JSON-LD block — they currently point at
`monicamuthukumaran.dev`.

---

## How it is built

- **React 19 + Vite 8 + TypeScript.** Tailwind v4 is present for layout
  utilities; every colour and type value resolves back to the tokens in
  `src/styles/tokens.css`.
- **motion/react** for reveals, gestures and scroll-linked values.
- **Lenis** for smooth scrolling — lazily imported, desktop only, never on
  touch, never under reduced motion.
- **No GSAP.** It was in the original plan and was removed once the scenes were
  built: the Work section pins with CSS `position: sticky` and the scrubbed
  values come from `useScroll`, which left ScrollTrigger with nothing to do and
  50KB gzipped to pay for. See `DESIGN_SYSTEM.md` §6.
- **No Three.js, and no canvas either.** The hero originally had a Canvas 2D
  particle topology. It was deleted: the engineering section already had a
  dot-and-line network, and two of them on one page is the thing that makes a
  portfolio read as generated. The hero is typographic instead — the name is
  split into letters that lift toward the pointer.

### Performance

Critical path is about **150KB gzipped** (React 66, motion 48, app 25, CSS 11).
Lenis is a separate 5.8KB chunk fetched only when it will be used.

There is no always-on animation loop anywhere. The kinetic name runs a RAF only
while letters are still settling and stops itself once they are; looping CSS
animations are parked with `animation-play-state: paused` and released by
`useOnscreen` when their section is near the viewport. All scroll work is
transform/opacity on composited layers.

### Accessibility

One `<h1>`, no skipped heading levels, landmarks throughout, a skip link, a
focus ring that is never removed, and anchor navigation that moves focus to the
target section rather than only the viewport. The mobile menu traps focus and
closes on `Escape`. The stack graph is keyboard operable. Decorative canvas and
SVG are `aria-hidden`.

`prefers-reduced-motion` is a structural branch, not a CSS afterthought: the
pinned scenes are replaced by the flat layout, Lenis and the custom cursor are
never mounted, the exploration field becomes a static cloud, and the kinetic
name never binds a pointer listener. No content is hidden in any of those paths.

---

All project data is the author's own work. ProofAegis and Sahayak AI figures
come from synthetic datasets; no real company, invoice or patient is
represented.
