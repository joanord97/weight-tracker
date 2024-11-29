"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Scale, Ruler, History } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around items-center fixed bottom-0 left-0 right-0 bg-white border-t p-2">
      <Link
        href="/weight"
        className={cn(
          "flex flex-col items-center p-2 rounded-md",
          pathname === "/weight" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Scale className="h-6 w-6" />
        <span className="text-xs">Weight</span>
      </Link>
      <Link
        href="/waist"
        className={cn(
          "flex flex-col items-center p-2 rounded-md",
          pathname === "/waist" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Ruler className="h-6 w-6" />
        <span className="text-xs">Waist</span>
      </Link>
      <Link
        href="/history"
        className={cn(
          "flex flex-col items-center p-2 rounded-md",
          pathname === "/history" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <History className="h-6 w-6" />
        <span className="text-xs">History</span>
      </Link>
    </nav>
  );
}
