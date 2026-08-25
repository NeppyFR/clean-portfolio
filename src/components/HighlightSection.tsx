"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { highlight, motionSpec } from "@/content";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon } from "./Icons";

/** Floating stack card with a subtle pointer-tracked tilt. */
function TiltCard({
  title,
  meta,
  isCta,
  href,
  index,
}: {
  title: string;
  meta: string;
  isCta?: boolean;
  href?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -ny * 9, ry: nx * 9 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  const Wrapper = href ? "a" : "div";

  return (
    <Reveal delay={index * 0.09}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{ transformPerspective: 900 }}
        className="h-full"
      >
        <Wrapper
          {...(href ? { href } : {})}
          className={`flex h-full flex-col justify-between rounded-3xl border p-6 shadow-[0_18px_50px_-30px_rgba(16,16,24,0.45)] transition-shadow duration-500 hover:shadow-[0_26px_60px_-28px_rgba(16,16,24,0.5)] ${
            isCta
              ? "border-transparent bg-ink text-white"
              : "border-paper-border bg-paper-card text-ink"
          }`}
        >
          <span
            className={`text-xs uppercase tracking-[0.16em] ${
              isCta ? "text-white/55" : "text-paper-muted"
            }`}
          >
            {meta}
          </span>
          <span className="mt-10 flex items-center justify-between gap-3 text-xl font-semibold tracking-tight">
            {title}
            {isCta && <ArrowUpRightIcon width={20} height={20} />}
          </span>
        </Wrapper>
      </motion.div>
    </Reveal>
  );
}

export function HighlightSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-paper px-6 py-28 text-ink sm:px-8 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-20">
          {/* Heading, bottom-left */}
          <div>
            <Reveal>
              <h2 className="max-w-lg text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                {highlight.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-muted">
                {highlight.sub}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={highlight.button.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  {highlight.button.label}
                  <ArrowUpRightIcon
                    width={16}
                    height={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <AvailabilityToggle />
              </div>
            </Reveal>
          </div>

          {/* Floating cards */}
          <motion.div
            animate={reduced ? undefined : { y: [0, -8, 0] }}
            transition={
              reduced
                ? undefined
                : {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="grid grid-cols-2 gap-4 sm:gap-5"
          >
            {highlight.cards.map((c, i) => (
              <TiltCard
                key={c.title}
                title={c.title}
                meta={c.meta}
                isCta={"isCta" in c ? c.isCta : undefined}
                href={"href" in c ? c.href : undefined}
                index={i}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Small pill toggle, matching the reference's control next to the CTA. */
function AvailabilityToggle() {
  const [on, setOn] = useState(true);
  const { ease } = motionSpec;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="inline-flex items-center gap-3 rounded-full border border-paper-border bg-paper-card px-4 py-2.5 text-sm text-paper-muted transition-colors duration-300 hover:border-ink/20"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
          on ? "bg-ink" : "bg-paper-border"
        }`}
      >
        <motion.span
          animate={{ x: on ? 17 : 3 }}
          transition={{ duration: 0.28, ease }}
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow"
        />
      </span>
      <span className={on ? "text-ink" : undefined}>
        {on ? "Open to work" : "Heads-down"}
      </span>
    </button>
  );
}
