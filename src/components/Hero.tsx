"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { CursorBackground } from "./CursorBackground";
import { motionSpec, socials } from "@/content";
import { useContent } from "@/i18n";
import { iconMap } from "./Icons";

/* ── Entrance timing ──────────────────────────────────────────
 * Sequence, all measured from the moment the headline starts:
 *   0.00s  headline line 1  (each line +0.10s after the last)
 *   0.20s  navbar drops in            → see Navbar.tsx
 *   0.75s  status card scales/fades in
 *   1.05s  giant wordmark fades in    (slowest, 1.2s)
 */

const { ease, line, staggerChildren } = motionSpec;

const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren: 0 },
  },
};

const headlineLine: Variants = {
  hidden: {
    opacity: 0,
    y: line.y, // -24px — starts above its resting place
    filter: `blur(${line.blur}px)`,
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: line.duration, ease },
  },
};

/** prefers-reduced-motion: no travel, no blur, no stagger — just a fade. */
const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export function Hero() {
  const t = useContent();
  const reduced = useReducedMotion();

  // Headline parallax — drifts a few px *opposite* the cursor for depth.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });
  const parallaxX = useTransform(sx, (v) => v * -14);
  const parallaxY = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      // normalise to -0.5..0.5 around viewport centre
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  const container = reduced ? reducedFade : headlineContainer;
  const child = reduced ? reducedFade : headlineLine;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      <CursorBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-32 pb-40 sm:px-8 lg:pt-44">
        <div className="flex flex-1 flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-16">
          {/* ── Headline ─────────────────────────────────── */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            style={reduced ? undefined : { x: parallaxX, y: parallaxY }}
            // Sized so each line fits on one row in BOTH languages — German
            // runs ~25% longer, and a wrapped line would turn the 5-step
            // stagger into 9 visual rows.
            className="max-w-3xl text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-text"
          >
            {t.heroLines.map((text, i) => (
              <motion.span
                key={i}
                variants={child}
                className="block will-change-transform"
              >
                {text}
              </motion.span>
            ))}
          </motion.h1>

          {/* ── Status card ──────────────────────────────── */}
          <motion.aside
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            transition={
              reduced
                ? { duration: 0.35, delay: 0.1 }
                : { duration: 0.8, ease, delay: motionSpec.statusCardDelay }
            }
            className="w-full max-w-sm shrink-0 rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md lg:mt-4 lg:max-w-xs xl:max-w-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                {t.heroStatus.label}
              </span>
            </div>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-text/85">
              {t.heroStatus.text}
            </p>
          </motion.aside>
        </div>

        {/* ── Socials, bottom-left ───────────────────────── */}
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: reduced ? 0.2 : 0.95 }}
          className="mt-16 flex items-center gap-3"
        >
          {socials.map((s) => {
            const Icon = iconMap[s.icon];
            const missing = s.href.startsWith("{{");
            return (
              <li key={s.label}>
                <a
                  href={missing ? undefined : s.href}
                  aria-label={s.label}
                  aria-disabled={missing || undefined}
                  title={missing ? `${s.label} — link not set yet` : s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors duration-300 ${
                    missing
                      ? "cursor-not-allowed opacity-40"
                      : "hover:border-white/25 hover:bg-white/5 hover:text-ink-text"
                  }`}
                >
                  <Icon />
                </a>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* ── Giant faint wordmark, fades in last ──────────── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduced ? 0.4 : motionSpec.wordmarkDuration,
          ease,
          delay: reduced ? 0.25 : motionSpec.wordmarkDelay,
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none overflow-hidden"
      >
        <span className="block translate-y-[18%] whitespace-nowrap text-center text-[22vw] font-bold leading-none tracking-[-0.05em] text-white/[0.055]">
          {t.site.wordmark}
        </span>
      </motion.div>
    </section>
  );
}
