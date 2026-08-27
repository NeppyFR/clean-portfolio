# CLAUDE.md

Personal portfolio for **Angad Singh** — Application Developer near Zurich.
Dark hero → light sections, cursor-reactive canvas background, EN/DE.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Framer Motion.

## Repos

- `origin` → **https://github.com/NeppyFR/clean-portfolio** (public) — the live one.
- `NeppyFR/shan-inspiration` — old, now **private**, superseded. Don't push there.
- `NeppyFR/portfolio` — **the current live singh-angad.ch** (Vite SPA, GitHub Pages).
  **Never push this project into it.** Its JS bundle was the source for the bio,
  projects, skills and palette used here.

Commits use the noreply author `179568295+NeppyFR@users.noreply.github.com`
(repo-local config) to keep the real address out of public metadata.

## Content

**All copy lives in `src/content.ts`.** No component holds user-visible strings.

Two dictionaries, `en` and `de`, typed `de: typeof en` — **a missing German key
is a compile error**, not a silent English string. Language-invariant data
(links, tech names, `EMAIL`, `motionSpec`) is defined once outside them.
Components read copy via `useContent()` from `src/i18n.tsx`.

### German rules

1. **Swiss orthography: `ss`, never `ß`.** `fliessend`, `Stadtstrassen`. The
   site is Zurich-based; Switzerland abolished `ß`.
2. **German runs ~25% longer than English.** This has broken layout four times
   (hero headline wrapping, nav labels wrapping, CTA overflowing the compact
   navbar). **Any new copy must be checked in DE, not just EN** — especially
   anything in a fixed-width or single-line container.

## Gotchas that cost real time

- **Stop the dev server before `npm run build`.** Running both against `.next`
  corrupts it and throws `Could not find the module ... in the React Client
  Manifest` / `__webpack_modules__[moduleId] is not a function`. Fix:
  `rm -rf .next` and restart. Not a code bug.
- **The preview tab runs backgrounded** (`document.hidden === true`), so
  `requestAnimationFrame` never fires. Consequences when verifying:
  - Framer entrance/`whileInView` animations never advance — elements sit at
    their `initial` state. Not a bug.
  - `scroll` events do not dispatch; `scrollTo` with smooth behaviour stalls.
    Use `behavior:'instant'` (or clear `scroll-behavior`) then
    `window.dispatchEvent(new Event('scroll'))`.
  - Animated values (e.g. the navbar's `maxWidth`) never reach their target,
    so **measuring them tests the wrong case**. Force the value
    (`el.style.maxWidth = '840px'`) before measuring.
  - Screenshots time out while infinite CSS animations run. Cancel only
    `ping` / `gentle-drift` via `getAnimations()`, never all — cancelling all
    freezes the entrance mid-flight.
- **`.claude/launch.json` resolves from the session root** (`C:\claude projects`),
  not this folder. Use `"runtimeExecutable": "cmd"` with
  `["/c","npm.cmd","--prefix","shan inspiration","run","dev"]` — plain `npm`
  fails with `'C:\Program' is not recognized`. Port 5180 belongs to another
  chat's server; use `autoPort`.

## Architecture notes

- **Market card ("Darwins Market")** — `MarketCard.tsx` is a **server**
  component that fetches BTC 5m candles; `MarketCardView.tsx` is a **client**
  component that renders them and reads `useContent()` for language. This split
  exists because language is client state but the fetch must stay server-side.
  `fetch(..., { next: { revalidate: 300 } })` caps upstream traffic at **one
  request per 5 minutes for the whole site**, regardless of visitors — that was
  an explicit requirement (no rate limiting, no cost). **Do not move the fetch
  client-side.** Sources: Binance → Coinbase → Kraken, free and keyless, tried
  in order; all failures swallowed so a bad upstream can't fail the build.
  Types live in `lib/market-types.ts` so the client half avoids the
  `server-only` module.
- **Hero background** (`CursorBackground.tsx`) — dot lattice + cursor spotlight.
  Scroll progress is held in a **ref** and written straight to the DOM, never
  state (state would re-render on every scroll). The canvas reads that same ref
  **inside its existing draw loop** — do not add a second animation loop.
  Colour ramps violet→blue with scroll: deep `#7c3aed`→`#1d4ed8`,
  light `#a371f7`→`#22d3ee`. Both canvases pause via `IntersectionObserver`.
- **Motion tuning is centralised in `motionSpec`** (`content.ts`): hero stagger
  (0.7s, 0.1s apart, −24px, blur 4) and `reveal` (0.75s, 44px, 0.14s cascade,
  `-22%` bottom margin so reveals fire late enough to be seen). `Reveal` takes
  an `index` prop for the cascade — don't hand-tune `delay` at call sites.
- Framer Motion **cannot animate `maxWidth` from `none`** — animated properties
  need an explicit numeric `initial` or the transition silently does nothing.

## Open items

- **Vercel deploy not done.** Import `clean-portfolio` at vercel.com/new; ISR
  works natively there. Can't be done from the CLI here (no auth).
  Note this is a Next.js app — it will *not* drop onto GitHub Pages like the
  current Vite site.
- **Hero entrance + scroll-reveal timing have never been verified running** —
  see the backgrounded-tab gotcha. Needs a human eye.
- `gh` token lacks `delete_repo`, so repos can only be made private, not deleted.
