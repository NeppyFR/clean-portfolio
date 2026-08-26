import "server-only";

/**
 * BTC 5-minute OHLC, fetched on the server and cached for 5 minutes.
 *
 * Rate limiting / cost:
 * - All three sources are free public endpoints with no API key and no billing.
 * - The fetch runs on the server with `next: { revalidate: 300 }`, so Next.js
 *   makes at most ONE upstream request per 5 minutes for the whole site,
 *   however many people are viewing it. Visitors never call the exchange
 *   directly, so traffic cannot translate into rate limiting.
 * - 300s matches the candle interval: refetching faster would only return
 *   the same candle.
 *
 * Sources are tried in order; Binance is geo-blocked in some regions, so
 * Coinbase and Kraken act as fallbacks. Every failure is swallowed — the
 * card degrades to an "unavailable" state rather than breaking the page
 * or failing the build.
 */

export type Candle = { t: number; o: number; h: number; l: number; c: number };

/** 72 candles x 5min = 6 hours of history. */
const LIMIT = 72;
const REVALIDATE = 300;

const opts = {
  next: { revalidate: REVALIDATE },
  headers: { accept: "application/json", "user-agent": "singh-angad.ch" },
} as const;

async function fromBinance(): Promise<Candle[]> {
  const r = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=${LIMIT}`,
    opts,
  );
  if (!r.ok) throw new Error(`binance ${r.status}`);
  const raw = (await r.json()) as [number, string, string, string, string][];
  return raw.map((k) => ({
    t: k[0],
    o: +k[1],
    h: +k[2],
    l: +k[3],
    c: +k[4],
  }));
}

async function fromCoinbase(): Promise<Candle[]> {
  // [time, low, high, open, close, volume], newest first, seconds
  const r = await fetch(
    "https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=300",
    opts,
  );
  if (!r.ok) throw new Error(`coinbase ${r.status}`);
  const raw = (await r.json()) as number[][];
  return raw
    .slice(0, LIMIT)
    .reverse()
    .map((k) => ({ t: k[0] * 1000, l: k[1], h: k[2], o: k[3], c: k[4] }));
}

async function fromKraken(): Promise<Candle[]> {
  // result.<pair>: [time, open, high, low, close, vwap, volume, count]
  const r = await fetch(
    "https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=5",
    opts,
  );
  if (!r.ok) throw new Error(`kraken ${r.status}`);
  const json = (await r.json()) as {
    error: string[];
    result: Record<string, unknown>;
  };
  if (json.error?.length) throw new Error(json.error.join(","));
  const key = Object.keys(json.result).find((k) => k !== "last");
  if (!key) throw new Error("kraken: no series");
  const raw = json.result[key] as [number, string, string, string, string][];
  return raw.slice(-LIMIT).map((k) => ({
    t: k[0] * 1000,
    o: +k[1],
    h: +k[2],
    l: +k[3],
    c: +k[4],
  }));
}

export type MarketData = {
  candles: Candle[];
  last: number;
  changePct: number;
  low: number;
  high: number;
  source: string;
};

export async function getBtcCandles(): Promise<MarketData | null> {
  const sources: [string, () => Promise<Candle[]>][] = [
    ["Binance", fromBinance],
    ["Coinbase", fromCoinbase],
    ["Kraken", fromKraken],
  ];

  for (const [source, fn] of sources) {
    try {
      const candles = (await fn()).filter(
        (c) => Number.isFinite(c.c) && Number.isFinite(c.o),
      );
      if (candles.length < 2) continue;

      const first = candles[0].o;
      const last = candles[candles.length - 1].c;
      return {
        candles,
        last,
        changePct: first ? ((last - first) / first) * 100 : 0,
        low: Math.min(...candles.map((c) => c.l)),
        high: Math.max(...candles.map((c) => c.h)),
        source,
      };
    } catch {
      // try the next source
    }
  }
  return null;
}
