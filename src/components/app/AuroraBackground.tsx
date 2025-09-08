"use client";
import React from 'react';
import { cn } from "@/lib/utils";

export function AuroraBackground() {

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 aurora">
      <div className="aurora__item"></div>
      <div className="aurora__item"></div>
      <div className="aurora__item"></div>
    </div>
  );
}
