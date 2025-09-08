
"use client";

import { cn } from "@/lib/utils";

export function AuroraBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div
        className={cn(
          "absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-[200%] opacity-40",
          "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background/0 to-background/0",
          "animate-aurora"
        )}
      ></div>
    </div>
  );
}
