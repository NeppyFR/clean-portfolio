"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { motionSpec } from "@/content";

const { reveal, ease } = motionSpec;

type RevealProps = {
  children: ReactNode;
  /**
   * Position among adjacent siblings. Each step adds `reveal.stagger`
   * seconds, producing the cascade. Prefer this over hand-tuned `delay`.
   */
  index?: number;
  /** Extra seconds on top of the index-derived delay. */
  delay?: number;
  /** Starting offset in px; defaults to a slight upward slide. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-triggered reveal: fade + upward slide.
 *
 * Fires once, and deliberately late — the negative bottom margin in
 * `reveal.margin` means the element has to climb well into the viewport
 * before animating, so the motion happens where you're actually looking
 * rather than finishing before it scrolls into view.
 *
 * Collapses to a plain fade under prefers-reduced-motion.
 */
export function Reveal({
  children,
  index = 0,
  delay = 0,
  y = reveal.y,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const totalDelay = index * reveal.stagger + delay;

  return (
    <Tag
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: reveal.amount,
        margin: reveal.margin,
      }}
      transition={{
        duration: reduced ? 0.3 : reveal.duration,
        ease,
        delay: reduced ? 0 : totalDelay,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
