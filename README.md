# Angad Singh — Portfolio

A dark→light scrolling landing page. Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, with a cursor-reactive canvas hero.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where to edit content

**Everything lives in [`src/content.ts`](src/content.ts).** No component needs touching to change copy.

| Export | Controls |
| --- | --- |
| `site` | Name, initials, role, location, the giant hero wordmark |
| `heroLines` | Hero headline — **one array entry per animated line** |
| `heroStatus` | The small "Currently" card on the right of the hero |
| `nav`, `cta` | Navbar links and the CTA button |
| `socials` | Icons in the hero and footer |
| `highlight` | Light section heading, button, and the four floating stack cards |
| `feature` | Two-tone heading, media card, testimonial |
| `about` | Bio paragraphs and the big stat numbers |
| `projects`, `skills`, `languages`, `education` | Pulled from singh-angad.ch |
| `motionSpec` | All hero entrance timing (see below) |

Content was extracted from the live site's JS bundle, so the bio, skills, languages,
projects, and education text are verbatim from https://singh-angad.ch.

## Hero entrance timing

Defined once in `motionSpec` and consumed by `Hero.tsx` / `Navbar.tsx`:

```
0.00s  headline line 1   ┐  translateY -24px → 0
0.10s  headline line 2   │  opacity 0 → 1
0.20s  headline line 3   ├─ blur(4px) → blur(0)
0.30s  headline line 4   │  0.7s each, ease [0.22, 1, 0.36, 1]
0.40s  headline line 5   ┘
0.20s  navbar drops in from the top
0.75s  status card scales + fades in
1.05s  giant wordmark fades in (1.2s — slowest, lands last)
```

Implemented with a parent `variants` container using `staggerChildren: 0.1`.
Adding or removing a line in `heroLines` automatically extends the cascade.

## The cursor-reactive background

`src/components/CursorBackground.tsx` — a dot lattice over a soft spotlight that
trails the cursor. Dots within 170px are pushed outward, grow, and brighten;
the whole field also drifts gently on its own. The headline parallaxes a few
pixels *opposite* the cursor for depth.

The physics constants (34px spacing, 170px radius, 0.12 lerp, 26px repel) are
carried over from the existing singh-angad.ch background so the feel matches.

**Shader variant** — a WebGL fbm-noise plane is included behind a flag:

```tsx
<CursorBackground variant="shader" />   // in src/components/Hero.tsx
```

Both canvases pause via `IntersectionObserver` when scrolled off screen.

## Accessibility & responsiveness

- `prefers-reduced-motion`: the cursor field is replaced by a static gradient,
  per-line staggers collapse to simple fades, tilt/float/parallax are disabled,
  and a global CSS rule neutralises any remaining transitions.
- Touch devices (`pointer: coarse`) get the same static gradient — no pointer to react to.
- Desktop-first layout collapsing to a single column; nav links fold away below `md`
  leaving the logo and CTA.
- Verified: no horizontal overflow at 375px or 1134px.

## Project structure

```
src/
  content.ts                 ← all copy + motion constants
  app/
    layout.tsx  page.tsx  globals.css
  components/
    Navbar.tsx               floating pill, compacts on scroll
    Hero.tsx                 staggered headline, status card, wordmark
    CursorBackground.tsx     dot field + spotlight  (default)
    ShaderBackground.tsx     WebGL variant          (behind flag)
    HighlightSection.tsx     floating tilt cards
    FeatureSection.tsx       two-tone heading, media card, testimonial
    ProjectsSection.tsx
    StatsSection.tsx
    SkillsSection.tsx
    Footer.tsx
    Reveal.tsx               scroll reveal (0.6s, fires at 20% in view)
    Icons.tsx
```

## Outstanding placeholders

Search for `{{PLACEHOLDER` in `src/content.ts`:

1. **LinkedIn URL** — not listed on singh-angad.ch. The icon renders disabled until set.
2. **Testimonial** — no recommendation exists on the site. The card currently renders
   an explicit "Placeholder" state rather than invented praise. Fill in
   `feature.testimonial` and it renders normally.
3. **Contact email** — deliberately not published. The `Let's talk` CTA scrolls to
   the contact footer instead, and the email icon renders disabled. Set
   `socials[1].href` to `mailto:your@address` (and optionally `cta.href`) when you've
   decided which address should be public.
4. **Featured project video** — `feature.media.videoSrc` is `null`, so a live canvas
   stand-in of the Traffic Mesh simulation is rendered instead. Drop an `.mp4` in
   `/public` and point `videoSrc` at it to use real footage.
5. **Years of experience** — not stated on the site, so the stats use three real
   numbers instead: 2+ projects, 12 technologies, 6 languages.
