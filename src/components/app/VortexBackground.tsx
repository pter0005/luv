
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export function VortexBackground() {
  return (
    <div className={cn("absolute inset-0 w-full h-full overflow-hidden bg-black")}>
      <div className="purple-fog"></div>
    </div>
  );
}

    