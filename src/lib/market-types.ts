/**
 * Shared shapes for the market card.
 *
 * Kept out of `market.ts` because that module is `server-only`, while the
 * presentation component is a client component and needs these types.
 */

export type Candle = { t: number; o: number; h: number; l: number; c: number };

export type MarketData = {
  candles: Candle[];
  last: number;
  changePct: number;
  low: number;
  high: number;
  source: string;
};
