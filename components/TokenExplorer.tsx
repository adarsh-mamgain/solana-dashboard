"use client";

import { useState } from "react";
import { Input } from "./shared/Input";
import { Button } from "./shared/Button";
import { ErrorMessage } from "./shared/ErrorMessage";
import { Loading } from "./shared/Loading";
import { fetchData } from "../utils/api";

interface TokenInfo {
  mintAddress: string;
  supply: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
  decimals: number;
  largestAccounts: {
    address: string;
    amount: string;
  }[];
}

export default function TokenExplorer() {
  const [mintAddress, setMintAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenInfo = async () => {
    if (!mintAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<TokenInfo>(
        `/api/token?mintAddress=${mintAddress}`
      );
      setTokenInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Token Explorer</h2>
      <div className="flex mb-4">
        <Input
          value={mintAddress}
          onChange={setMintAddress}
          placeholder="Enter Token Mint Address"
        />
        <Button onClick={fetchTokenInfo}>Fetch Token Info</Button>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {tokenInfo && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Token Information</h3>
          <p>
            <span className="font-semibold">Mint Address:</span>{" "}
            {tokenInfo.mintAddress}
          </p>
          <p>
            <span className="font-semibold">Total Supply:</span>{" "}
            {tokenInfo.supply.uiAmountString}
          </p>
          <p>
            <span className="font-semibold">Decimals:</span>{" "}
            {tokenInfo.decimals}
          </p>
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Largest Accounts</h4>
            <ul className="list-disc pl-5">
              {tokenInfo.largestAccounts.map((account, index) => (
                <li key={index}>
                  {account.address.slice(0, 8)}...{account.address.slice(-8)} -{" "}
                  {account.amount} tokens
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
