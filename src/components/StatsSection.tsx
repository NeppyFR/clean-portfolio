import { about } from "@/content";
import { Reveal } from "./Reveal";

export function StatsSection() {
  return (
    <section
      id="about"
      className="relative bg-paper px-6 pb-28 text-ink sm:px-8 lg:pb-36"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
        {/* Bio */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
                {about.heading}
              </h2>
              <span className="h-px flex-1 bg-paper-border" />
            </div>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.08}>
              <p className="mt-6 text-lg leading-relaxed text-paper-muted">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <ul className="flex flex-col justify-center divide-y divide-paper-border">
          {about.stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.1}>
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
