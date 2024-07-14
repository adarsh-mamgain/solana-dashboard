"use client";

import { useState } from "react";
import AssetExplorer from "./AssetExplorer";
import TransactionExplorer from "./TransactionExplorer";
import AccountExplorer from "./AccountExplorer";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("assets");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Solana Data Explorer</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "assets" ? "bg-blue-500 text-white" : "bg-gray-600"
          }`}
          onClick={() => setActiveTab("assets")}
        >
          Assets
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "transactions"
              ? "bg-blue-500 text-white"
              : "bg-gray-600"
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "accounts" ? "bg-blue-500 text-white" : "bg-gray-600"
          }`}
          onClick={() => setActiveTab("accounts")}
        >
          Accounts
        </button>
      </div>
      {activeTab === "assets" && <AssetExplorer />}
      {activeTab === "transactions" && <TransactionExplorer />}
      {activeTab === "accounts" && <AccountExplorer />}
    </div>
  );
}
