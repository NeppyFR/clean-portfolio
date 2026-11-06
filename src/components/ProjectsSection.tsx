"use client";

import type { ReactNode } from "react";
import type { ProjectItem } from "@/content";
import { useContent } from "@/i18n";
import { MediaCard } from "./FeatureSection";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon, GithubIcon } from "./Icons";
import { WerkhallePreview } from "./WerkhallePreview";

const CARD =
  "flex h-full flex-col rounded-[1.75rem] border border-paper-border bg-paper-card p-8";

export function ProjectsSection({
  /** Server-rendered slot: this is a client component, so the market card is
   *  fetched on the server and passed in from page.tsx. */
  sideCard,
}: {
  sideCard: ReactNode;
}) {
  const t = useContent();
  const feature = t.projects.items.find((p) => p.preview);

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

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {/* Full width for now; this row is where smaller projects will join it. */}
          {/* "some": on a very short screen the 380 px card can never be 20% inside the
              detection box when a link lands on it, so it would stay hidden. */}
          <Reveal className="lg:col-span-3" amount="some">
            <MediaCard />
          </Reveal>
          {feature && (
            <Reveal className="lg:col-span-2">
              <Card p={feature} />
            </Reveal>
          )}
          <Reveal index={1}>{sideCard}</Reveal>
        </div>
      </div>
    </section>
  );
}

/** The smaller projects, below the big one. The first, client work, gets a little more room. */
export function MoreProjects() {
  const rest = useContent().projects.items.filter((p) => !p.preview);

  return (
    <section className="relative bg-paper px-6 pb-28 text-ink sm:px-8 unpinned:pt-28 lg:pb-36 lg:unpinned:pt-36">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-5">
        {rest.map((p, i) => (
          <Reveal key={p.name} index={i} className={i === 0 ? "lg:col-span-3" : "lg:col-span-2"}>
            <Card p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Card({ p }: { p: ProjectItem }) {
  const body = (
    <>
      <div
        className={`flex items-start justify-between gap-x-4 gap-y-3${p.repo ? " flex-wrap" : ""}`}
      >
        <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
        {p.href && (
          <ArrowUpRightIcon
            width={20}
            height={20}
            className="mt-1 shrink-0 text-paper-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          />
        )}
        {p.repo && (
          <a
            href={p.repo.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-paper-border px-3.5 py-1.5 text-sm text-paper-muted transition-colors duration-300 hover:border-ink/30 hover:text-ink"
          >
            <GithubIcon width={15} height={15} />
            {p.repo.label}
            <ArrowUpRightIcon width={14} height={14} />
          </a>
        )}
      </div>
      <p
        className={
          "mt-4 leading-relaxed text-paper-muted" +
          // Without a preview the copy takes the slack, so the tags sit on
          // the floor of the card and line up across the row.
          (p.preview ? "" : " flex-1")
        }
      >
        {p.desc}
      </p>
      {p.preview === "werkhalle" && (
        <div className="mt-7">
          <WerkhallePreview />
        </div>
      )}
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
    </>
  );

  if (!p.href) {
    // No link, so no hover lift and no anchor — this card holds an
    // interactive control, which cannot live inside one.
    return <div className={CARD}>{body}</div>;
  }

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className={
        CARD +
        " group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(16,16,24,0.4)]"
      }
    >
      {body}
    </a>
  );
}
