"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

interface WeightEntry {
  created_at: string;
  weight: number;
}

export default function WeightList() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeights = async () => {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("weights")
        .select("created_at, weight")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching weights:", error);
        setError("Failed to fetch weight data");
      } else {
        setWeights(data || []);
      }

      setIsLoading(false);
    };

    fetchWeights();
  }, [supabase]);

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  if (error)
    return (
      <div className="h-full flex items-center justify-center">
        Error: {error}
      </div>
    );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Weight History</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-background">Date</TableHead>
              <TableHead className="sticky top-0 bg-background">
                Weight (kg)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weights.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(entry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.weight.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
