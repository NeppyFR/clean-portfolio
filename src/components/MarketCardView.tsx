"use client";

import { useContent } from "@/i18n";
import type { Candle, MarketData } from "@/lib/market-types";

/**
 * Presentation half of the market card.
 *
 * This is a client component purely so the copy can follow the EN/DE toggle —
 * the data still arrives from the server (see MarketCard.tsx), so there is
 * still no browser-side request to any exchange.
 */

const W = 400;
const H = 124;
const PAD = 5;

// Brightened from the emerald-600/rose-600 pair used on light backgrounds —
// those go muddy against the dark card.
const UP = "#10b981";
const DOWN = "#f43f5e";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function MarketCardView({ data }: { data: MarketData | null }) {
  const t = useContent().market;

  return (
    <figure className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-ink p-8">
      <figcaption>
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {t.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          {t.subtitle}
        </p>
      </figcaption>

      {data ? (
        <>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight tabular-nums text-white">
              {money(data.last)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${
                data.changePct >= 0
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-rose-500/15 text-rose-400"
              }`}
            >
              {data.changePct >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(data.changePct).toFixed(2)}%
            </span>
          </div>

          <Chart candles={data.candles} label={t.chartLabel} />

          <div className="mt-3 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
            <span>BTC / USD · 5m · 4h</span>
            <span className="tabular-nums">
              L {Math.round(data.low).toLocaleString("en-US")} · H{" "}
              {Math.round(data.high).toLocaleString("en-US")}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/15 py-10 text-sm text-white/50">
          {t.unavailable}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2.5 border-t border-white/10 pt-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
          {t.comingSoon}
        </span>
      </div>
    </figure>
  );
}

/** Japanese candlesticks: high-low wick plus an open-close body. */
function Chart({ candles, label }: { candles: Candle[]; label: string }) {
  // Scale across the full high/low range, not just closes — otherwise wicks
  // would clip outside the viewBox.
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const span = max - min || 1;
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);

  const slot = W / candles.length;
  const body = Math.max(2, slot * 0.62); // leave a gap between candles

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-5 h-auto w-full"
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {candles.map((c, i) => {
        const cx = i * slot + slot / 2;
        const rising = c.c >= c.o;
        const colour = rising ? UP : DOWN;
        const yOpen = y(c.o);
        const yClose = y(c.c);
        const top = Math.min(yOpen, yClose);
        // keep doji (open === close) visible as a 1px line
        const height = Math.max(1, Math.abs(yClose - yOpen));

        return (
          <g key={c.t} fill={colour} stroke={colour}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.h)}
              y2={y(c.l)}
              strokeWidth="1"
              shapeRendering="auto"
            />
            <rect
              x={cx - body / 2}
              y={top}
              width={body}
              height={height}
              rx={body > 4 ? 0.6 : 0}
            />
          </g>
        );
      })}
    </svg>
  );
}
