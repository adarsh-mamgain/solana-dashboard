import { useEffect, useState } from "react";
import { ConfirmedSignatureInfo } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchData } from "../utils/api";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>(
    []
  );

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const data = await fetchData<{ signatures: ConfirmedSignatureInfo[] }>(
          "/api/recent-transactions"
        );
        setTransactions(data.signatures || []);
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchRecentTransactions();
    const intervalId = setInterval(fetchRecentTransactions, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((tx, index) => (
              <li key={index} className="bg-muted p-2 rounded">
                <p className="text-sm font-medium">
                  {tx.signature.slice(0, 20)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  Slot: {tx.slot} | Time:{" "}
                  {tx.blockTime
                    ? new Date(tx.blockTime * 1000).toLocaleTimeString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No recent transactions available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
