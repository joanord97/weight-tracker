"use client";

import { WeightChart } from "@/components/WeightChart";
import { WeightForm } from "@/components/WeightForm";
import { WeightProvider } from "@/contexts/WeightContext";

export default function DashboardPage() {
  return (
    <WeightProvider>
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <div className="flex-grow flex flex-col space-y-4 overflow-hidden max-h-[80vh]">
          <div className="flex-grow overflow-auto">
            <WeightChart />
          </div>
          <div className="w-full max-w-md mx-auto">
            <WeightForm />
          </div>
        </div>
      </div>
    </WeightProvider>
  );
}
