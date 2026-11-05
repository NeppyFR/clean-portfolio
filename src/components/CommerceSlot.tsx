"use client";

import { COMMERCE_DEMO_URL } from "@/content";
import { useContent, useLanguage } from "@/i18n";
import { CommercePreview } from "./CommercePreview";
import { ArrowUpRightIcon } from "./Icons";

/**
 * The frame is pinned to one screen and clips what does not fit, so its content
 * is capped by the screen's height. The rem values are what the rest of the frame
 * needs vertically; 2.857 and 1.6 are the aspect ratios of the wide and compact
 * drawings. A squat window keeps the wide art by dropping the blurb. A short one
 * narrows enough to get the compact art; under 390 px tall the label row under
 * the art can wrap in German, hence the last value.
 */
const HEIGHT_CAP =
  "mx-auto pinned:max-w-[calc((100svh-15rem)*2.857)] squat:max-w-[calc((100svh-13rem)*2.857)] short:max-w-[calc((100svh-12.75rem)*1.6)] short:[@media(max-height:389.98px)]:max-w-[calc((100svh-13.5rem)*1.6)]";

/**
 * What the cinematic section's preview frame holds: the moving banner, then one
 * row with the name, blurb, stack and demo link, sharing the banner's edges. A
 * client component because page.tsx cannot read the language.
 *
 * On a phone the blurb goes. Under about 1200 px wide it takes its own line, so the
 * name and tags can meet both edges. A short narrow screen drops the tags too and
 * centres what is left, which may then run wider than the small banner above it.
 */
export function CommerceSlot() {
  const { lang } = useLanguage();
  const t = useContent().cinematic;

  return (
    <div className="p-3 sm:p-4">
      <div className={HEIGHT_CAP}>
        <CommercePreview lang={lang} />
      </div>

      <div
        className={`${HEIGHT_CAP} mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 min-[728px]:max-[1199px]:justify-between squat:justify-between short:mt-2 short:justify-between short:gap-x-3 short:gap-y-1 short-narrow:max-w-none short-narrow:[@media(max-height:389.98px)]:max-w-none short-narrow:justify-center short-narrow:gap-x-1.5`}
      >
        <h3 className="text-base font-semibold tracking-tight text-ink-text short:text-sm">
          {t.name}
        </h3>
        {/* Once the section has retired there is no title card, and this sentence
            must stay on the page. Above the tags on a phone, last on anything wider. */}
        <p className="hidden basis-full text-pretty text-sm leading-snug text-ink-muted card:block min-[728px]:order-[10000]">
          {t.status}
        </p>
        <p className="min-w-[min(100%,18rem)] flex-1 text-pretty text-sm leading-snug text-ink-muted max-[728px]:hidden min-[728px]:max-[1199px]:order-last min-[728px]:max-[1199px]:basis-full squat:hidden short:hidden">
          {t.blurb}
        </p>
        <ul className="flex flex-wrap gap-1.5 max-[538px]:max-w-[22rem] short-narrow:hidden">
          {t.tags.map((tag, i) => (
            <li
              key={tag}
              // One row on a phone: the first three are enough at that size.
              className={`rounded-full border border-ink-border px-2.5 py-0.5 text-xs text-ink-muted${
                i > 2 ? " max-[540px]:hidden" : ""
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
        {COMMERCE_DEMO_URL && (
          <a
            href={COMMERCE_DEMO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white min-[728px]:ml-auto short:px-2.5 short:py-1 short:text-xs short-narrow:ml-0"
          >
            {t.demoLink}
            <ArrowUpRightIcon width={14} height={14} />
          </a>
        )}
      </div>
    </div>
  );
}
