"use client";

import { motion } from "framer-motion";
import { useReducedMotionAfterMount } from "@/lib/useReducedMotionAfterMount";
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
  /** How much must be in view before firing; defaults to `reveal.amount`. */
  amount?: number | "some";
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
  amount = reveal.amount,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotionAfterMount();
  const Tag = motion[as];
  const totalDelay = index * reveal.stagger + delay;

  return (
    <Tag
      // Framer reads `initial` once, on the render that has to match the server,
      // and a value left out of the target falls back to `initial`. So the slide
      // stays in both, and reduced motion zeroes it instantly instead.
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount,
        margin: reveal.margin,
      }}
      transition={
        reduced
          ? { duration: 0.3, ease, y: { duration: 0 } }
          : { duration: reveal.duration, ease, delay: totalDelay }
      }
      className={className}
    >
      {children}
    </Tag>
  );
}
