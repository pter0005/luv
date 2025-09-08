
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  fixed?: boolean;
}

export function AnimatedBackground({ fixed = false }: AnimatedBackgroundProps) {
  return (
    <div className={cn(
      "top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none",
      fixed ? "fixed" : "absolute"
    )}>
       <div className="mystic-fog-1"></div>
       <div className="mystic-fog-2"></div>
    </div>
  );
}
