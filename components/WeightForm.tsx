"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ToastProvider";
import { useWeight } from "@/contexts/WeightContext";

export function WeightForm() {
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLatest, setFetchingLatest] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { weights, addWeight } = useWeight();

  useEffect(() => {
    if (user && weights.length > 0) {
      setWeight(weights[weights.length - 1].weight.toString());
      setFetchingLatest(false);
    }
  }, [user, weights]);

  const adjustWeight = (amount: number) => {
    const currentWeight = parseFloat(weight) || 0;
    const newWeight = Math.max(0, currentWeight + amount).toFixed(1);
    setWeight(newWeight);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addWeight(user.id, parseFloat(weight));
      showToast("Weight recorded successfully", "success");
    } catch (error) {
      console.error("Error recording weight:", error);
      showToast("Error recording weight", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        step="0.1"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
        disabled={fetchingLatest}
      />
      <div className="grid grid-cols-4 gap-2">
        <Button
          type="button"
          onClick={() => adjustWeight(-0.5)}
          disabled={fetchingLatest}
          variant="outline"
          size="sm"
        >
          -0.5
        </Button>
        <Button
          type="button"
          onClick={() => adjustWeight(-0.1)}
          disabled={fetchingLatest}
          variant="outline"
          size="sm"
        >
          -0.1
        </Button>
        <Button
          type="button"
          onClick={() => adjustWeight(0.1)}
          disabled={fetchingLatest}
          variant="outline"
          size="sm"
        >
          +0.1
        </Button>
        <Button
          type="button"
          onClick={() => adjustWeight(0.5)}
          disabled={fetchingLatest}
          variant="outline"
          size="sm"
        >
          +0.5
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading || fetchingLatest}
      >
        {loading ? "Recording..." : "Record Weight"}
      </Button>
    </form>
  );
}
