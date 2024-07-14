import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "");

export async function GET() {
  try {
    let slot = 0;
    let blockTime = 0;
    let transactionCount = 0;

    try {
      const [slotResponse, recentPerformanceSamples] = await Promise.all([
        connection.getSlot(),
        connection.getRecentPerformanceSamples(1),
      ]);

      slot = slotResponse;
      blockTime = (await connection.getBlockTime(slot)) || 0;
      transactionCount = recentPerformanceSamples[0]?.numTransactions || 0;
    } catch (error) {
      console.error("Error fetching Solana data:", error);
    }

    // Fetch SOL price
    const solPriceResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const solPriceData = await solPriceResponse.json();
    const price = solPriceData.solana.usd;

    return NextResponse.json({
      slot,
      blockTime,
      transactionCount,
      price,
    });
  } catch (error) {
    console.error("Error fetching live data:", error);
    return NextResponse.json(
      { error: "Failed to fetch live data" },
      { status: 500 }
    );
  }
}
