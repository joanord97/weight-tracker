"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ToastProvider";

export function WeightForm() {
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLatest, setFetchingLatest] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLatestWeight();
    }
  }, [user]);

  const fetchLatestWeight = async () => {
    setFetchingLatest(true);
    const { data, error } = await supabase
      .from("weights")
      .select("weight")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      showToast("Error fetching latest weight", "error");
    } else if (data && data.length > 0) {
      setWeight(data[0].weight.toString());
    }
    setFetchingLatest(false);
  };

  const adjustWeight = (amount: number) => {
    const currentWeight = parseFloat(weight) || 0;
    const newWeight = Math.max(0, currentWeight + amount).toFixed(1);
    setWeight(newWeight);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("weights")
      .insert({ user_id: user.id, weight: parseFloat(weight) });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Weight recorded successfully", "success");
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
