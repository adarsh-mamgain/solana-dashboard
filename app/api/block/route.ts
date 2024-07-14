import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot");

  if (!slot) {
    return NextResponse.json(
      { error: "Block slot is required" },
      { status: 400 }
    );
  }

  try {
    const block = await connection.getBlock(parseInt(slot), {
      maxSupportedTransactionVersion: 0,
    });

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    const blockInfo = {
      slot: block.parentSlot + 1,
      blockTime: block.blockTime,
      parentSlot: block.parentSlot,
      transactions: block.transactions.length,
      blockhash: block.blockhash,
      previousBlockhash: block.previousBlockhash,
      rewards: block.rewards,
    };

    return NextResponse.json(blockInfo);
  } catch (error) {
    console.error("Error fetching block info:", error);
    return NextResponse.json(
      { error: "Failed to fetch block info" },
      { status: 500 }
    );
  }
}
