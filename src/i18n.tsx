"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { content, LANGS, type Dict, type Lang } from "@/content";

const STORAGE_KEY = "portfolio-lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: Dict;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLang = (v: unknown): v is Lang =>
  typeof v === "string" && (LANGS as string[]).includes(v);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at "en" so the server-rendered markup and the first client
  // render agree; the stored/browser preference is applied in the effect below.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let next: Lang | null = null;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) next = stored;
    } catch {
      // localStorage can throw in private mode — fall through to navigator
    }

    // No explicit choice yet: follow the browser, but only for German.
    if (!next && navigator.language?.toLowerCase().startsWith("de")) {
      next = "de";
    }

    if (next && next !== "en") setLangState(next);
  }, []);

  // Keep <html lang> honest for screen readers and search engines.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort; the toggle still works for this session.
    }
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "en" ? "de" : "en"),
    [lang, setLang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: content[lang] }),
    [lang, setLang, toggle],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}

/** Shorthand for the active dictionary. */
export function useContent(): Dict {
  return useLanguage().t;
}
