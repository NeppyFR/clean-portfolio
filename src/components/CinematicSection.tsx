"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  transform,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { motionSpec } from "@/content";
import { useContent } from "@/i18n";

const c = motionSpec.cinematic;
const LEFT_AT = "cinematic-left-at";

/**
 * Maps scroll progress through a function rather than useTransform's array
 * form. Given arrays, Framer hands opacity to a native scroll timeline, where
 * a range stopping short of 1 falls back to the underlying opacity: the title
 * kept fading through the stretch where it was meant to hold, and drifted out
 * of step with its own blur and travel, which stay in JS.
 */
function useScrub(
  progress: MotionValue<number>,
  stops: number[],
  values: number[],
) {
  return useTransform(progress, transform(stops, values));
}

/** Whether the page should be black. Going black has to clear the deadband. */
const inBand = (p: number, was: boolean) =>
  was ? p > 0 && p < 1 : p > c.hysteresis && p < 1 - c.hysteresis;

/**
 * The act break: the page goes black.
 *
 * Whether the page is black is a yes/no decided by two thresholds, and
 * crossing one starts a timed fade that finishes by itself, so stopping
 * anywhere leaves the page fully light or fully black, never grey. What plays
 * on the black follows scroll, inside a sticky screen that pins while you
 * keep scrolling.
 *
 * The black is one fixed, full-viewport layer rather than this section's own
 * background. A section background would rise with a hard paper-to-black edge
 * across the screen; this way whatever is still in view, such as the last
 * project cards, goes dark with it. It sits over the ordinary sections, which
 * have no z-index, and under the pinned screen and the navbar (z-50).
 *
 * The `unpinned:` classes undo all of this for reduced motion and for screens
 * too short to pin, leaving one plain black section that scrolls. That is CSS
 * rather than a second tree chosen in JS: the server cannot know the setting,
 * so swapping trees after load changed the page's height and threw anchor links
 * up to 1100 px off. The `!` overrides beat the values Framer writes inline.
 *
 * It plays once per page load. After the visitor has been below it, or scrolls
 * back up after seeing the preview, it retires for good into an ordinary project
 * card holding just the frame. The same DOM stays, so the banner keeps running,
 * and the scroll position is corrected in the same paint, so nothing jumps.
 */
export function CinematicSection({
  /** The big project's preview. Anything: a component, a video, an image. */
  preview,
}: {
  preview?: ReactNode;
}) {
  const t = useContent().cinematic;
  const ref = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // 0 when the section tops out, 1 when its bottom reaches the viewport
  // floor — exactly the stretch over which the inner screen is stuck.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Only ever read to decide yes or no. The value clamps to 0..1, so both of
  // those ends mean "outside"; going black also has to clear the deadband.
  const { scrollYProgress: band } = useScroll({
    target: ref,
    offset: [c.enter, c.exit],
  });
  const [dark, setDark] = useState(false);

  // An in-page link, or the browser's back and forward, scrolling through this
  // section is passing by, not arriving, so the page must not flash black on the
  // way. Whatever state it was in holds for the trip and settles where it lands.
  const [passing, setPassing] = useState(false);
  const passingNow = useRef(false);

  // What to hold still in the viewport while the section shrinks. Null when the
  // section is already below the viewport and nothing above it changes.
  const [retired, setRetired] = useState(false);
  const retiredNow = useRef(false);
  const anchor = useRef<{ el: Element; top: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // How visible the preview was at the swap. Scrolling past, it has long faded
  // out, and the card must not pop in at full strength.
  const shownAtSwap = useRef(1);
  const retire = (keep: "frame" | "next" | null) => {
    const sec = ref.current;
    const pin = pinRef.current;
    if (retiredNow.current || !sec || !pin) return;
    if (getComputedStyle(pin).position !== "sticky") return;
    retiredNow.current = true;
    const el = keep === "frame" ? previewRef.current : keep ? sec.nextElementSibling : null;
    const top = el ? el.getBoundingClientRect().top : 0;
    // A scrollbar drag can leave the frame below the viewport. Then everything in
    // view is above the section, and shrinking it moves none of that.
    anchor.current = el && !(keep === "frame" && top >= window.innerHeight) ? { el, top } : null;
    if (previewRef.current) shownAtSwap.current = +getComputedStyle(previewRef.current).opacity;
    setDark(false);
    setRetired(true);
  };
  // A reload starts with the section at full height again, so the browser's own
  // restoration lands up to 2200 px from where a visitor below it was. Once retired,
  // the section keeps the position itself: one who had reached it stays retired, and
  // one back above it sees it play again.
  const restoreY = useRef<number | null>(null);
  useLayoutEffect(() => {
    const [entry] = performance.getEntriesByType("navigation");
    const type = (entry as PerformanceNavigationTiming)?.type;
    let left: { y: number; reached: boolean } | null = null;
    try {
      const raw = sessionStorage.getItem(LEFT_AT);
      sessionStorage.removeItem(LEFT_AT);
      if (raw && (type === "reload" || type === "back_forward")) left = JSON.parse(raw);
      history.scrollRestoration = "auto";
    } catch {}
    if (!left) return;
    if (left.reached) {
      restoreY.current = left.y;
      retire(null);
      // Refused while unpinned: it must not fire on some later retire instead.
      if (!retiredNow.current) restoreY.current = null;
      // The preview only reads as faded because scroll has not been measured yet.
      shownAtSwap.current = 1;
    }
    // Nothing above the section changes when it retires, so this also holds when
    // retire() has refused, and the effect below only needs to redo it after the swap.
    window.scrollTo({ top: left.y, behavior: "instant" });
    // Only ever run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const remember = () => {
      const sec = ref.current;
      if (!retiredNow.current || !sec) return;
      try {
        const reached = sec.getBoundingClientRect().top < window.innerHeight * 0.55;
        sessionStorage.setItem(LEFT_AT, JSON.stringify({ y: window.scrollY, reached }));
        history.scrollRestoration = "manual";
      } catch {}
    };
    window.addEventListener("pagehide", remember);
    return () => window.removeEventListener("pagehide", remember);
  }, []);
  useLayoutEffect(() => {
    if (!retired) return;
    if (restoreY.current !== null) {
      window.scrollTo({ top: restoreY.current, behavior: "instant" });
      restoreY.current = null;
    }
    // The frame rather than the element with the inline opacity, which `!` holds at 1.
    if (shownAtSwap.current < 1) {
      previewRef.current?.firstElementChild?.animate(
        [{ opacity: shownAtSwap.current }, { opacity: 1 }],
        { duration: c.fade * 1000, easing: `cubic-bezier(${motionSpec.ease.join(",")})` },
      );
    }
    if (!anchor.current) return;
    const { el, top } = anchor.current;
    anchor.current = null;
    // The browser's own scroll anchoring would correct this a second time.
    const root = document.documentElement;
    root.style.overflowAnchor = "none";
    window.scrollBy({ top: el.getBoundingClientRect().top - top, behavior: "instant" });
    requestAnimationFrame(() => {
      root.style.overflowAnchor = "";
    });
    // That also stopped any scroll the browser had begun to bring keyboard focus
    // into view, so finish the job. 80 px clears the navbar.
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.matches(":focus-visible")) {
      const box = focused.getBoundingClientRect();
      if (box.top < 80 || box.bottom > window.innerHeight) {
        focused.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }
  }, [retired]);

  // Retiring moves the page, which ends any smooth scroll still running. So once
  // past the section it waits for the page to stop, unless the visitor turns back
  // first. A smooth scroll barely moves at its start, so it takes a real pause.
  const stillTimer = useRef(0);
  const retireWhenStill = () => {
    const y = window.scrollY;
    window.clearTimeout(stillTimer.current);
    stillTimer.current = window.setTimeout(() => {
      if (passingNow.current) return;
      if (window.scrollY === y) retire("next");
      else retireWhenStill();
    }, c.stillMs);
  };
  useMotionValueEvent(band, "change", (p) => {
    if (passingNow.current || retiredNow.current) return;
    // Even when retire() then refuses: a phone rotated at the page's end comes back
    // pinned with the band still at 1, and no further change event to clear the black.
    setDark((was) => inBand(p, was));
    if (p >= 1) retireWhenStill();
    else if (stillTimer.current) retire("next");
  });
  // Having seen the preview, turning back retires it rather than replaying it.
  // Measured in pixels from the furthest point reached: a slow drag adds up, and
  // resizing the window, which moves progress but not the page, does not count.
  const seen = useRef(false);
  const furthest = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (retiredNow.current) return;
    if (p >= c.previewStops[1]) seen.current = true;
    if (!seen.current) return;
    furthest.current = Math.max(furthest.current, window.scrollY);
    if (!passingNow.current && window.scrollY < furthest.current - c.turnBack) retire("frame");
  });
  useEffect(() => {
    let fallback = 0;
    const land = () => {
      window.clearTimeout(fallback);
      window.removeEventListener("scrollend", settle);
      passingNow.current = false;
      setPassing(false);
      const p = band.get();
      if (!retiredNow.current) setDark((was) => inBand(p, was));
      if (p >= 1) retire("next");
      else if (p <= 0 && seen.current) retire(null);
    };
    // A scrollend can belong to an earlier scroll while the trip is about to start,
    // so only a page that has really stopped counts as landed.
    const settle = () => {
      const y = window.scrollY;
      window.setTimeout(() => {
        if (passingNow.current && window.scrollY === y) land();
      }, c.stillMs);
    };
    // No scrollend came. Keep checking rather than land mid-trip.
    const giveUp = () => {
      const y = window.scrollY;
      fallback = window.setTimeout(() => {
        if (window.scrollY === y) land();
        else giveUp();
      }, c.stillMs);
    };
    const depart = () => {
      window.clearTimeout(fallback);
      passingNow.current = true;
      setPassing(true);
      window.addEventListener("scrollend", settle);
      // scrollend never fires if the page is already there, or in older browsers.
      fallback = window.setTimeout(giveUp, 2000);
    };
    const onClick = (e: MouseEvent) => {
      const link =
        e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      const id = link?.getAttribute("href")?.slice(1);
      if (id && document.getElementById(id)) depart();
    };
    // Home and End are the same kind of long trip.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Home" || e.key === "End") depart();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", depart);
    window.addEventListener("hashchange", depart);
    // Opening a URL with a hash scrolls to it the same way. A reload does not: it
    // restores where the visitor was, which may be inside the section.
    const [entry] = performance.getEntriesByType("navigation");
    const isReload = (entry as PerformanceNavigationTiming)?.type === "reload";
    if (window.location.hash && !isReload) depart();
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(stillTimer.current);
      window.removeEventListener("scrollend", settle);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", depart);
      window.removeEventListener("hashchange", depart);
    };
  }, [band]);

  const titleOpacity = useScrub(scrollYProgress, c.titleStops, [0, 1, 1, 0]);
  // The caption is one more beat after the headline's lines, not ahead of them.
  const captionLag = t.lines.length * c.lineStagger;
  const captionOpacity = useScrub(
    scrollYProgress,
    [c.titleStops[0] + captionLag, c.titleStops[1] + captionLag],
    [0, 1],
  );
  const previewOpacity = useScrub(scrollYProgress, c.previewStops, [0, 1, 1, 0]);
  const previewScale = useScrub(
    scrollYProgress,
    [c.previewStops[0], c.previewStops[1]],
    [c.previewScaleFrom, 1],
  );

  // The preview holds real controls, and opacity alone leaves them live: an
  // invisible button would take clicks through the title card and take keyboard
  // focus while nothing shows it.
  const previewEvents = useTransform(previewOpacity, (o) =>
    o > 0.5 ? "auto" : "none",
  );

  // Tab is the only arrival that should move the page. Focus also lands on a
  // control when it is clicked, and again when the visitor comes back to the
  // browser tab; following those would throw the page around.
  const tabbing = useRef(false);
  const recheck = useRef(0);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      tabbing.current =
        e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey;
      if (!tabbing.current) window.clearTimeout(recheck.current);
    };
    const keyUp = () => {
      tabbing.current = false;
    };
    // Any input of the visitor's own outranks the re-check below.
    const takeOver = () => {
      tabbing.current = false;
      window.clearTimeout(recheck.current);
    };
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", keyUp, true);
    window.addEventListener("blur", keyUp);
    window.addEventListener("pointerdown", takeOver, true);
    window.addEventListener("wheel", takeOver, { capture: true, passive: true });
    window.addEventListener("touchmove", takeOver, {
      capture: true,
      passive: true,
    });
    return () => {
      window.clearTimeout(recheck.current);
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", keyUp, true);
      window.removeEventListener("blur", keyUp);
      window.removeEventListener("pointerdown", takeOver, true);
      window.removeEventListener("wheel", takeOver, true);
      window.removeEventListener("touchmove", takeOver, true);
    };
  }, []);

  const showPreviewOnTab = () => {
    const el = ref.current;
    const pin = pinRef.current;
    if (!el || !pin || !tabbing.current) return;
    if (getComputedStyle(pin).position !== "sticky") return;
    const hold = (c.previewStops[1] + c.previewStops[2]) / 2;
    const toHold = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + (el.offsetHeight - window.innerHeight) * hold,
        behavior: "instant",
      });
    };
    if (previewOpacity.get() !== 1) toHold();
    // A smooth scroll already under way (html has scroll-behavior: smooth) keeps
    // running after the jump and can carry the page past the hold, leaving focus
    // on a control nobody can see. Look again once it must have finished.
    window.clearTimeout(recheck.current);
    recheck.current = window.setTimeout(() => {
      if (pin.contains(document.activeElement) && previewOpacity.get() !== 1) {
        toHold();
      }
    }, 800);
  };

  return (
    // bg-paper because the body behind the page is ink: without it this
    // section would show as a black slab before the fade has even started.
    <section
      id="next"
      ref={ref}
      data-cine={retired ? "card" : "pin"}
      style={retired ? undefined : { height: `${c.heightVh}vh` }}
      className={`bg-paper print:[print-color-adjust:exact] unpinned:h-auto! ${retired ? "" : "unpinned:bg-ink"}`}
    >
      {/* While black it takes the clicks itself: the cards underneath are still
          live, and a click on empty black must not open a project. Hidden in
          print, where a fixed layer repeats on every sheet. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={{ duration: c.fade, ease: motionSpec.ease }}
        className={`${dark ? "" : "pointer-events-none "}fixed inset-0 z-[1] bg-ink print:hidden unpinned:hidden`}
      />

      {/* The top padding keeps the content clear of the fixed navbar. svh, so
          a phone's address bar cannot hide the bottom of the frame. */}
      <div
        ref={pinRef}
        className="sticky top-0 z-[2] flex h-svh items-center overflow-hidden px-6 pt-20 sm:px-8 flat:block flat:h-auto flat:overflow-visible unpinned:static unpinned:py-28 lg:unpinned:py-36 card:relative card:-mt-23 card:pb-5 card:pt-0 lg:card:-mt-31"
      >
        {/* Passing by on paper, the light title and the banner would flash past
            with no black behind them. */}
        <div
          className={`relative mx-auto w-full max-w-7xl${
            passing && !dark ? " invisible flat:visible" : ""
          }`}
        >
          {/* Title card and preview occupy the same ground and hand over to
              each other, so the whole beat fits one screen without the user
              having to scroll content that is itself pinned. */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="unpinned:opacity-100! card:hidden"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
                {t.eyebrow}
              </span>
              <span className="whitespace-nowrap rounded-full border border-ink-border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                {t.badge}
              </span>
            </div>

            {/* The clamp's floor scales below 395 px wide, because the German
                "53 Screens fürs Team." would otherwise wrap and turn a
                three-beat title into four lines. */}
            <h2 className="mt-8 max-w-5xl text-balance text-[clamp(min(2rem,8.1vw),5.2vw,4.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink-text short:mt-3 short:text-[clamp(1.5rem,min(9svh,8vw),2.25rem)]">
              {t.lines.map((l, i) => (
                <Line key={i} index={i} progress={scrollYProgress}>
                  {l}
                </Line>
              ))}
            </h2>

            <motion.p
              style={{ opacity: captionOpacity }}
              className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted short:mt-3 short:max-w-2xl short:text-sm short:[@media(max-height:359.98px)]:text-xs unpinned:opacity-100!"
            >
              {t.caption}
            </motion.p>
          </motion.div>

          <motion.div
            ref={previewRef}
            style={{
              opacity: previewOpacity,
              scale: previewScale,
              pointerEvents: previewEvents,
            }}
            onFocusCapture={showPreviewOnTab}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flat:pointer-events-auto! flat:static flat:translate-y-0 flat:transform-none! flat:opacity-100! unpinned:mt-14"
          >
            <Slot label={t.slotEmpty}>{preview}</Slot>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** One line of the title card, lagging the line above it. */
function Line({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const from = c.titleStops[0] + index * c.lineStagger;
  const to = c.titleStops[1] + index * c.lineStagger;

  const opacity = useScrub(progress, [from, to], [0, 1]);
  const y = useScrub(progress, [from, to], [c.y, 0]);
  const blurPx = useScrub(progress, [from, to], [c.blur, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="block unpinned:transform-none! unpinned:opacity-100! unpinned:filter-none!"
    >
      {children}
    </motion.span>
  );
}

/** The preview itself, or a stand-in while there is nothing to show. */
function Slot({ label, children }: { label: string; children?: ReactNode }) {
  if (children) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-ink-border bg-ink-soft">
        {children}
      </div>
    );
  }
  // Same "explicitly unfilled" treatment as the portrait and the
  // testimonial: dashed and captioned, never a fake screenshot.
  return (
    <div className="grid aspect-[16/9] max-h-[62vh] w-full place-items-center rounded-[2rem] border border-ink-border bg-ink-soft">
      <span className="rounded-2xl border border-dashed border-ink-border px-6 py-4 text-sm uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}
