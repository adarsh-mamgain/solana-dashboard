"use client";

import { useState } from "react";
import { DAS } from "helius-sdk";

export default function AccountExplorer() {
  const [address, setAddress] = useState("");
  const [assets, setAssets] = useState<DAS.GetAssetResponseList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/assets-by-owner?ownerAddress=${address}&page=1&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Account Explorer</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Account Address"
          className="flex-grow bg-gray-600 p-2 border rounded-l"
        />
        <button
          onClick={fetchAssets}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Fetch Assets
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {assets && (
        <div className="bg-gray-600 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">
            Assets owned by this account:
          </h3>
          <ul>
            {assets.items.map((asset, index) => (
              <li key={index} className="mb-2">
                <p>Name: {asset.content?.metadata.name}</p>
                <p>ID: {asset.id}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
