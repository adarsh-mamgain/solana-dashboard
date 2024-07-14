import { NextResponse } from "next/server";
import { Helius } from "helius-sdk";

const helius = new Helius(process.env.HELIUS_API_KEY || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerAddress = searchParams.get("ownerAddress");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  if (!ownerAddress) {
    return NextResponse.json(
      { error: "Owner address is required" },
      { status: 400 }
    );
  }

  try {
    const assets = await helius.rpc.getAssetsByOwner({
      ownerAddress,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets by owner:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}
