"use client";

import React, { createContext, useState, useContext, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface WeightEntry {
  created_at: string;
  weight: number;
}

interface WeightContextType {
  weights: WeightEntry[];
  fetchWeights: (userId: string) => Promise<void>;
  addWeight: (userId: string, weight: number) => Promise<void>;
}

const WeightContext = createContext<WeightContextType | undefined>(undefined);

export function WeightProvider({ children }: { children: React.ReactNode }) {
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  const fetchWeights = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("weights")
      .select("created_at, weight")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching weights:", error);
    } else {
      setWeights(data || []);
    }
  }, []);

  const addWeight = useCallback(async (userId: string, weight: number) => {
    const { data, error } = await supabase
      .from("weights")
      .insert({ user_id: userId, weight })
      .select();

    if (error) {
      console.error("Error adding weight:", error);
    } else if (data) {
      setWeights((prevWeights) => [...prevWeights, data[0]]);
    }
  }, []);

  return (
    <WeightContext.Provider value={{ weights, fetchWeights, addWeight }}>
      {children}
    </WeightContext.Provider>
  );
}

export function useWeight() {
  const context = useContext(WeightContext);
  if (context === undefined) {
    throw new Error("useWeight must be used within a WeightProvider");
  }
  return context;
}
