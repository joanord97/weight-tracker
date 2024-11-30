"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { startOfDay, addDays, isWithinInterval } from "date-fns";
import { useWeight } from "@/contexts/WeightContext";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Trend {
  weekly: number;
  daily: number;
}

export function WeightChart() {
  const { user } = useAuth();
  const { weights, fetchWeights } = useWeight();

  useEffect(() => {
    if (user) {
      fetchWeights(user.id);
    }
  }, [user, fetchWeights]);

  const groupWeightsByDate = (data: typeof weights): Map<string, number[]> => {
    const groupedWeights = new Map<string, number[]>();
    data.forEach((entry) => {
      const date = startOfDay(new Date(entry.created_at)).toISOString();
      if (!groupedWeights.has(date)) {
        groupedWeights.set(date, []);
      }
      groupedWeights.get(date)!.push(entry.weight);
    });
    return groupedWeights;
  };

  const calculateDailyAverage = (
    groupedWeights: Map<string, number[]>
  ): { x: number; y: number }[] => {
    return Array.from(groupedWeights.entries()).map(([date, weights]) => ({
      x: new Date(date).getTime(),
      y: Number(
        (
          weights.reduce((sum, weight) => sum + weight, 0) / weights.length
        ).toFixed(1)
      ),
    }));
  };

  const calculateMovingAverage = (
    dailyAverages: { x: number; y: number }[],
    windowSize: number
  ): { x: number; y: number }[] => {
    return dailyAverages.map((point, index, array) => {
      const windowStart = addDays(new Date(point.x), -windowSize + 1);
      const windowEnd = new Date(point.x);
      const windowData = array.filter((p) =>
        isWithinInterval(new Date(p.x), { start: windowStart, end: windowEnd })
      );
      const averageWeight =
        windowData.reduce((sum, p) => sum + p.y, 0) / windowData.length;
      return { x: point.x, y: Number(averageWeight.toFixed(1)) };
    });
  };

  const calculateSlope = (data: { x: number; y: number }[]): Trend | null => {
    if (data.length < 2) return null;
    const lastTwo = data.slice(-2);
    const timeDiff = (lastTwo[1].x - lastTwo[0].x) / (1000 * 60 * 60 * 24 * 7); // Convert to weeks
    const weeklyTrend = Number(
      ((lastTwo[1].y - lastTwo[0].y) / timeDiff).toFixed(2)
    );
    const dailyTrend = Number((weeklyTrend / 7).toFixed(2));
    return { weekly: weeklyTrend, daily: dailyTrend };
  };

  const groupedWeights = groupWeightsByDate(weights);
  const dailyAverages = calculateDailyAverage(groupedWeights);
  const movingAverage = calculateMovingAverage(dailyAverages, 7);

  const chartData: ChartData<"line"> = {
    datasets: [
      {
        label: "Daily Average",
        data: dailyAverages,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 3,
      },
      {
        label: "7-Day Average",
        data: movingAverage,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const trend = calculateSlope(movingAverage);
  const trendText =
    trend !== null
      ? `Weekly trend: ${trend.weekly > 0 ? "+" : ""}${
          trend.weekly
        } kg/week | Daily trend: ${trend.daily > 0 ? "+" : ""}${
          trend.daily
        } kg/day`
      : "Not enough data for trend";

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
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
        <>
          <div className="h-64">
            <Line data={chartData} options={options} />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600">{trendText}</p>
        </>
      ) : (
        <p>No weight data available</p>
      )}
    </div>
  );
}
