"use client";
/* eslint-disable @next/next/no-img-element */

import { skillGroups } from "@/content";
import { useContent } from "@/i18n";
import { Reveal } from "./Reveal";

export function SkillsSection() {
  const t = useContent();

  return (
    <section
      id="skills"
      className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
              {t.skillsSection.heading}
            </h2>
            <span className="h-px flex-1 bg-paper-border" />
          </div>
        </Reveal>

        {/* Grouped as on the CV. Chips wrap rather than sitting in a fixed
            grid, because the groups are uneven (4 / 4 / 3 / 1). */}
        <div className="mt-10 space-y-9">
          {skillGroups.map((group) => (
            <div key={group.key}>
              <Reveal>
                <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-paper-muted">
                  {t.skillsSection.groups[group.key]}
                </h3>
              </Reveal>

              <ul className="mt-4 flex flex-wrap gap-3">
                {group.items.map((s, i) => (
                  // index starts at 1 so the chips cascade in after their
                  // group label.
                  <Reveal as="li" key={s.name} index={i + 1}>
                    <div className="flex h-full items-center gap-3 rounded-2xl border border-paper-border bg-paper-card px-4 py-3.5 transition-transform duration-300 hover:-translate-y-0.5">
                      {s.icon ? (
                        <img
                          src={s.icon}
                          alt=""
                          width={26}
                          height={26}
                          loading="lazy"
                          className="h-[26px] w-[26px] shrink-0"
                        />
                      ) : (
                        <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-md bg-gradient-to-br from-accent to-accent-deep text-[11px] font-bold text-white">
                          {s.name.slice(0, 2)}
                        </span>
                      )}
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education used to sit beside this; it now has its own timeline in
            ResumeSection, so languages get the full width. */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-paper-muted">
              {t.skillsSection.languagesHeading}
            </h3>
          </Reveal>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {t.languages.map((l, i) => (
              <Reveal as="li" key={l.name} index={i + 1}>
                <span className="inline-flex items-center gap-2 rounded-full border border-paper-border bg-paper-card px-4 py-2 text-sm">
                  <span aria-hidden="true">{l.flag}</span>
                  <span className="font-medium">{l.name}</span>
                  <span className="text-xs text-paper-muted">{l.tag}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
