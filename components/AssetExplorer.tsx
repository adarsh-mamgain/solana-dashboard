"use client";

import { useState } from "react";
import { DAS } from "helius-sdk";
import { Input } from "./shared/Input";
import { Button } from "./shared/Button";
import { ErrorMessage } from "./shared/ErrorMessage";
import { Loading } from "./shared/Loading";
import { fetchData } from "../utils/api";

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
      const data = await fetchData<DAS.GetAssetResponse>(
        `/api/asset?id=${assetId}`
      );
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
        <Input
          value={assetId}
          onChange={setAssetId}
          placeholder="Enter Asset ID"
        />
        <Button onClick={fetchAsset}>Fetch Asset</Button>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {asset && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">
            {asset.content?.metadata.name}
          </h3>
          <p>
            <span className="font-semibold">Symbol:</span>{" "}
            {asset.content?.metadata.symbol}
          </p>
          <p>
            <span className="font-semibold">Owner:</span>{" "}
            {asset.ownership.owner}
          </p>
          <p>
            <span className="font-semibold">Royalty:</span>{" "}
            {asset.royalty?.percent}%
          </p>
          <p>
            <span className="font-semibold">Mint:</span> {asset.id}
          </p>
          {asset.compression && (
            <p>
              <span className="font-semibold">Compressed:</span>{" "}
              {asset.compression.compressed ? "Yes" : "No"}
            </p>
          )}
          <div className="mt-4">
            <p className="font-semibold">Creators:</p>
            <ul className="list-disc pl-5">
              {asset.creators?.map((creator, index) => (
                <li key={index}>
                  {creator.address} - Share: {creator.share}% - Verified:{" "}
                  {creator.verified ? "Yes" : "No"}
                </li>
              ))}
            </ul>
          </div>
          {asset.content?.files?.[0]?.uri && (
            <div className="mt-4">
              <p className="font-semibold">Image:</p>
              <img
                src={asset.content.files[0].uri}
                alt={asset.content?.metadata.name}
                className="mt-2 max-w-full h-auto rounded"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
