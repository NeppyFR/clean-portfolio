import { darwinsMarket } from "@/content";
import { getBtcCandles, type Candle } from "@/lib/market";

/**
 * Server component — replaces the old testimonial placeholder, keeping the
 * exact same card footprint (h-full, rounded-[2rem], border, p-8).
 *
 * Renders BTC 5m candles as inline SVG. No client JS, no chart library, and
 * no browser-side network call: the data arrives already baked into the HTML.
 * See src/lib/market.ts for the caching/rate-limit story.
 */

const W = 400;
const H = 124;
const PAD = 5;

const UP = "#059669";
const DOWN = "#e11d48";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export async function MarketCard() {
  const data = await getBtcCandles();

  return (
    <figure className="flex h-full flex-col justify-between rounded-[2rem] border border-paper-border bg-paper-card p-8">
      <figcaption>
        <h3 className="text-2xl font-semibold tracking-tight text-ink">
          {darwinsMarket.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-paper-muted">
          {darwinsMarket.subtitle}
        </p>
      </figcaption>

      {data ? (
        <>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight tabular-nums text-ink">
              {money(data.last)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${
                data.changePct >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {data.changePct >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(data.changePct).toFixed(2)}%
            </span>
          </div>

          <Chart candles={data.candles} />

          <div className="mt-3 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.14em] text-paper-muted">
            <span>BTC / USD · 5m · 4h</span>
            <span className="tabular-nums">
              L {Math.round(data.low).toLocaleString("en-US")} · H{" "}
              {Math.round(data.high).toLocaleString("en-US")}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-paper-border py-10 text-sm text-paper-muted">
          Market data unavailable right now.
        </div>
      )}

      <div className="mt-5 flex items-center gap-2.5 border-t border-paper-border pt-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-paper-muted">
          Coming soon
        </span>
      </div>
    </figure>
  );
}

/** Japanese candlesticks: high-low wick plus an open-close body. */
function Chart({ candles }: { candles: Candle[] }) {
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
      aria-label={`Bitcoin candlestick chart, last 4 hours in 5 minute candles`}
      shapeRendering="crispEdges"
    >
      {candles.map((c, i) => {
        const cx = i * slot + slot / 2;
        const rising = c.c >= c.o;
        const colour = rising ? UP : DOWN;
        const yHigh = y(c.h);
        const yLow = y(c.l);
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
              y1={yHigh}
              y2={yLow}
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
