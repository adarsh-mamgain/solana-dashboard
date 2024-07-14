import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "");

export async function GET() {
  try {
    const signatures = await connection.getConfirmedSignaturesForAddress2(
      new PublicKey("11111111111111111111111111111111"),
      { limit: 5 }
    );
    return NextResponse.json(signatures);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return NextResponse.json({ signatures: [] });
  }
}
