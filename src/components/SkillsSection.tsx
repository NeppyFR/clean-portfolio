"use client";
/* eslint-disable @next/next/no-img-element */

import { skills } from "@/content";
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

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {skills.map((s, i) => (
            <Reveal as="li" key={s.name} delay={(i % 6) * 0.05}>
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

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          {/* Languages */}
          <div>
            <Reveal>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
                {t.skillsSection.languagesHeading}
              </h3>
            </Reveal>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {t.languages.map((l, i) => (
                <Reveal as="li" key={l.name} delay={i * 0.05}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-paper-border bg-paper-card px-4 py-2 text-sm">
                    <span aria-hidden="true">{l.flag}</span>
                    <span className="font-medium">{l.name}</span>
                    {l.tag && (
                      <span className="text-xs text-paper-muted">{l.tag}</span>
                    )}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Education */}
          <div>
            <Reveal>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
                {t.skillsSection.educationHeading}
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-5 rounded-2xl border border-paper-border bg-paper-card p-6">
                <h4 className="font-semibold tracking-tight">
                  {t.education.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                  {t.education.desc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
