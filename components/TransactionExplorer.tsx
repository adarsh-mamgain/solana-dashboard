"use client";

import { useState } from "react";
import { VersionedTransactionResponse } from "@solana/web3.js";

export default function TransactionExplorer() {
  const [signature, setSignature] = useState("");
  const [transaction, setTransaction] =
    useState<VersionedTransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    if (!signature) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transaction?signature=${signature}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setTransaction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Explorer</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Enter Transaction Signature"
          className="flex-grow bg-gray-600  p-2 border rounded-l"
        />
        <button
          onClick={fetchTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Fetch Transaction
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {transaction && (
        <div className="bg-gray-600 p-4 rounded shadow">
          <p>
            Block Time:{" "}
            {new Date(transaction.blockTime! * 1000).toLocaleString()}
          </p>
          <p>Slot: {transaction.slot}</p>
          <p>Fee: {transaction.meta?.fee} lamports</p>
          <h3 className="font-semibold mt-2">Instructions:</h3>
          <ul className="list-disc pl-5">
            {/* {transaction.transaction.message.instructions.map(
              (instruction, index) => (
                <li key={index}>
                  Instruction {index + 1}: Program{" "}
                  {instruction.programId.toString()}
                </li>
              )
            )} */}
            <p>{JSON.stringify(transaction)}</p>
          </ul>
        </div>
      )}
    </div>
  );
}
