import { Helius } from "helius-sdk";
import { HeliusCluster } from "helius-sdk";

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY as string;
const HELIUS_CLUSTER: HeliusCluster = "mainnet-beta";

let heliusClient: Helius;

if (typeof window !== "undefined") {
  heliusClient = new Helius(HELIUS_API_KEY, HELIUS_CLUSTER);
}

export { heliusClient };
