"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "@/i18n";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon, PauseIcon, PlayIcon } from "./Icons";

export function FeatureSection({
  /** Server-rendered slot — this component is a client component, so the
   *  market card is fetched on the server and passed in from page.tsx. */
  sideCard,
}: {
  sideCard: ReactNode;
}) {
  const feature = useContent().feature;

  return (
    <section className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36">
      <div className="mx-auto max-w-7xl">
        {/* Two-tone heading: solid black clause, gray continuation */}
        <Reveal>
          <h2 className="max-w-4xl text-balance text-[clamp(1.6rem,3.4vw,2.75rem)] font-semibold leading-[1.22] tracking-[-0.025em]">
            <span className="text-ink">{feature.headingStrong}</span>{" "}
            <span className="text-black/25">{feature.headingMuted}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-7">
          <Reveal>
            <MediaCard />
          </Reveal>
          <Reveal index={1}>{sideCard}</Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Dark media card with circular play button ─────────────── */

function MediaCard() {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const media = useContent().feature.media;
  const { videoSrc, title, caption, href, linkLabel, playLabel, pauseLabel } =
    media;

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    const v = videoRef.current;
    if (v) {
      if (next) void v.play().catch(() => setPlaying(false));
      else v.pause();
    }
  };

  return (
    <div className="relative h-full min-h-[380px] overflow-hidden rounded-[2rem] bg-ink lg:min-h-[460px]">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      ) : (
        // No video asset yet — a live stand-in so play/pause is real.
        <TrafficPreview playing={playing} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="group absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
      >
        <span className="absolute inset-0 rounded-full border border-white/25 transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute inset-[10px] rounded-full border border-white/15 transition-transform duration-500 group-hover:scale-105" />
        <span className="relative text-white/90 transition-transform duration-300 group-hover:scale-110">
          {playing ? (
            <PauseIcon width={22} height={22} />
          ) : (
            <PlayIcon width={22} height={22} className="ml-0.5" />
          )}
        </span>
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-4 p-7">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/55">
            {caption}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white"
        >
          {linkLabel}
          <ArrowUpRightIcon width={15} height={15} />
        </a>
      </div>
    </div>
  );
}

/**
 * Canvas stand-in for the Traffic Mesh demo: agents crossing a lattice,
 * slowing near the intersection instead of stopping. Purely decorative —
 * replace by setting `feature.media.videoSrc` in content.ts.
 */
function TrafficPreview({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LANES = 5;
    type Car = { lane: number; pos: number; speed: number; horiz: boolean };
    const cars: Car[] = [];
    for (let i = 0; i < 34; i++) {
      cars.push({
        lane: i % LANES,
        pos: (i * 37) % 100,
        speed: 0.16 + ((i * 13) % 9) / 42,
        horiz: i % 2 === 0,
      });
    }

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // lattice
      ctx.strokeStyle = "rgba(163,113,247,0.13)";
      ctx.lineWidth = 1;
      for (let i = 0; i < LANES; i++) {
        const y = (h / LANES) * (i + 0.5);
        const x = (w / LANES) * (i + 0.5);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (const c of cars) {
        if (playingRef.current) {
          c.pos = (c.pos + c.speed) % 100;
        }
        const t = c.pos / 100;
        const laneY = (h / LANES) * (c.lane + 0.5);
        const laneX = (w / LANES) * (c.lane + 0.5);
        const x = c.horiz ? t * w : laneX;
        const y = c.horiz ? laneY : t * h;

        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = c.horiz
          ? "rgba(163,113,247,0.85)"
          : "rgba(34,211,238,0.7)";
        ctx.fill();

        // short motion trail
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(c.horiz ? x - 16 : x, c.horiz ? y : y - 16);
        ctx.strokeStyle = c.horiz
          ? "rgba(163,113,247,0.18)"
          : "rgba(34,211,238,0.15)";
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    resize();

    // Don't animate while the card is off screen.
    let running = false;
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
