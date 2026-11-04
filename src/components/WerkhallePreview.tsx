"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "@/i18n";

/* ── Geometry ────────────────────────────────────────────────
 * One coordinate system for the whole illustration. The SVG scales to its
 * container, so these are design units, not pixels.
 */
const VB_W = 480;
const VB_H = 200;
const SPINE = 95; // shared centre line: casting, saw, packaging
const ROW_TOP = 58; // Press 1 / Furnace 1
const ROW_BOT = 132; // Press 2 / Furnace 2

/** Seconds for one full telling of the story. */
const LOOP = 15;
/** Seconds for one piece of material to travel the whole line. */
const PART_CYCLE = 7.5;
const PART_COUNT = 10;

/** Beats of the story, in seconds from the top of the loop. */
const BEAT = {
  breakdown: 5,
  detected: 5.8,
  replan: 7.4,
  gantt: 8.8,
  slide: 9.6,
  reroute: 11,
  repair: 13,
};

/** The frame shown under prefers-reduced-motion when the fault is on. */
const STILL_FAULT = 10.4;
/** ...and when it is off. */
const STILL_OK = 3;

/**
 * Waypoints for one route through the hall, as a function of which press row
 * it uses. Indices 0-4 are shared spine, so material queued at the junction
 * can be rerouted to the other row without appearing to jump.
 */
function waypoints(rowY: number): [number, number][] {
  return [
    [-14, SPINE], // 0  feed
    [18, SPINE], // 1  casting in
    [44, SPINE], // 2  casting centre
    [72, SPINE], // 3  casting out
    [92, SPINE], // 4  junction  <- the queue forms here
    [120, rowY], // 5  press in
    [140, rowY], // 6  press centre
    [170, rowY], // 7  press out
    [216, rowY], // 8  furnace in
    [240, rowY], // 9  furnace centre
    [272, rowY], // 10 furnace out
    [300, SPINE], // 11 merge
    [322, SPINE], // 12 saw centre
    [350, SPINE], // 13 saw out
    [404, SPINE], // 14 packaging
  ];
}

const SEGMENTS = 14;
/** Progress at the junction — where material backs up behind a dead press. */
const P_QUEUE = 4 / SEGMENTS;
/** Material changes form as it clears each machine. */
const P_BAR = 6 / SEGMENTS; // leaves a press as a long bar
const P_BASKET = 9 / SEGMENTS; // leaves a furnace in a basket
const P_CUT = 12 / SEGMENTS; // leaves the saw as cut bars

/**
 * Equal progress per segment rather than per unit length. The short segments
 * inside a machine therefore read as a dwell, which is what we want.
 */
function pointAt(p: number, rowY: number): [number, number] {
  const wp = waypoints(rowY);
  const clamped = Math.max(0, Math.min(0.9999, p));
  const f = clamped * SEGMENTS;
  const i = Math.floor(f);
  const k = f - i;
  const a = wp[i];
  const b = wp[i + 1];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}

/**
 * The palette is violet, ink and paper throughout — there is no red in it.
 * A fault has to read as a fault, so this one literal lives here rather than
 * becoming a global token nothing else would use.
 */
const FAULT = "#f2555a";

type Els = Record<string, SVGElement | null>;

type MachineId = "guss" | "pr1" | "pr2" | "of1" | "of2" | "sae" | "vp";

const MACHINES: {
  id: MachineId;
  x: number;
  y: number;
  w: number;
  h: number;
}[] = [
  { id: "guss", x: 26, y: 76, w: 40, h: 38 },
  { id: "pr1", x: 118, y: ROW_TOP - 20, w: 48, h: 40 },
  { id: "pr2", x: 118, y: ROW_BOT - 20, w: 48, h: 40 },
  { id: "of1", x: 214, y: ROW_TOP - 20, w: 52, h: 40 },
  { id: "of2", x: 214, y: ROW_BOT - 20, w: 52, h: 40 },
  { id: "sae", x: 302, y: 76, w: 42, h: 38 },
  { id: "vp", x: 384, y: 72, w: 48, h: 46 },
];

/**
 * An illustration of the Werkhalle demo — not the running system. Draws a
 * seven-machine extrusion line, breaks Press 2 once every loop, and shows the
 * software noticing, re-planning and rerouting around it.
 *
 * Everything that moves moves by `transform` or `opacity`, including the fault
 * itself: a red copy of Press 2 fades in over the normal body rather than the
 * body changing colour. The loop runs on one rAF driven by a ref, and stops
 * when the card leaves the viewport or the tab is hidden.
 */
export function WerkhallePreview() {
  const t = useContent().werkhalle;
  const reduced = useReducedMotion();
  const uid = useId();
  const titleId = uid + "-title";
  const descId = uid + "-desc";

  const svgRef = useRef<SVGSVGElement>(null);
  const els = useRef<Els>({});
  const reg = (k: string) => (el: SVGElement | null) => {
    els.current[k] = el;
  };

  /** Which machine name is showing. Pointer/tap only, so not per-frame. */
  const [named, setNamed] = useState<MachineId | null>(null);
  /** Reduced-motion only: which still frame is on screen. */
  const [stillFault, setStillFault] = useState(true);

  /** Seconds into the story. A ref, so the draw loop never re-renders React. */
  const clock = useRef(0);
  /** Set by the button to jump the story straight to the breakdown. */
  const jump = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    /* ---- the frame writer, shared by the loop and the still frames ---- */
    const frame = (time: number) => {
      const e = els.current;
      const tl = ((time % LOOP) + LOOP) % LOOP;
      const broken = tl >= BEAT.breakdown && tl < BEAT.repair;
      const rerouting = tl >= BEAT.reroute && tl < BEAT.repair;

      const set = (k: string, transform: string | null, opacity?: number) => {
        const el = e[k];
        if (!el) return;
        if (transform !== null) el.setAttribute("transform", transform);
        if (opacity !== undefined) el.style.opacity = String(opacity);
      };

      /* material */
      let queued = 0;
      for (let i = 0; i < PART_COUNT; i++) {
        const offset = i / PART_COUNT;
        let p = (time / PART_CYCLE + offset) % 1;
        // Alternating rows keep both presses busy while the line is healthy.
        let row = i % 2 === 0 ? ROW_TOP : ROW_BOT;

        if (row === ROW_BOT && broken && p < P_QUEUE) {
          if (rerouting) {
            // The accepted plan sends it up to Press 1 instead. It is still on
            // the shared spine at this point, so nothing jumps.
            row = ROW_TOP;
          } else {
            // Back up behind the dead press, nose to tail.
            p = P_QUEUE - queued * 0.022;
            queued += 1;
          }
        }

        const [x, y] = pointAt(p, row);
        set("part" + i, "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ")");

        const stage = p < P_BAR ? 0 : p < P_BASKET ? 1 : p < P_CUT ? 2 : 3;
        for (let s = 0; s < 4; s++) {
          const shape = e["part" + i + "s" + s];
          if (shape) shape.style.opacity = s === stage ? "1" : "0";
        }
      }

      /* the casting pot glows */
      set("gussGlow", null, 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(time * 2.4)));

      /* the press rams push */
      const ram = (phase: number) =>
        "translate(0 " + ((0.5 + 0.5 * Math.sin(phase)) * 7).toFixed(2) + ")";
      set("pr1Ram", ram(time * 3.1));
      set("pr2Ram", broken ? "translate(0 0)" : ram(time * 3.1 + 1.6));

      /* the furnaces pulse with heat */
      set("of1Glow", null, 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(time * 1.5)));
      set("of2Glow", null, 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(time * 1.5 + 2)));

      /* the saw blade spins */
      set("sawBlade", "rotate(" + ((time * 210) % 360).toFixed(1) + " 322 95)");

      /* the fault */
      const flash = broken ? 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 9)) : 0;
      set("pr2Fault", null, flash);
      set("faultTag", null, broken ? 1 : 0);

      /* chips pop in one after another */
      const chip = (at: number) => {
        if (tl < at) return { o: 0, dy: 6 };
        const k = Math.min(1, (tl - at) / 0.45);
        return { o: k, dy: 6 * (1 - k) };
      };
      const c1 = chip(BEAT.detected);
      const c2 = chip(BEAT.replan);
      set("chip1", "translate(0 " + c1.dy.toFixed(2) + ")", broken ? c1.o : 0);
      set("chip2", "translate(0 " + c2.dy.toFixed(2) + ")", broken ? c2.o : 0);

      /* the little schedule, and the job moving off the dead press */
      const g = chip(BEAT.gantt);
      set("gantt", "translate(0 " + g.dy.toFixed(2) + ")", broken ? g.o : 0);
      const slide = tl < BEAT.slide ? 0 : Math.min(1, (tl - BEAT.slide) / 0.8);
      // eased, so the bar settles rather than stopping dead
      const ease = 1 - Math.pow(1 - slide, 3);
      set(
        "ganttJob",
        "translate(" +
          (-6 * ease).toFixed(2) +
          " " +
          (-12 * ease).toFixed(2) +
          ")",
      );

      /* bundles stack up at the end, and stall while the line is down */
      const flow =
        tl < BEAT.breakdown
          ? tl
          : tl < BEAT.reroute
            ? BEAT.breakdown
            : BEAT.breakdown + (tl - BEAT.reroute);
      const bundles = Math.min(6, Math.floor(flow / 1.15));
      for (let b = 0; b < 6; b++) {
        const el = e["bundle" + b];
        if (el) el.style.opacity = b < bundles ? "1" : "0";
      }
    };

    /* ---- reduced motion: one still frame, no loop ---- */
    if (reduced) {
      frame(stillFault ? STILL_FAULT : STILL_OK);
      return;
    }

    /* ---- the loop ---- */
    let raf = 0;
    let running = false;
    let last = 0;

    const tick = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (jump.current !== null) {
        clock.current = jump.current;
        jump.current = null;
      } else {
        clock.current += dt;
      }
      frame(clock.current);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(svg);

    // A hidden tab never fires rAF anyway; this stops us holding a scheduled
    // frame across the switch.
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    frame(clock.current);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, stillFault]);

  const breakIt = () => {
    if (reduced) {
      setStillFault((v) => !v);
      return;
    }
    // Land just before the red flash, so the break is seen rather than missed.
    jump.current = BEAT.breakdown - 0.15;
  };

  const show = (id: MachineId) => () => setNamed(id);
  const hide = () => setNamed(null);

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl bg-ink">
        <svg
          ref={svgRef}
          viewBox={"0 0 " + VB_W + " " + VB_H}
          role="img"
          aria-labelledby={titleId + " " + descId}
          className="block h-auto w-full"
        >
          <title id={titleId}>{t.a11yTitle}</title>
          <desc id={descId}>{t.a11yDesc}</desc>

          {/* conveyor spine */}
          <g stroke="var(--color-ink-border)" strokeWidth="1.5" fill="none">
            <path d="M-14 95 H92" />
            <path d={"M92 95 L120 " + ROW_TOP + " H272 L300 95"} />
            <path d={"M92 95 L120 " + ROW_BOT + " H272 L300 95"} />
            <path d="M300 95 H404" />
          </g>

          {/* material */}
          {Array.from({ length: PART_COUNT }, (_, i) => (
            <g key={i} ref={reg("part" + i)}>
              {/* billet */}
              <rect
                ref={reg("part" + i + "s0")}
                x={-5}
                y={-2.6}
                width={10}
                height={5.2}
                rx={2.6}
                fill="var(--color-accent)"
              />
              {/* long bar */}
              <rect
                ref={reg("part" + i + "s1")}
                x={-12}
                y={-1.6}
                width={24}
                height={3.2}
                rx={1.6}
                fill="var(--color-ink-text)"
                opacity={0}
              />
              {/* basket */}
              <g ref={reg("part" + i + "s2")} opacity={0}>
                <rect
                  x={-8}
                  y={-6}
                  width={16}
                  height={12}
                  rx={2}
                  fill="none"
                  stroke="var(--color-ink-text)"
                  strokeWidth="1.3"
                />
                <path
                  d="M-8 -2 H8 M-8 2 H8"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1"
                />
              </g>
              {/* cut bars */}
              <g ref={reg("part" + i + "s3")} opacity={0}>
                <rect
                  x={-9}
                  y={-3}
                  width={8}
                  height={2.6}
                  rx={1.3}
                  fill="var(--color-ink-text)"
                />
                <rect
                  x={1}
                  y={-3}
                  width={8}
                  height={2.6}
                  rx={1.3}
                  fill="var(--color-ink-text)"
                />
                <rect
                  x={-9}
                  y={1}
                  width={8}
                  height={2.6}
                  rx={1.3}
                  fill="var(--color-ink-text)"
                />
                <rect
                  x={1}
                  y={1}
                  width={8}
                  height={2.6}
                  rx={1.3}
                  fill="var(--color-ink-text)"
                />
              </g>
            </g>
          ))}

          {/* machines */}
          {MACHINES.map((m) => (
            <g
              key={m.id}
              onPointerEnter={show(m.id)}
              onPointerLeave={hide}
              onClick={show(m.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={m.x}
                y={m.y}
                width={m.w}
                height={m.h}
                rx={8}
                fill="var(--color-ink-soft)"
                stroke="var(--color-ink-border)"
                strokeWidth="1.4"
              />
              {/* a generous invisible hit area, for fingers */}
              <rect
                x={m.x - 6}
                y={m.y - 6}
                width={m.w + 12}
                height={m.h + 12}
                fill="transparent"
              />
            </g>
          ))}

          {/* casting pot glow */}
          <ellipse
            ref={reg("gussGlow")}
            cx={46}
            cy={95}
            rx={13}
            ry={10}
            fill="var(--color-accent)"
            style={{ pointerEvents: "none" }}
          />

          {/* press rams */}
          <g ref={reg("pr1Ram")} style={{ pointerEvents: "none" }}>
            <rect
              x={132}
              y={ROW_TOP - 16}
              width={18}
              height={12}
              rx={3}
              fill="var(--color-ink-muted)"
            />
          </g>
          <g ref={reg("pr2Ram")} style={{ pointerEvents: "none" }}>
            <rect
              x={132}
              y={ROW_BOT - 16}
              width={18}
              height={12}
              rx={3}
              fill="var(--color-ink-muted)"
            />
          </g>

          {/* furnace heat */}
          <rect
            ref={reg("of1Glow")}
            x={222}
            y={ROW_TOP - 12}
            width={36}
            height={24}
            rx={5}
            fill="var(--color-accent-deep)"
            style={{ pointerEvents: "none" }}
          />
          <rect
            ref={reg("of2Glow")}
            x={222}
            y={ROW_BOT - 12}
            width={36}
            height={24}
            rx={5}
            fill="var(--color-accent-deep)"
            style={{ pointerEvents: "none" }}
          />

          {/* saw */}
          <g ref={reg("sawBlade")} style={{ pointerEvents: "none" }}>
            <circle
              cx={322}
              cy={95}
              r={11}
              fill="none"
              stroke="var(--color-ink-text)"
              strokeWidth="1.4"
            />
            <path
              d="M322 84 V106 M311 95 H333 M314 87 L330 103 M330 87 L314 103"
              stroke="var(--color-ink-muted)"
              strokeWidth="1"
            />
          </g>

          {/* finished bundles stacking at packaging */}
          {Array.from({ length: 6 }, (_, b) => (
            <g
              key={b}
              ref={reg("bundle" + b)}
              opacity={0}
              style={{ pointerEvents: "none" }}
            >
              <rect
                x={440}
                y={110 - b * 9}
                width={24}
                height={7}
                rx={2}
                fill="var(--color-ink-soft)"
                stroke="var(--color-ink-border)"
                strokeWidth="1"
              />
              <path
                d={"M448 " + (110 - b * 9) + " v7 M456 " + (110 - b * 9) + " v7"}
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* the fault, as a red copy fading in over Press 2 */}
          <g
            ref={reg("pr2Fault")}
            opacity={0}
            style={{ pointerEvents: "none" }}
          >
            <rect
              x={118}
              y={ROW_BOT - 20}
              width={48}
              height={40}
              rx={8}
              fill={FAULT}
              opacity={0.18}
            />
            <rect
              x={118}
              y={ROW_BOT - 20}
              width={48}
              height={40}
              rx={8}
              fill="none"
              stroke={FAULT}
              strokeWidth="2.2"
            />
          </g>
          <g
            ref={reg("faultTag")}
            opacity={0}
            style={{ pointerEvents: "none" }}
          >
            {/* A ghost pill rather than a solid red slab — it still reads as
                an alarm next to the violet palette, without shouting. */}
            <rect
              x={114}
              y={ROW_BOT + 22}
              width={56}
              height={15}
              rx={7.5}
              fill={FAULT}
              opacity={0.14}
            />
            <rect
              x={114}
              y={ROW_BOT + 22}
              width={56}
              height={15}
              rx={7.5}
              fill="none"
              stroke={FAULT}
              strokeWidth="1"
              opacity={0.75}
            />
            <text
              x={142}
              y={ROW_BOT + 32.5}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="0.7"
              fill={FAULT}
              style={{ textTransform: "uppercase" }}
            >
              {t.faultTag}
            </text>
          </g>

          {/* chips */}
          <g ref={reg("chip1")} opacity={0} style={{ pointerEvents: "none" }}>
            <rect
              x={12}
              y={176}
              width={92}
              height={17}
              rx={8.5}
              fill="var(--color-ink-soft)"
              stroke="var(--color-ink-border)"
              strokeWidth="1"
            />
            <text
              x={58}
              y={187.5}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="0.2"
              fill="var(--color-ink-text)"
            >
              {t.chipDetected}
            </text>
          </g>
          <g ref={reg("chip2")} opacity={0} style={{ pointerEvents: "none" }}>
            <rect
              x={112}
              y={176}
              width={100}
              height={17}
              rx={8.5}
              fill="var(--color-ink-soft)"
              stroke="var(--color-ink-border)"
              strokeWidth="1"
            />
            <text
              x={162}
              y={187.5}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="0.2"
              fill="var(--color-ink-text)"
            >
              {t.chipReplan}
            </text>
          </g>

          {/* the little schedule */}
          <g ref={reg("gantt")} opacity={0} style={{ pointerEvents: "none" }}>
            <rect
              x={344}
              y={10}
              width={124}
              height={44}
              rx={8}
              fill="var(--color-ink-soft)"
              stroke="var(--color-ink-border)"
              strokeWidth="1"
            />
            <text
              x={354}
              y={23}
              fontSize="7.5"
              letterSpacing="1.2"
              fill="var(--color-ink-muted)"
              style={{ textTransform: "uppercase" }}
            >
              {t.scheduleLabel}
            </text>
            <text x={354} y={36} fontSize="7" fill="var(--color-ink-muted)">
              P1
            </text>
            <text x={354} y={48} fontSize="7" fill="var(--color-ink-muted)">
              P2
            </text>
            <rect
              x={368}
              y={31}
              width={28}
              height={6}
              rx={3}
              fill="var(--color-ink-border)"
            />
            <rect
              x={400}
              y={31}
              width={20}
              height={6}
              rx={3}
              fill="var(--color-ink-border)"
            />
            <rect
              x={368}
              y={43}
              width={24}
              height={6}
              rx={3}
              fill="var(--color-ink-border)"
            />
            {/* the job that moves up a row */}
            <g ref={reg("ganttJob")}>
              <rect
                x={424}
                y={43}
                width={32}
                height={6}
                rx={3}
                fill="var(--color-accent)"
              />
            </g>
          </g>

          {/* machine name on hover / tap */}
          {named &&
            (() => {
              const m = MACHINES.find((x) => x.id === named);
              if (!m) return null;
              const cx = m.x + m.w / 2;
              const above = m.y > 70;
              const ty = above ? m.y - 9 : m.y + m.h + 15;
              return (
                <text
                  x={Math.max(34, Math.min(VB_W - 34, cx))}
                  y={ty}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--color-ink-text)"
                  style={{ pointerEvents: "none" }}
                >
                  {t.machines[named]}
                </text>
              );
            })()}

          {/* honesty label */}
          <text
            x={12}
            y={21}
            fontSize="7.5"
            letterSpacing="1.4"
            fill="var(--color-ink-muted)"
            opacity={0.8}
            style={{ pointerEvents: "none", textTransform: "uppercase" }}
          >
            {t.illustration}
          </text>
        </svg>
      </div>

      <button
        type="button"
        onClick={breakIt}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-paper-border px-4 py-2 text-sm font-medium text-paper-muted transition-colors duration-300 hover:border-ink/30 hover:text-ink"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: FAULT }}
        />
        {reduced && stillFault ? t.buttonRepair : t.button}
      </button>
    </div>
  );
}
