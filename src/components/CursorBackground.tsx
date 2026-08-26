"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ShaderBackground } from "./ShaderBackground";

/**
 * Interactive hero background.
 *
 * Default ("dots"): a drifting dot lattice over a soft spotlight that trails
 * the cursor. Dots near the cursor are pushed outward, grow, and brighten.
 * Physics constants are carried over from singh-angad.ch so the feel matches.
 *
 * Colour is driven by scroll: violet at the top of the document, electric
 * blue at the bottom. Every layer — the base wash, the cursor glow and the
 * dots — reads the same scroll value, so nothing drifts out of step.
 *
 * Flag ("shader"): a WebGL fbm-noise plane lit by the cursor, on the same ramp.
 *
 * Touch devices and prefers-reduced-motion get a static animated gradient.
 */

const SPACING = 34; // px between lattice points
const REPEL_RADIUS = 170; // px of cursor influence
const REPEL_DISTANCE = 26; // max px a dot is pushed
const LERP = 0.12; // cursor easing — lower trails more
const GLOW_RADIUS = 260;
const DOT_BASE_ALPHA = 0.16;
const DOT_BASE_RADIUS = 1;

type RGB = [number, number, number];

/* ── Scroll colour ramp ──────────────────────────────────────
 * Linear RGB interpolation between the two endpoints.
 *   deep  (large gradient layers + cursor glow): #7c3aed → #1d4ed8
 *   light (dots and bright accents):             #a371f7 → #22d3ee
 */
const DEEP: [RGB, RGB] = [
  [124, 58, 237],
  [29, 78, 216],
];
const LIGHT: [RGB, RGB] = [
  [163, 113, 247],
  [34, 211, 238],
];

const mix = ([r1, g1, b1]: RGB, [r2, g2, b2]: RGB, t: number): RGB => [
  Math.round(r1 + (r2 - r1) * t),
  Math.round(g1 + (g2 - g1) * t),
  Math.round(b1 + (b2 - b1) * t),
];

export const deepAt = (t: number): RGB => mix(DEEP[0], DEEP[1], t);
export const lightAt = (t: number): RGB => mix(LIGHT[0], LIGHT[1], t);

const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`;

/** 0 at the top of the document, 1 when fully scrolled. */
export function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/** Base wash, rebuilt from the ramp at the current scroll position. */
const washFor = (t: number) =>
  `radial-gradient(900px 520px at 18% 8%, ${rgba(deepAt(t), 0.26)}, transparent 60%), ` +
  `radial-gradient(780px 480px at 88% 4%, ${rgba(lightAt(t), 0.14)}, transparent 55%), ` +
  `radial-gradient(700px 700px at 60% 90%, ${rgba(lightAt(t), 0.12)}, transparent 60%)`;

type Dot = { ox: number; oy: number; phase: number };

export type CursorBackgroundProps = {
  /** "dots" (default) or "shader" — see file header. */
  variant?: "dots" | "shader";
  className?: string;
};

export function CursorBackground({
  variant = "dots",
  className = "",
}: CursorBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  /** Single source of truth for scroll position — a ref, never state, so
   *  scrolling never re-renders the tree. */
  const scrollRef = useRef(0);
  const reduced = useReducedMotion();

  /* ── Scroll ramp ──────────────────────────────────────────
   * Writes the colour straight to the DOM node. Runs regardless of
   * variant/reduced-motion, because the base wash is always visible.
   */
  useEffect(() => {
    const update = () => {
      const t = scrollProgress();
      scrollRef.current = t;
      const wash = washRef.current;
      if (wash) wash.style.background = washFor(t);
    };

    update(); // correct on first paint
    window.addEventListener("scroll", update, { passive: true });
    // scrollHeight - innerHeight is the denominator; a resize changes it,
    // so without this the ramp desyncs from the actual scroll position.
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── Dot field ────────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || variant === "shader") return;

    // Treat coarse pointers (touch) as "no cursor to react to".
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Off-screen sentinel: no glow, no repulsion until the mouse arrives.
    const OFF = -9999;
    const cursor = { x: OFF, y: OFF, tx: OFF, ty: OFF };
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    const start = performance.now();

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            ox: i * SPACING,
            oy: j * SPACING,
            // deterministic per-dot offset so the drift isn't in lockstep
            phase: (i * 7 + j * 13) % 100,
          });
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      cursor.tx = e.clientX - rect.left;
      cursor.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      cursor.tx = OFF;
      cursor.ty = OFF;
    };

    const frame = () => {
      cursor.x += (cursor.tx - cursor.x) * LERP;
      cursor.y += (cursor.ty - cursor.y) * LERP;

      const time = (performance.now() - start) / 1000;
      // Read the shared scroll value inside the existing loop — no second
      // animation loop, and the dots stay in step with the wash.
      const t = scrollRef.current;
      const glowRGB = deepAt(t);
      const dotRGB = lightAt(t);

      ctx.clearRect(0, 0, width, height);

      // Spotlight trailing the cursor
      if (cursor.tx > OFF + 1000) {
        const g = ctx.createRadialGradient(
          cursor.x,
          cursor.y,
          0,
          cursor.x,
          cursor.y,
          GLOW_RADIUS,
        );
        g.addColorStop(0, rgba(glowRGB, 0.2));
        g.addColorStop(0.5, rgba(glowRGB, 0.07));
        g.addColorStop(1, rgba(glowRGB, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      for (const d of dots) {
        // gentle ambient drift, independent of the cursor
        const driftX = Math.sin(time * 0.6 + d.phase) * 1.4;
        const driftY = Math.cos(time * 0.5 + d.phase * 1.3) * 1.4;
        const baseX = d.ox + driftX;
        const baseY = d.oy + driftY;

        const dx = baseX - cursor.x;
        const dy = baseY - cursor.y;
        const dist = Math.hypot(dx, dy);

        let x = baseX;
        let y = baseY;
        let r = DOT_BASE_RADIUS;
        let alpha = DOT_BASE_ALPHA;

        if (dist < REPEL_RADIUS) {
          const f = 1 - dist / REPEL_RADIUS; // 0 at edge → 1 at cursor
          const angle = Math.atan2(dy, dx);
          x = baseX + Math.cos(angle) * f * REPEL_DISTANCE;
          y = baseY + Math.sin(angle) * f * REPEL_DISTANCE;
          r = DOT_BASE_RADIUS + f * 2.6;
          alpha = DOT_BASE_ALPHA + f * 0.75;
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(dotRGB, alpha);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(frame);
    };

    layout();

    // Only burn frames while the hero is actually on screen.
    let running = false;
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { threshold: 0 },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, variant]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base wash — always present, and the element the scroll ramp writes
          its colour to. Keeps the hero from being flat black and guarantees a
          sane look before/without the interactive layer. */}
      <div
        ref={washRef}
        className={
          reduced
            ? "absolute inset-0 gradient-fallback"
            : "absolute inset-0 gradient-fallback opacity-70"
        }
        style={reduced ? { animation: "none" } : undefined}
      />

      {!reduced && variant === "shader" && (
        <ShaderBackground scrollRef={scrollRef} />
      )}
      {!reduced && variant === "dots" && (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}

      {/* Vignette so the headline always has contrast to sit on */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 30%, rgba(8,8,10,0.55) 100%)",
        }}
      />
      {/* Fade into the light section below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}
