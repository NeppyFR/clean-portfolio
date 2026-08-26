import { getBtcCandles } from "@/lib/market";
import { MarketCardView } from "./MarketCardView";

/**
 * Server half of the market card: fetches BTC candles and hands them to the
 * client view, which owns presentation so the copy can follow the EN/DE
 * toggle.
 *
 * The fetch stays on the server, so visitors never call an exchange and the
 * ISR cache still caps upstream traffic at one request per 5 minutes for the
 * whole site. See src/lib/market.ts.
 */
export async function MarketCard() {
  const data = await getBtcCandles();
  return <MarketCardView data={data} />;
}
