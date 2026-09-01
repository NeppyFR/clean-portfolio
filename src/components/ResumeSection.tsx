"use client";

import { useContent } from "@/i18n";
import { Reveal } from "./Reveal";

type Entry = {
  title: string;
  org: string;
  period: string;
  bullets: string[];
};

/**
 * CV timeline — education and practical experience, straight from
 * `resume` in content.ts.
 *
 * Every row is a `Reveal` with an explicit `index`, so entries cascade one
 * `motionSpec.reveal.stagger` step apart exactly like the projects, skills
 * and stats above. Delays are never hand-tuned here.
 */
export function ResumeSection() {
  const { resume } = useContent();

  return (
    <section
      id="resume"
      className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
              {resume.heading}
            </h2>
            <span className="h-px flex-1 bg-paper-border" />
          </div>
        </Reveal>

        {/* The reason the CV is on this page at all: the internship ask. */}
        <Reveal index={1}>
          <div className="mt-8 flex flex-col gap-2.5 rounded-2xl border border-accent/25 bg-accent/[0.06] p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-accent-deep">
              {resume.seeking.label}
            </span>
            <p className="text-[0.98rem] leading-relaxed text-ink/80">
              {resume.seeking.text}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <Track heading={resume.educationHeading} entries={resume.education} />
          <Track
            heading={resume.experienceHeading}
            entries={resume.experience}
          />
        </div>
      </div>
    </section>
  );
}

/** One column of the timeline: a heading, then dated entries on a rail. */
function Track({
  heading,
  entries,
}: {
  heading: string;
  entries: Entry[];
}) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-paper-muted">
          {heading}
        </h3>
      </Reveal>

      <ol className="mt-6">
        {entries.map((entry, i) => {
          const last = i === entries.length - 1;

          return (
            // index starts at 1 so each entry lands one stagger step after
            // the column heading above it.
            <Reveal as="li" key={entry.title} index={i + 1}>
              <div className={`relative pl-8 ${last ? "" : "pb-9"}`}>
                {/* Rail down to the next dot — omitted on the last entry, or
                    it would dangle past the end of the column. */}
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[5px] top-5 w-px bg-paper-border"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[7px] h-2.5 w-2.5 rounded-full border-2 border-accent bg-paper-card"
                />

                {/* Wraps to two lines rather than squashing when the German
                    title and the period can't share a row. */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                  <h4 className="font-semibold tracking-tight">
                    {entry.title}
                  </h4>
                  <span className="text-xs uppercase tracking-[0.14em] text-paper-muted">
                    {entry.period}
                  </span>
                </div>

                <p className="mt-1 text-sm italic text-accent-deep">
                  {entry.org}
                </p>

                <ul className="mt-3 space-y-2">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-4 text-sm leading-relaxed text-paper-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-paper-muted/60"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
