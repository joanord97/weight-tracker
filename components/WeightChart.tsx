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

export function WeightChart() {
  const [weights, setWeights] = useState<
    { created_at: string; weight: number }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWeights();
    }
  }, [user]);

  const fetchWeights = async () => {
    const { data, error } = await supabase
      .from("weights")
      .select("created_at, weight")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching weights:", error);
    } else {
      setWeights(data || []);
    }
  };

  const calculateMovingAverage = (data: number[], windowSize: number) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        result.push(null); // Not enough data for full window
      } else {
        const windowSum = data
          .slice(i - windowSize + 1, i + 1)
          .reduce((sum, val) => sum + val, 0);
        result.push(Number((windowSum / windowSize).toFixed(1)));
      }
    }
    return result;
  };

  const chartData = {
    labels: weights.map((w) => new Date(w.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Weight",
        data: weights.map((w) => w.weight),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 3,
      },
      {
        label: "7-Day Average",
        data: calculateMovingAverage(
          weights.map((w) => w.weight),
          7
        ),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        pointRadius: 0,
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
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)} kg`;
          },
        },
      },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Weight History</h2>
      {weights.length > 0 ? (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>No weight data available</p>
      )}
    </div>
  );
}
