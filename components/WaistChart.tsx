"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function WaistChart() {
  const [waistMeasurements, setWaistMeasurements] = useState<
    { created_at: string; waist: number }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWaistMeasurements();
    }
  }, [user]);

  const fetchWaistMeasurements = async () => {
    const { data, error } = await supabase
      .from("measurements")
      .select("created_at, waist")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching waist measurements:", error);
    } else {
      setWaistMeasurements(data || []);
    }
  };

  const chartData = {
    labels: waistMeasurements.map((m) =>
      new Date(m.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Waist",
        data: waistMeasurements.map((m) => m.waist),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Waist History</h2>
      {waistMeasurements.length > 0 ? (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>No waist measurement data available</p>
      )}
    </div>
  );
}
