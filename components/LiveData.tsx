import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchData } from "../utils/api";

interface LiveDataState {
  slot: number;
  blockTime: number;
  transactionCount: number;
  price: number;
}

export default function LiveData() {
  const [data, setData] = useState<LiveDataState>({
    slot: 0,
    blockTime: 0,
    transactionCount: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const liveData = await fetchData<LiveDataState>("/api/live-data");
        setData(liveData);
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    };

    fetchLiveData();
    const intervalId = setInterval(fetchLiveData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const items = [
    { title: "Current Slot", value: data.slot || "N/A" },
    {
      title: "Latest Block Time",
      value: data.blockTime
        ? new Date(data.blockTime * 1000).toLocaleTimeString()
        : "N/A",
    },
    {
      title: "Recent TPS",
      value: data.transactionCount
        ? (data.transactionCount / 60).toFixed(2)
        : "N/A",
    },
    {
      title: "SOL Price",
      value: data.price ? `$${data.price.toFixed(2)}` : "N/A",
    },
  ];

  return (
    <>
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
