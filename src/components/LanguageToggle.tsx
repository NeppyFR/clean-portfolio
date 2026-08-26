"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANGS, LANG_LABELS, motionSpec } from "@/content";
import { useLanguage } from "@/i18n";

/**
 * Two-segment EN/DE switch with a sliding indicator.
 * Inverts its palette with the navbar's compact state.
 */
export function LanguageToggle({ compact }: { compact: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={t.ui.langSwitchLabel}
      className={`relative flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-500 ${
        compact ? "bg-ink/[0.06]" : "bg-white/[0.08]"
      }`}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={LANG_LABELS[code].full}
            title={LANG_LABELS[code].full}
            className={`relative rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300 sm:px-3 ${
              active
                ? compact
                  ? "text-white"
                  : "text-ink"
                : compact
                  ? "text-ink/50 hover:text-ink/80"
                  : "text-ink-text/55 hover:text-ink-text/85"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className={`absolute inset-0 rounded-full ${
                  compact ? "bg-ink" : "bg-ink-text"
                }`}
                style={{ zIndex: -1 }}
              />
            )}
            <span className="relative">{LANG_LABELS[code].short}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Plain text links version, used in the footer. */
export function FooterLanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.ui.langSwitchLabel}
      className="flex items-center gap-2 text-sm"
    >
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink-muted/40">·</span>}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={code === lang}
            className={`transition-colors duration-300 ${
              code === lang
                ? "text-ink-text"
                : "text-ink-muted hover:text-ink-text"
            }`}
            style={{ transitionTimingFunction: `cubic-bezier(${motionSpec.ease.join(",")})` }}
          >
            {LANG_LABELS[code].full}
          </button>
        </span>
      ))}
    </div>
  );
}
