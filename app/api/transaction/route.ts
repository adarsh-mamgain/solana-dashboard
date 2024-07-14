import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const signature = searchParams.get("signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Transaction signature is required" },
      { status: 400 }
    );
  }

  try {
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
