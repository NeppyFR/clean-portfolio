"use client";

import { useLayoutEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * prefers-reduced-motion, safe to branch on while rendering.
 *
 * Framer's useReducedMotion() is null on the server but already the real
 * setting on the client's first render, so branching on it directly makes that
 * render disagree with the server's HTML (React #418). This stays false through
 * hydration, then flips in a layout effect: a synchronous re-render, so the
 * browser never paints the full-motion branch. With motion allowed the state
 * never changes, so nothing re-renders.
 */
export function useReducedMotionAfterMount(): boolean {
  const actual = useReducedMotion();
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    setReduced(actual === true);
  }, [actual]);

  return reduced;
}
