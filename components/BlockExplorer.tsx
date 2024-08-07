"use client";

import { useState } from "react";
import { Input } from "./shared/Input";
import { Button } from "./shared/Button";
import { ErrorMessage } from "./shared/ErrorMessage";
import { Loading } from "./shared/Loading";
import { fetchData } from "../utils/api";

interface BlockInfo {
  slot: number;
  blockTime: number | null;
  blockHeight: number | null;
  parentSlot: number;
  transactions: number;
  blockhash: string;
  previousBlockhash: string;
  rewards: {
    pubkey: string;
    lamports: number;
    postBalance: number;
    rewardType: string;
  }[];
}

export default function BlockExplorer() {
  const [slot, setSlot] = useState("");
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockInfo = async () => {
    if (!slot) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<BlockInfo>(`/api/block?slot=${slot}`);
      setBlockInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Block Explorer</h2>
      <div className="flex mb-4">
        <Input value={slot} onChange={setSlot} placeholder="Enter Block Slot" />
        <Button onClick={fetchBlockInfo}>Fetch Block Info</Button>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {blockInfo && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Block Information</h3>
          <p>
            <span className="font-semibold">Slot:</span> {blockInfo.slot}
          </p>
          <p>
            <span className="font-semibold">Block Time:</span>{" "}
            {blockInfo.blockTime
              ? new Date(blockInfo.blockTime * 1000).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Block Height:</span>{" "}
            {blockInfo.blockHeight}
          </p>
          <p>
            <span className="font-semibold">Parent Slot:</span>{" "}
            {blockInfo.parentSlot}
          </p>
          <p>
            <span className="font-semibold">Transactions:</span>{" "}
            {blockInfo.transactions}
          </p>
          <p>
            <span className="font-semibold">Blockhash:</span>{" "}
            {blockInfo.blockhash}
          </p>
          <p>
            <span className="font-semibold">Previous Blockhash:</span>{" "}
            {blockInfo.previousBlockhash}
          </p>
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Rewards</h4>
            <ul className="list-disc pl-5">
              {blockInfo.rewards.map((reward, index) => (
                <li key={index}>
                  {reward.pubkey.slice(0, 8)}...{reward.pubkey.slice(-8)} -{" "}
                  {reward.lamports / 1e9} SOL ({reward.rewardType})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
