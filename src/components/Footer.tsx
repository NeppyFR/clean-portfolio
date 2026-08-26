"use client";

import { socials } from "@/content";
import { useContent } from "@/i18n";
import { iconMap } from "./Icons";
import { Reveal } from "./Reveal";
import { FooterLanguageToggle } from "./LanguageToggle";

export function Footer() {
  const t = useContent();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-ink px-6 pt-24 pb-12 text-ink-text sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-xl text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                {t.footer.heading}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-ink-muted">
                {t.footer.sub}
              </p>
            </div>
            <a
              href={t.cta.href}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-text px-7 py-3.5 font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              {t.cta.label}
            </a>
          </div>
        </Reveal>

        <div className="flex flex-col-reverse gap-8 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-ink-muted">
            © {year} {t.site.name} · {t.footer.builtIn} 🇨🇭
          </p>

          <nav aria-label={t.footer.navLabel}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-text"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-6">
            <FooterLanguageToggle />

            <ul className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = iconMap[s.icon];
                const missing = s.href.startsWith("{{");
                return (
                  <li key={s.label}>
                    <a
                      href={missing ? undefined : s.href}
                      aria-label={s.label}
                      aria-disabled={missing || undefined}
                      title={missing ? `${s.label} — link not set yet` : s.label}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors duration-300 ${
                        missing
                          ? "cursor-not-allowed opacity-40"
                          : "hover:border-white/25 hover:text-ink-text"
                      }`}
                    >
                      <Icon width={16} height={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
