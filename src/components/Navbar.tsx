"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionSpec } from "@/content";
import { useContent } from "@/i18n";
import { RefreshIcon } from "./Icons";
import { LanguageToggle } from "./LanguageToggle";

/**
 * Floating capsule nav.
 *
 * Over the dark hero it spans the content width. Once the light sections
 * scroll up under it, it shrinks, centres, and picks up a blurred light
 * background — the transition in the reference video.
 *
 * Entrance: drops in from the top 0.2s after the hero headline starts.
 */
export function Navbar() {
  const t = useContent();
  const [compact, setCompact] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Switch once we've scrolled roughly out of the hero.
    const onScroll = () => {
      setCompact(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const { ease } = motionSpec;

  return (
    <motion.header
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -28 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.35 : 0.7,
        ease,
        delay: motionSpec.navbarDelay,
      }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 sm:px-6"
    >
      <motion.nav
        // Framer Motion cannot animate maxWidth out of its computed "none",
        // so seed every animated property with an explicit numeric base.
        initial={{
          maxWidth: 1280,
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 10,
          paddingBottom: 10,
        }}
        animate={{
          maxWidth: compact ? 840 : 1280,
          paddingLeft: compact ? 10 : 14,
          paddingRight: compact ? 10 : 14,
          paddingTop: compact ? 8 : 10,
          paddingBottom: compact ? 8 : 10,
        }}
        transition={{ duration: reduced ? 0 : 0.5, ease }}
        className={`flex w-full items-center gap-3 rounded-full border backdrop-blur-xl transition-colors duration-500 ${
          compact
            ? "border-paper-border bg-white/85 text-ink shadow-[0_10px_40px_-12px_rgba(16,16,24,0.28)]"
            : "border-white/10 bg-white/[0.06] text-ink-text"
        }`}
      >
        {/* Logo */}
        <a
          href="#home"
          aria-label={t.ui.homeLabel}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-sm font-bold tracking-wide text-white shadow-lg shadow-accent-deep/30"
        >
          {t.site.initials}
        </a>

        {/* Links */}
        <ul className="mx-auto hidden items-center gap-1 md:flex">
          {t.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                // nowrap: German labels like "Über mich" wrap onto two lines otherwise
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-300 lg:px-4 ${
                  compact
                    ? "text-ink/70 hover:bg-ink/5 hover:text-ink"
                    : "text-ink-text/70 hover:bg-white/10 hover:text-ink-text"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile spacer keeps the controls hard right when links are hidden */}
        <span className="mx-auto md:hidden" />

        <LanguageToggle compact={compact} />

        {/* CTA */}
        <a
          href={t.cta.href}
          className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-transform duration-300 hover:scale-[1.03] sm:px-5 ${
            compact ? "bg-ink text-white" : "bg-ink-text text-ink"
          }`}
        >
          <span className="hidden sm:inline">{t.cta.label}</span>
          <span className="sm:hidden">@</span>
          <RefreshIcon
            width={15}
            height={15}
            className="transition-transform duration-500 group-hover:rotate-180"
          />
        </a>
      </motion.nav>
    </motion.header>
  );
}
