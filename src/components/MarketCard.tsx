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
const H = 132;
const PAD = 4;

function buildPaths(candles: Candle[]) {
  const closes = candles.map((c) => c.c);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;

  const x = (i: number) =>
    candles.length > 1 ? (i / (candles.length - 1)) * W : W / 2;
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);

  const line = closes
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`)
    .join(" ");

  const area = `${line} L${W},${H} L0,${H} Z`;

  return {
    line,
    area,
    lastX: x(closes.length - 1),
    lastY: y(closes[closes.length - 1]),
  };
}

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

          <Chart candles={data.candles} up={data.changePct >= 0} />

          <div className="mt-4 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.14em] text-paper-muted">
            <span>BTC / USD · 5m · 6h</span>
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
    </figure>
  );
}

function Chart({ candles, up }: { candles: Candle[]; up: boolean }) {
  const { line, area, lastX, lastY } = buildPaths(candles);
  const stroke = up ? "#059669" : "#e11d48";
  const id = up ? "mkt-up" : "mkt-down";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-5 h-auto w-full"
      role="img"
      aria-label={`Bitcoin price, last 6 hours in 5 minute candles, currently trending ${
        up ? "up" : "down"
      }`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="3.5" fill={stroke} />
      <circle cx={lastX} cy={lastY} r="7" fill={stroke} opacity="0.18" />
    </svg>
  );
}
