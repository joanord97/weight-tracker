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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";

interface WeightEntry {
  id: number;
  created_at: string;
  weight: number;
}

export default function WeightList() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

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
      .select("id, created_at, weight")
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

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("weights").delete().eq("id", id);

    if (error) {
      console.error("Error deleting weight entry:", error);
      showToast("Failed to delete weight entry", "error");
    } else {
      showToast("Weight entry deleted successfully", "success");
      fetchWeights(); // Refresh the list after deletion
    }
  };

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
              <TableHead className="sticky top-0 bg-background">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weights.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.weight.toFixed(1)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
