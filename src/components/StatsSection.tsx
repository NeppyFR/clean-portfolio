"use client";

import Image from "next/image";
import { PORTRAIT_SRC } from "@/content";
import { useContent } from "@/i18n";
import { Reveal } from "./Reveal";
import { AvatarIcon } from "./Icons";

export function StatsSection() {
  const t = useContent();

  return (
    <section
      id="about"
      className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
        {/* Bio */}
        <div>
          {/* Portrait leads the section: this is where a reader has just
              arrived wanting to know who you are. Index 0 puts it at the
              head of the existing cascade, so the label and paragraphs
              shift one step later rather than gaining hand-tuned delays.

              Name and role sit beside the photo so the portrait isn't a
              lone square in a half-empty column. Stacks below `sm`, because
              "Applikationsentwickler" is a 22-character unbreakable token
              and will not share a 375px row with a 160px image. */}
          <Reveal>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
              <Portrait />
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
                  {t.site.name}
                </p>
                <p className="mt-2 text-paper-muted">{t.site.role}</p>
                <p className="mt-1 text-sm text-paper-muted/75">
                  {t.site.location}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="mt-8 flex items-center gap-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
                {t.about.heading}
              </h2>
              <span className="h-px flex-1 bg-paper-border" />
            </div>
          </Reveal>
          {t.about.paragraphs.map((p, i) => (
            <Reveal key={i} index={i + 2}>
              <p className="mt-6 text-lg leading-relaxed text-paper-muted">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <ul className="flex flex-col justify-center divide-y divide-paper-border">
          {t.about.stats.map((s, i) => (
            <Reveal as="li" key={s.label} index={i}>
              <div className="flex items-baseline justify-between gap-6 py-7">
                <span className="text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-black/15">
                  {s.value}
                </span>
                <span className="text-right text-sm uppercase tracking-[0.16em] text-paper-muted">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Portrait, or a stand-in while `PORTRAIT_SRC` is null.
 *
 * Both branches are the same box, so swapping the photo out cannot shift the
 * surrounding layout — keep the aspect and width in step if either changes.
 * The placeholder is dashed and captioned: the same "explicitly unfilled"
 * treatment the testimonial and market cards use, rather than a stock face
 * that reads as real.
 *
 * 4/5 rather than square because the source headshot is 1172x1342 (0.87).
 * Cropping it to a square eats 85px off the top, which leaves *three* rendered
 * pixels above the hair — the head reads as jammed into the frame. At 4/5 the
 * vertical crop is zero, so the photographer's headroom survives and only the
 * shoulders tighten by ~49px a side.
 *
 * next/image, not a bare <img>: the source is a 1.6MB PNG and this box is
 * 176px wide, so the optimizer is the difference between shipping the whole
 * file and shipping ~20KB of WebP.
 */
function Portrait() {
  const t = useContent();

  if (!PORTRAIT_SRC) {
    return (
      <div
        // aria-hidden: a missing photo is decorative, and announcing
        // "photo coming soon" to a screen reader adds nothing.
        aria-hidden="true"
        className="grid aspect-[4/5] w-40 place-items-center gap-2.5 rounded-3xl border border-dashed border-paper-border bg-paper-card sm:w-44"
      >
        <AvatarIcon
          width={44}
          height={44}
          className="mt-1 text-paper-muted/55"
        />
        <span className="px-4 pb-1 text-center text-[0.7rem] uppercase tracking-[0.14em] text-paper-muted/70">
          {t.about.portraitPlaceholder}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={PORTRAIT_SRC}
      alt={t.about.portraitAlt}
      width={176}
      height={220}
      className="aspect-[4/5] w-40 shrink-0 rounded-3xl border border-paper-border object-cover sm:w-44"
    />
  );
}
