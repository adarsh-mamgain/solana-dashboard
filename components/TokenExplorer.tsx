"use client";

import { useState } from "react";

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
      const response = await fetch(`/api/token?mintAddress=${mintAddress}`);
      if (!response.ok) {
        throw new Error("Failed to fetch token info");
      }
      const data = await response.json();
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
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter Token Mint Address"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={fetchTokenInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          Fetch Token Info
        </button>
      </div>
      {isLoading && <p className="text-gray-600">Loading...</p>}
      {error && (
        <p className="text-red-500 bg-red-100 p-2 rounded">Error: {error}</p>
      )}
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
