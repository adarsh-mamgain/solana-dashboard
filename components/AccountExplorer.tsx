"use client";

import { useState } from "react";
import { DAS } from "helius-sdk";
import { Input } from "./shared/Input";
import { Button } from "./shared/Button";
import { ErrorMessage } from "./shared/ErrorMessage";
import { Loading } from "./shared/Loading";
import { fetchData } from "../utils/api";

export default function AccountExplorer() {
  const [address, setAddress] = useState(
    "524nvr3JESQpYq5UUD7QMkpuDMg8TyyJBGr5m47jWZfe"
  );
  const [assets, setAssets] = useState<DAS.GetAssetResponseList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchAssets = async (pageNum: number) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<DAS.GetAssetResponseList>(
        `/api/assets-by-owner?ownerAddress=${address}&page=${pageNum}&limit=${limit}`
      );
      setAssets(data);
      setPage(pageNum);
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
        <Input
          value={address}
          onChange={setAddress}
          placeholder="Enter Account Address"
        />
        <Button onClick={() => fetchAssets(1)}>Fetch Assets</Button>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {assets && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">
            Assets owned by this account:
          </h3>
          <ul className="divide-y divide-gray-200">
            {assets.items.map((asset, index) => (
              <li key={index} className="py-2">
                <p className="font-semibold">{asset.content?.metadata.name}</p>
                <p className="text-sm text-gray-600">ID: {asset.id}</p>
                {asset.content?.files?.[0]?.uri && (
                  <img
                    src={asset.content.files[0].uri}
                    alt={asset.content?.metadata.name}
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => fetchAssets(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button
              onClick={() => fetchAssets(page + 1)}
              disabled={!assets.items.length}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
