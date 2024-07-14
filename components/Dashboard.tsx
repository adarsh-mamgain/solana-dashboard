"use client";

import { useState } from "react";
import AssetExplorer from "./AssetExplorer";
import TransactionExplorer from "./TransactionExplorer";
import AccountExplorer from "./AccountExplorer";
import TokenExplorer from "./TokenExplorer";
import BlockExplorer from "./BlockExplorer";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("assets");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">Solana Data Explorer</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex flex-wrap">
            {["assets", "transactions", "accounts", "tokens", "blocks"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`mr-2 mb-2 px-4 py-2 rounded ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
          {activeTab === "assets" && <AssetExplorer />}
          {activeTab === "transactions" && <TransactionExplorer />}
          {activeTab === "accounts" && <AccountExplorer />}
          {activeTab === "tokens" && <TokenExplorer />}
          {activeTab === "blocks" && <BlockExplorer />}
        </div>
      </main>
    </div>
  );
}
