"use client";

import { useState } from "react";
import { VersionedTransactionResponse } from "@solana/web3.js";
import { Input } from "./shared/Input";
import { Button } from "./shared/Button";
import { ErrorMessage } from "./shared/ErrorMessage";
import { Loading } from "./shared/Loading";
import { fetchData } from "../utils/api";

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
      const data = await fetchData<VersionedTransactionResponse>(
        `/api/transaction?signature=${signature}`
      );
      setTransaction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInstructions = (transaction: VersionedTransactionResponse) => {
    if ("message" in transaction.transaction) {
      // Versioned transaction
      return transaction.transaction.message.compiledInstructions.map(
        (instruction, index) => (
          <li key={index}>
            Instruction {index + 1}: Program{" "}
            {transaction.transaction.message.staticAccountKeys[
              instruction.programIdIndex
            ].toBase58()}
          </li>
        )
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Explorer</h2>
      <div className="flex mb-4">
        <Input
          value={signature}
          onChange={setSignature}
          placeholder="Enter Transaction Signature"
        />
        <Button onClick={fetchTransaction}>Fetch Transaction</Button>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {transaction && (
        <div className="bg-white p-4 rounded shadow">
          <p>
            <span className="font-semibold">Block Time:</span>{" "}
            {new Date(transaction.blockTime! * 1000).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Slot:</span> {transaction.slot}
          </p>
          <p>
            <span className="font-semibold">Fee:</span> {transaction.meta?.fee}{" "}
            lamports
          </p>
          <h3 className="font-semibold mt-2">Instructions:</h3>
          <ul className="list-disc pl-5">{renderInstructions(transaction)}</ul>
        </div>
      )}
    </div>
  );
}
