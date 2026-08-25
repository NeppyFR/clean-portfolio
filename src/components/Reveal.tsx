"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { motionSpec } from "@/content";

type RevealProps = {
  children: ReactNode;
  /** seconds to wait after the element enters view */
  delay?: number;
  /** starting offset in px; defaults to a slight upward slide */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-triggered reveal: fade + slight upward slide, 0.6s ease-out,
 * fired once when ~20% of the element is in view.
 * Collapses to a plain fade under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduced ? 0.3 : 0.6,
        ease: motionSpec.ease,
        delay: reduced ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
