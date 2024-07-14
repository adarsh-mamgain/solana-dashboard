import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mintAddress = searchParams.get("mintAddress");

  if (!mintAddress) {
    return NextResponse.json(
      { error: "Mint address is required" },
      { status: 400 }
    );
  }

  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const tokenSupply = await connection.getTokenSupply(mintPublicKey);
    const largestAccounts = await connection.getTokenLargestAccounts(
      mintPublicKey
    );

    const tokenInfo = {
      mintAddress,
      supply: tokenSupply.value,
      decimals: tokenSupply.value.decimals,
      largestAccounts: largestAccounts.value.map((account) => ({
        address: account.address.toBase58(),
        amount: account.amount,
      })),
    };

    return NextResponse.json(tokenInfo);
  } catch (error) {
    console.error("Error fetching token info:", error);
    return NextResponse.json(
      { error: "Failed to fetch token info" },
      { status: 500 }
    );
  }
}
