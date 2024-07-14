"use client";

import { useState } from "react";
import Layout from "./Layout";
import AssetExplorer from "./AssetExplorer";
import TransactionExplorer from "./TransactionExplorer";
import AccountExplorer from "./AccountExplorer";
import TokenExplorer from "./TokenExplorer";
import BlockExplorer from "./BlockExplorer";

const tabs = [
  { name: "assets", component: AssetExplorer },
  { name: "transactions", component: TransactionExplorer },
  { name: "accounts", component: AccountExplorer },
  { name: "tokens", component: TokenExplorer },
  { name: "blocks", component: BlockExplorer },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("assets");

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`mr-2 mb-2 px-4 py-2 rounded transition-colors ${
              activeTab === tab.name
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            style={{ display: activeTab === tab.name ? "block" : "none" }}
          >
            {tab.component()}
          </div>
        ))}
      </div>
    </Layout>
  );
}
