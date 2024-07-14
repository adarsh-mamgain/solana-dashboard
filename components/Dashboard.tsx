"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LiveData from "./LiveData";
import RecentTransactions from "./RecentTransactions";
import AssetExplorer from "./AssetExplorer";
import TransactionExplorer from "./TransactionExplorer";
import AccountExplorer from "./AccountExplorer";
import TokenExplorer from "./TokenExplorer";
import BlockExplorer from "./BlockExplorer";

const tabs = [
  { value: "assets", label: "Assets", component: AssetExplorer },
  {
    value: "transactions",
    label: "Transactions",
    component: TransactionExplorer,
  },
  { value: "accounts", label: "Accounts", component: AccountExplorer },
  { value: "tokens", label: "Tokens", component: TokenExplorer },
  { value: "blocks", label: "Blocks", component: BlockExplorer },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("assets");

  return (
    <div className="md:p-20 space-y-4 w-full h-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LiveData />
      </div>
      <RecentTransactions />
      <Card className="h-full">
        <CardContent className="p-6 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent className="mt-8" key={tab.value} value={tab.value}>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
