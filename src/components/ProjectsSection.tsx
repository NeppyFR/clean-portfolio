"use client";

import { useContent } from "@/i18n";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon } from "./Icons";

export function ProjectsSection() {
  const t = useContent();

  return (
    <section
      id="projects"
      className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
              {t.projects.heading}
            </h2>
            <span className="h-px flex-1 bg-paper-border" />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {t.projects.items.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.1}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-[1.75rem] border border-paper-border bg-paper-card p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(16,16,24,0.4)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <ArrowUpRightIcon
                    width={20}
                    height={20}
                    className="mt-1 shrink-0 text-paper-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </div>
                <p className="mt-4 flex-1 leading-relaxed text-paper-muted">
                  {p.desc}
                </p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-paper-border px-3 py-1 text-xs text-paper-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
