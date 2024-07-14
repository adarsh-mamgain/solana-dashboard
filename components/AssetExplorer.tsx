"use client";

import { useState } from "react";
import { DAS } from "helius-sdk";

export default function AssetExplorer() {
  const [assetId, setAssetId] = useState("");
  const [asset, setAsset] = useState<DAS.GetAssetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAsset = async () => {
    if (!assetId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/asset?id=${assetId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch asset");
      }
      const data = await response.json();
      setAsset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Asset Explorer</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Enter Asset ID"
          className="flex-grow bg-gray-600 p-2 border rounded-l"
        />
        <button
          onClick={fetchAsset}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Fetch Asset
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {asset && (
        <div className="bg-gray-600 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">
            {asset.content?.metadata.name}
          </h3>
          <p>Symbol: {asset.content?.metadata.symbol}</p>
          <p>Owner: {asset.ownership.owner}</p>
          <p>Royalty: {asset.royalty?.percent}%</p>
          <p>Creators:</p>
          <ul>
            {asset.creators?.map((creator, index) => (
              <li key={index}>
                {creator.address} - Share: {creator.share}% - Verified:{" "}
                {creator.verified ? "Yes" : "No"}
              </li>
            ))}
          </ul>
          {asset.content?.files?.[0]?.uri && (
            <img
              src={asset.content.files[0].uri}
              alt={asset.content?.metadata.name}
              className="mt-4 max-w-full h-auto"
            />
          )}
        </div>
      )}
    </div>
  );
}
